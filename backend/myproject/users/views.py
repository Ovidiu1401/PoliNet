from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages
from .forms import UserRegistrationForm, CustomAuthenticationForm
from django.contrib.auth.decorators import login_required
from .models import CustomUser
from .models import UserProfile
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .models import Post
from django.contrib.auth.models import User

# Vederea pentru înregistrare
def register(request):
    if request.method == 'POST':
        print(f"DEBUG: Form data: {request.POST}") 
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            print(f"DEBUG: Form is valid, creating user")
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()
            profile = UserProfile.objects.create(user=user)
            profile.save()
            print(f"DEBUG: User {user.username} has been created")
            messages.success(request, "Your account has been created successfully!")
            return redirect('login')
        else:
            # Afișează erorile din formular
            print(f"DEBUG: Form errors: {form.errors}") 
            messages.error(request, "Please correct the errors below.")
    else:
        form = UserRegistrationForm()
    return render(request, 'register.html', {'form': form})

# Vederea pentru logare
def user_login(request):
    if request.method == 'POST':
        form = CustomAuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                print(f"DEBUG: User {username} authenticated successfully")  # Mesaj de debug
                login(request, user)
                return redirect('home')  # Redirecționare către pagina home
            else:
                print(f"DEBUG: Authentication failed for username {username}")  # Eroare debug
                messages.error(request, "Invalid username or password.")
        else:
            print(f"DEBUG: Form is invalid: {form.errors}")  # Debug form invalid
            for field, errors in form.errors.items():
                print(f"DEBUG: Field {field} errors: {errors}")
            messages.error(request, "Form is invalid. Please check your input.")
    else:
        form = CustomAuthenticationForm()
    return render(request, 'login.html', {'form': form})

# Vederea pentru home
def home(request):
    context={
        'posts':Post.objects.all()
    }
    return render(request, 'home.html',context)

# # Vederea pentru search
# def search(request):
#     return render(request, 'search.html')

# Vederea pentru search
def search(request):
    users = CustomUser.objects.all()  # Folosește CustomUser în loc de User
    print(f"DEBUG: Number of users found: {users.count()}")  # Mesaj de debug
    return render(request, 'search.html', {'users': users})


# Vederea pentru profile
def profile(request):
    return render(request, 'profile.html')

# Vedere pentru căutare utilizator
def search_user(request):
    users = User.objects.all()
    print(f"DEBUG: Number of users found: {users.count()}")  # Adaugă un mesaj de debug
    return render(request, 'search.html', {'users': users})

# Vedere pentru urmărire/oprire urmărire
# @login_required
# def toggle_follow(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         user_id = data.get('user_id')
#         try:
#             user_to_follow = CustomUser.objects.get(id=user_id)
#             profile = request.user.profile
#             if profile.following.filter(id=user_id).exists():
#                 profile.following.remove(user_to_follow)
#                 message = f"Nu-l mai urmărești pe {user_to_follow.username}."
#             else:
#                 profile.following.add(user_to_follow)
#                 message = f"Acum îl urmărești pe {user_to_follow.username}."
#             return JsonResponse({'message': message})
#         except CustomUser.DoesNotExist:
#             return JsonResponse({'error': 'Utilizatorul nu a fost găsit.'}, status=404)
#     return JsonResponse({'error': 'Metodă nevalidă.'}, status=400)


# Vedere pentru urmărire/oprire urmărire
@login_required
def toggle_follow(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_id = data.get('user_id')
        try:
            user_to_follow = CustomUser.objects.get(id=user_id)
            profile = request.user.profile
            if profile.following.filter(id=user_id).exists():
                profile.following.remove(user_to_follow)
                message = f"Nu-l mai urmărești pe {user_to_follow.username}."
            else:
                profile.following.add(user_to_follow)
                message = f"Acum îl urmărești pe {user_to_follow.username}."
            return JsonResponse({'message': message, 'followed': profile.following.filter(id=user_id).exists()})
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'Utilizatorul nu a fost găsit.'}, status=404)
    return JsonResponse({'error': 'Metodă nevalidă.'}, status=400)