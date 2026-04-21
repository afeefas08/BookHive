from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Book, Category
from .serializers import BookSerializer, CategorySerializer

@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

#get all books + filters
class BookListView(APIView):
    def get(self, request):
        books = Book.objects.all()  # fetch data from db

        category_name = request.GET.get('category') #fronted category request
        author = request.GET.get('author')
        min_price = request.GET.get('minPrice')
        max_price = request.GET.get('maxPrice')
        language = request.GET.get('language')

        # filter by category
        if category_name:
            books = books.filter(category_fk__slug__icontains=category_name) # foreignKey ,field in category, iexact=case-insensitive
            
        if author:
            books = books.filter(author__icontains=author)

        if min_price:
            books = books.filter(price__gte=min_price)

        if max_price:
            books = books.filter(price__lte=max_price)

        if language:
            books = books.filter(language__iexact=language)

        # filter best sellers
        is_best_seller = request.GET.get('is_best_seller')

        if is_best_seller:
            books = books.filter(is_best_seller=True)

        serializer = BookSerializer(books, many=True) 
        return Response(serializer.data)

#get single book
class BookDetailView(APIView):
    def get(self, request, slug):
        try:
            book = Book.objects.get(slug=slug)
        except Book.DoesNotExist:
            return Response({'error': 'Book not found'}, status=404)

        serializer = BookSerializer(book)
        lookup_field = "slug"
        return Response(serializer.data)