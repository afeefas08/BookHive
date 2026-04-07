from django.urls import path
from .views import RegisterView,LoginView,get_me

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('me/', get_me),
]