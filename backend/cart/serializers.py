from rest_framework import serializers #Convert DB data → JSON(API response)
from .models import Cart, CartItem
from books.models import Book

class CartItemSerializer(serializers.ModelSerializer): #Gets data from Book model.
    book_title = serializers.CharField(source=Book.title, read_only=True)
    book_price = serializers.DecimalField(source=Book.price, max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id','book','book_title','book_price','quantity']
    
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True) #Nested serializer

    class Meta:
        model = Cart
        fields = ['id','items']