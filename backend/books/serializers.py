from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    final_price = serializers.ReadOnlyField()
    original_price = serializers.ReadOnlyField()
    
    class Meta:
        model = Book
        fields = '__all__'