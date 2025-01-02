from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Manager pentru utilizator
class CustomUserManager(BaseUserManager):
    def create_user(self, username, email=None, phone_number=None, password=None):
        if not email and not phone_number:
            raise ValueError('User must have an email or phone number')
        if email:
            email = self.normalize_email(email)
        user = self.model(username=username, email=email, phone_number=phone_number)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email=None, phone_number=None, password=None):
        user = self.create_user(username, email, phone_number, password)
        user.is_admin = True
        user.save(using=self._db)
        return user

# Modelul de utilizator personalizat
class CustomUser(AbstractBaseUser):
    email = models.EmailField(unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    username = models.CharField(max_length=150, unique=True)
    date_joined = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'phone_number']

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

# Modelul de profil al utilizatorului
class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    followers = models.ManyToManyField(CustomUser, related_name='followed_by', blank=True)
    following = models.ManyToManyField(CustomUser, related_name='follows', blank=True)
    image = models.ImageField(upload_to='profile_images/', blank=True, null=True)

    def __str__(self):
        return self.user.username

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='post_images/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    likes_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return f"Post by {self.user.username}"