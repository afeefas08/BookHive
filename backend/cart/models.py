from django.db import models
from django.conf import settings
from books.models import Book

User = settings.AUTH_USER_MODEL

class Cart(models.Model):  #cart table creation
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart') # one cart per user
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Cart - {self.user}'
    
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items") #giving name to cart, so easily access eg: cart.items.all()
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('cart', 'book') # prevents duplicate items

    def __str__(self):
        return f'{self.book.title} x ({self.quantity})'
    