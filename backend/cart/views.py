from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem
from .serializers import CartSerializer
from books.models import Book

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)

        book_id = request.data.get("book")
        quantity = int(request.data.get("quantity", 1))

        try:
            book = Book.objects.get(id=book_id)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=404)
        
        item, created = CartItem.objects.get_or_create(cart=cart, book=book) # item exist in cart

        if not created:
            item.quantity += quantity # increment if item already exist.
        else:
            item.quantity = quantity

        item.save()

        return Response({"message": "Item added to cart"}, status=status.HTTP_201_CREATED)
    
class UpdateCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        item_id = request.data.get("item_id")
        quantity = int(request.data.get("quantity", 1))

        try:
            item = CartItem.objects.get(id=item_id, cart__user=request.user) #User can only access their own cart
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)
        
        if quantity <= 0:
            item.delete()
            return Response({"message": "Item removed"})
        
        item.quantity = quantity
        item.save()

        return Response({"message": "Quantity updated"})
    
class RemoveFromCartView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        item_id = request.data.get("item_id")

        try:
            item = CartItem.objects.get(id=item_id, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)
        
        item.delete()

        return Response({"message": "Item removed from cart"})