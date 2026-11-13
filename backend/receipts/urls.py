from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReceiptViewSet, CurrentUserView, CsrfTokenView, LoginView, LogoutView, RegistrationView

router = DefaultRouter()
router.register(r'receipts', ReceiptViewSet, basename='receipt')

urlpatterns = [
    path('', include(router.urls)),
    path('user/me/', CurrentUserView.as_view(), name='current-user'),
    path('auth/csrf/', CsrfTokenView.as_view(), name='auth-csrf'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('auth/register/', RegistrationView.as_view(), name='auth-register'),
]
