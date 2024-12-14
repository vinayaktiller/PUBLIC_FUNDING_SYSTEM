from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Resets the auto-increment IDs for several models'

    def handle(self, *args, **kwargs):
        with connection.cursor() as cursor:
            cursor.execute("TRUNCATE TABLE address_state RESTART IDENTITY CASCADE;")
            cursor.execute("TRUNCATE TABLE address_district RESTART IDENTITY CASCADE;")
            cursor.execute("TRUNCATE TABLE address_subdistrict RESTART IDENTITY CASCADE;")
            cursor.execute("TRUNCATE TABLE address_village RESTART IDENTITY CASCADE;")
            cursor.execute("TRUNCATE TABLE address_country RESTART IDENTITY CASCADE;")
        self.stdout.write(self.style.SUCCESS('Auto-increment fields reset!'))
