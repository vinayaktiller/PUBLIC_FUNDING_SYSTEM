from django.core.management.base import BaseCommand
import pandas as pd
from address.models import State, District, SubDistrict, Village, Country
from django.db import transaction
from tqdm import tqdm  # For showing a progress bar

BATCH_SIZE = 5000  # Define batch size for efficient bulk insertion

class Command(BaseCommand):
    help = 'Populate the database from an Excel file'

    def add_arguments(self, parser):
        parser.add_argument('file_path', type=str)

    def handle(self, *args, **kwargs):
        file_path = kwargs['file_path']
        df = pd.read_excel(file_path)

        # Batch collections
        states = []
        districts = []
        subdistricts = []
        villages = []

        total_rows = len(df)

        # Using tqdm to show a progress bar
        for index, row in tqdm(df.iterrows(), total=total_rows, desc="Processing data"):
            country, created = Country.objects.get_or_create(name=row['Country Name'])

            state, created = State.objects.get_or_create(name=row['State Name'], country=country)

            district, created = District.objects.get_or_create(name=row['District Name'], state=state)

            subdistrict, created = SubDistrict.objects.get_or_create(name=row['Sub-District Name'], district=district)

            village, created = Village.objects.get_or_create(
                name=row['Village Name'],
                subdistrict=subdistrict,
                defaults={'status': row['Village Status']}  # Assuming "Village Status" is a field in the model
            )

            # Collect objects for batch insertion
            states.append(state)
            districts.append(district)
            subdistricts.append(subdistrict)
            villages.append(village)

            # Bulk insert in batches for efficiency
            if (index + 1) % BATCH_SIZE == 0:
                self.bulk_insert(states, districts, subdistricts, villages)

                # Reset the lists after each batch insert
                states.clear()
                districts.clear()
                subdistricts.clear()
                villages.clear()

        # Final batch insert for any remaining items
        if states or districts or subdistricts or villages:
            self.bulk_insert(states, districts, subdistricts, villages)

        self.stdout.write(self.style.SUCCESS(f'Data population complete. Processed {total_rows} rows.'))

    def bulk_insert(self, states, districts, subdistricts, villages):
        """Bulk inserts collected objects into the database within a transaction."""
        with transaction.atomic():
            # Avoid inserting duplicates using `ignore_conflicts=True`
            State.objects.bulk_create(states, ignore_conflicts=True)
            District.objects.bulk_create(districts, ignore_conflicts=True)
            SubDistrict.objects.bulk_create(subdistricts, ignore_conflicts=True)
            Village.objects.bulk_create(villages, ignore_conflicts=True)
