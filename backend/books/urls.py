from django.urls import path
from .views import BookListView, BookDetailView, get_categories, get_authors

urlpatterns = [
    path('',BookListView.as_view(), name='books-list'),
    path('categories/',get_categories, name='category-list'),
    path('authors/',get_authors, name='author-list'),
    path('<slug:slug>/', BookDetailView.as_view(), name='books-details'),
]
