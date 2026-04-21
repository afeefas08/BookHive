from django.urls import path
from .views import CartView, AddToCartView, UpdateCartItemView, RemoveFromCartView

urlpatterns = [
    path("", CartView.as_view()),                   # GET
    path("add/", AddToCartView.as_view()),          # POST
    path("update/", UpdateCartItemView.as_view()),  # PUT
    path("remove/", RemoveFromCartView.as_view()),  # DELETE
]
