from django.contrib import admin
from .models import Book,Category

class BookAdmin(admin.ModelAdmin):
    list_display = ('title','author','price','category','stock')
    search_fields = ('title','author','category')
    
admin.site.register(Book)
admin.site.register(Category)