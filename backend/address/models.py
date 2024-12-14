from django.db import models

class Country(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class State(models.Model):
    name = models.CharField(max_length=100)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name="states")

    def __str__(self):
        return self.name

class District(models.Model):
    name = models.CharField(max_length=100)
    state = models.ForeignKey(State, on_delete=models.CASCADE, related_name="districts")

    def __str__(self):
        return self.name

class SubDistrict(models.Model):
    name = models.CharField(max_length=100)
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name="subdistricts")

    def __str__(self):
        return self.name

class Village(models.Model):
    name = models.CharField(max_length=200)
    subdistrict = models.ForeignKey(SubDistrict, on_delete=models.CASCADE, related_name="villages")
    status = models.CharField(max_length=100, null=True, blank=True)  # Removed choices

    def __str__(self):
        return f"{self.name} ({self.status})"
