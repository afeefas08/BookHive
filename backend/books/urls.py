from django.urls import path
from .views import BookListView, BookDetailView, get_categories

urlpatterns = [
    path('',BookListView.as_view(), name='books-list'),
    path('category/',get_categories, name='category-list'),
    path('<slug:slug>/', BookDetailView.as_view(), name='books-details'),
]
