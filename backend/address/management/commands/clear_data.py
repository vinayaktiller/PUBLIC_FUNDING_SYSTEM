from django.core.management.base import BaseCommand
from address.models import State, District, SubDistrict, Village, Country


BATCH_SIZE = 1000  # Adjust this number based on your needs

class Command(BaseCommand):
    help = 'Clears all address and person data in batches and displays how many records were deleted'

    def handle(self, *args, **kwargs):
        # Helper function to delete in batches
        def batch_delete(queryset):
            count = 0
            while queryset.exists():
                batch = list(queryset[:BATCH_SIZE])  # Get a batch of records
                queryset.filter(id__in=[obj.id for obj in batch]).delete()
                count += len(batch)
            return count

        # Count and delete records in batches for each model
        village_count = Village.objects.count()
        deleted_villages = batch_delete(Village.objects.all())
        
        subdistrict_count = SubDistrict.objects.count()
        deleted_subdistricts = batch_delete(SubDistrict.objects.all())
        
        district_count = District.objects.count()
        deleted_districts = batch_delete(District.objects.all())
        
        state_count = State.objects.count()
        deleted_states = batch_delete(State.objects.all())

        country_count = Country.objects.count()
        deleted_countries = batch_delete(Country.objects.all())
        
       

        # Output how many records were deleted
        self.stdout.write(self.style.SUCCESS(f'Successfully deleted {deleted_villages} out of {village_count} villages.'))
        self.stdout.write(self.style.SUCCESS(f'Successfully deleted {deleted_subdistricts} out of {subdistrict_count} subdistricts.'))
        self.stdout.write(self.style.SUCCESS(f'Successfully deleted {deleted_districts} out of {district_count} districts.'))
        self.stdout.write(self.style.SUCCESS(f'Successfully deleted {deleted_states} out of {state_count} states.'))
        self.stdout.write(self.style.SUCCESS(f'Successfully deleted {deleted_countries} out of {country_count} countries.'))
        
        self.stdout.write(self.style.SUCCESS('All data cleared!'))
