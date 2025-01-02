from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages
from .forms import UserRegistrationForm, CustomAuthenticationForm
from django.contrib.auth.decorators import login_required
from .models import UserProfile

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
    return render(request, 'home.html')

# Vederea pentru search
def search(request):
    return render(request, 'search.html')

# Vederea pentru profile
def profile(request):
    return render(request, 'profile.html')

# Căutarea unui utilizator
def search_user(request):
    query = request.GET.get('q', '')
    users = User.objects.filter(username__icontains=query)  # Căutăm utilizatorii după numele de utilizator

    user_data = [{
        'id': user.id,
        'username': user.username,
        'image': user.profile.image.url if user.profile.image else None  # Adaptează după cum ai structurat modelul UserProfile
    } for user in users]

    return JsonResponse({'users': user_data})

# Urmărirea unui utilizator
def follow_user(request):
    if request.method == 'POST':
        user_to_follow_id = request.POST.get('user_id')
        user_to_follow = User.objects.get(id=user_to_follow_id)
        current_user = request.user

        # Aici presupunem că ai o relație Many-to-Many între User și User pentru followers
        current_user.profile.following.add(user_to_follow.profile)  # Sau folosește o metodă specifică modelului tău
        current_user.profile.save()

        return JsonResponse({'message': 'Urmărit cu succes!'})
    return JsonResponse({'error': 'Metodă nevalidă!'}, status=400)