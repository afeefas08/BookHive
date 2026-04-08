from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    category = models.CharField(max_length=100)
    stock = models.PositiveIntegerField()
    image = models.ImageField(upload_to='books/', null=True, blank=True)

    def __str__(self):
        return self.title