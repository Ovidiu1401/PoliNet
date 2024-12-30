from django.contrib import admin
from django.urls import path, include
from users.views import register, user_login, home 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', include('users.urls')),
    path('login/', user_login, name='login'),
    path('home/', home, name='home'),
    path('', user_login, name='login'), 
]