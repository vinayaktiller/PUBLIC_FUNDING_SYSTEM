from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.db import database_sync_to_async
from users.models import PendingUser  # Make sure to import your model
import re

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.group_name = f"notifications_{self.user_id}"
        print("Consumer speaking, group_name is " + self.group_name)

        # Add the user to a group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Remove the user from the group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """
        Handles incoming messages from the client.
        Processes the notification ID and response, and performs actions on the PendingUser instance.
        """
        try:
            # Parse the JSON data received from the client
            data = json.loads(text_data)
            notification_id = data.get("notificationId")
            response = data.get("response")

            # Validate the data
            if not notification_id or response is None:
                raise ValueError("Missing 'notificationId' or 'response' in the message")

            print(f"Received response: {response} for notification ID: {notification_id}")

            # Perform actions based on the response
            if response.lower() == "yes":
                # Fetch the PendingUser instance using the email
                pending_user = await database_sync_to_async(PendingUser.objects.get)(gmail=notification_id)
                print("Pending user is " + str(pending_user.first_name))
                if pending_user:
                    print("Pending user is " + str(pending_user.last_name))
                    # Update the instance and transfer verification
                    pending_user.is_verified = True
                    print("Pending user is " + str(pending_user.is_verified))
                    await database_sync_to_async(pending_user.verify_and_transfer)()
                    print(f"User {notification_id} has been verified and transferred.")
                else:
                    raise ValueError(f"No PendingUser found for email: {notification_id}")
            elif response.lower() == "no":
                # Delete the PendingUser instance
                pending_user = await database_sync_to_async(PendingUser.objects.get)(gmail=notification_id)

                if pending_user:
                    await database_sync_to_async(pending_user.delete)()
                    print(f"User {notification_id} was not verified and has been deleted.")
                else:
                    raise ValueError(f"No PendingUser found for email: {notification_id}")
            else:
                raise ValueError(f"Invalid response: {response}")

            # Notify the client about the successful processing
            await self.send(json.dumps({"status": "success", "message": "Action performed successfully"}))
        except json.JSONDecodeError:
            # Handle invalid JSON format
            await self.send(json.dumps({"error": "Invalid JSON format"}))
        except PendingUser.DoesNotExist:
            # Handle case where PendingUser does not exist
            await self.send(json.dumps({"error": f"PendingUser with email {notification_id} does not exist"}))
        except Exception as e:
            # General error handling
            print(f"Error in receive method: {e}")
            await self.send(json.dumps({"error": str(e)}))


    # async def receive(self, text_data):
    #     """
    #     Handles incoming messages (responses) from the client.
    #     """
    #     try:
    #         data = json.loads(text_data)
    #         notification_id = data.get("notificationId")
    #         response = data.get("response")

    #         if not notification_id or not response:
    #             error_message = {
    #                 "error": "Invalid data. 'notificationId' and 'response' are required."
    #             }
    #             await self.send(text_data=json.dumps(error_message))
    #             print(f"Invalid data received: {data}")
    #             return

    #         print(f"Received response: {response} for notification ID: {notification_id}")
            
    #         # Call the synchronous function asynchronously
    #         #await self.handle_response_from_user(notification_id, response)

    #         # Process the response or send it to another function
    #         await self.channel_layer.group_send(
    #             f"notifications_{self.user_id}",
    #             {
    #                 "type": "process_response",
    #                 "notification_id": notification_id,
    #                 "response": response,
    #             }
    #         )
    #     except json.JSONDecodeError as e:
    #         print(f"Failed to decode JSON: {e}")
    #         print(f"Raw text_data: {text_data}")
    #         await self.send(text_data=json.dumps({"error": "Invalid JSON format"}))

    # @database_sync_to_async
    # def handle_response_from_user(self, notification_id, response): 
    #     try:
    #         if notification_id is None:
    #             raise ValueError("Notification ID is None")

    #         # Log the received notification_id and response
    #         print(f"Notification ID: {notification_id}")
    #         print(f"Response: {response}")

    #         # Ensure notification_id is a string and not None
    #         if not isinstance(notification_id, str):
    #             raise ValueError("Notification ID must be a string")

    #         # Extract PendingUser ID and email from notification ID
    #         email = notification_id
    #         if email is None:
    #             raise ValueError("Email extracted from notification ID is None")

    #         pending_user = PendingUser.objects.get(gmail=email)
            
    #         if pending_user is None:
    #             raise ValueError(f"No PendingUser found for email: {email}")

    #         if response == "yes":
    #             pending_user.is_verified = True
    #             pending_user.verify_and_transfer()
    #             print(f"User {email} verified and transferred to Petitioner.")
    #         else:
    #             print(f"User {email} was not verified.")
    #             pending_user.delete()
    #     except Exception as e:
    #         print(f"Error handling response from handle_response_from_user: {e}")
    #     return response

    async def send_notification(self, event):
        """
        Sends notifications to the WebSocket client.
        """
        notification = event["notification"]

        # Send notification to WebSocket
        await self.send(text_data=json.dumps({
            "notification": notification
        }))

    async def process_response(self, event):
        """
        Processes the response and optionally forwards it.
        """
        notification_id = event["notification_id"]
        response = event["response"]

        # Placeholder for response processing
        print(f"Processing response: {response} for notification ID: {notification_id}")




class WaitingpageConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_email = self.scope["url_route"]["kwargs"]["user_email"]
        # Sanitize user_email to create a valid group name
        sanitized_email = re.sub(r'[^a-zA-Z0-9]', '_', self.user_email)
        print("Sanitized email is " + sanitized_email)
        self.group_name = f"waiting_{sanitized_email}"
        print("Consumer speaking, group_name is " + self.group_name)

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'waitingpage_message',
                'message': data['message']
            }
        )

    async def waitingpage_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))

