from rest_framework import serializers
from .models import Book,Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields= '__all__'

class BookSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    final_price = serializers.ReadOnlyField()
    original_price = serializers.ReadOnlyField()
    
    class Meta:
        model = Book
        fields = '__all__'