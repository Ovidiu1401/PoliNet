from django.contrib import admin
from django.urls import path, include
from users.views import register, user_login, home, profile, search 
from django.shortcuts import redirect
from users import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', include('users.urls')),
    path('login/', views.user_login, name='login'),
    path('home/', home, name='home'),
    path('profile/',profile, name='profile'),
    path('search/',search, name='search'),
    path('', lambda request: redirect('login')), 
]