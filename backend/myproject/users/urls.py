from django.urls import path
from . import views

urlpatterns = [
    path('', views.register, name='register'),
    path('login/', views.user_login, name='login'),
    path('home/', views.home, name='home'),
    path('search/', views.search, name='search'),
    path('follow/', views.toggle_follow, name='toggle_follow'),
    path('profile/',views.profile,name='profile'),
    path('toggle_follow/', views.toggle_follow, name='toggle_follow'),
]
