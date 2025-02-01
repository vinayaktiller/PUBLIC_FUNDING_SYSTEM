from django.db import models
from django.utils import timezone   

class ProfilePicture(models.Model):
    image = models.ImageField(upload_to='profile_pics/')
    crop_x = models.IntegerField()
    crop_y = models.IntegerField()
    crop_width = models.IntegerField()
    crop_height = models.IntegerField()
    aspect_ratio = models.FloatField(default=1.0)
    zoom_level = models.FloatField(default=1.0)
    brightness = models.FloatField(default=1.0)
    contrast = models.FloatField(default=1.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
