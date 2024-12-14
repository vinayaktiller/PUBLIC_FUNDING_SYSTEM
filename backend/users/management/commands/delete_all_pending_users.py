from django.core.management.base import BaseCommand
from ...models import PendingUser

class Command(BaseCommand):
    help = 'Delete all users in the PendingUser model'

    def handle(self, *args, **kwargs):
        total_pending_users = PendingUser.objects.count()
        if total_pending_users == 0:
            self.stdout.write(self.style.WARNING('No PendingUsers found to delete.'))
        else:
            PendingUser.objects.all().delete()
            self.stdout.write(self.style.SUCCESS(f'Deleted all {total_pending_users} pending users.'))

