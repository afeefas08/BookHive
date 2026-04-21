from django.db import models
from django.utils.timezone import now
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator

class Category(models.Model):
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    discount_percent = models.PositiveIntegerField(
    default=0,
    validators=[MinValueValidator(0), MaxValueValidator(100)]
)
    category = models.ForeignKey(Category, related_name='books', on_delete=models.CASCADE)
    stock = models.PositiveIntegerField()
    image = models.URLField(null=True, blank=True)
    rating = models.FloatField(default=0)

    is_best_seller = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=now)

    slug = models.SlugField(unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:  # only create slug if empty
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    @property
    def final_price(self):
        if self.discount_percent > 0:
            return self.price - (self.price * self.discount_percent / 100)
        return self.price

    @property
    def original_price(self):
        return self.price

    def __str__(self):
        return self.title