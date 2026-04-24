from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Book, Category
from .serializers import BookSerializer, CategorySerializer
from django.db.models import Max
from rest_framework import status

@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_authors(request):
    authors = Book.objects.values('author', 'author_slug').distinct()
    return Response(authors)

#get all books + filters
class BookListView(APIView):
    def get(self, request):
        books = Book.objects.all()  # fetch data from db

        category_name = request.GET.get('category') #fronted category request
        # filter by category
        if category_name:
            books = books.filter(category_fk__slug=category_name) # foreignKey ,field in category, iexact=case-insensitive
            
        authors = request.GET.get('authors')

        if authors:
            authors_list = authors.split(',')
            books = books.filter(author_slug__in=authors_list)

        min_price = request.GET.get('min_price')
        if min_price:
            books = books.filter(price__gte=min_price)

        max_price = request.GET.get('max_price')
        if max_price:
            books = books.filter(price__lte=max_price)

        # filter best sellers
        is_best_seller = request.GET.get('is_best_seller')

        if is_best_seller:
            books = books.filter(is_best_seller=True)

        serializer = BookSerializer(books, many=True) 

        return Response({
                "results": serializer.data,
                "max_price": books.aggregate(Max('price'))['price__max'] or 1000,
                "count" : books.count()
            }, status=status.HTTP_200_OK)

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