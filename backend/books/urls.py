from django.urls import path
from .views import get_books,get_book

urlpatterns = [
    path('',get_books, name='get_books'),
    path('<int:pk>/', get_book, name='get_book')
]
