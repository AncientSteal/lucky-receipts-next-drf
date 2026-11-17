from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, permissions, pagination, mixins, status
from .models import Receipt
from .serializers import ReceiptSerializer, UserSerializer, RegisterSerializer
from django.shortcuts import redirect
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout
from django.conf import settings
from rest_framework.exceptions import ValidationError
from .throttles import AuthRateThrottle
import logging

logger = logging.getLogger(__name__)


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CsrfTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({"detail": "CSRF cookie set"}, status=status.HTTP_200_OK)


class LoginView(APIView):
    throttle_classes = [AuthRateThrottle]
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(request, username=username, password=password)
        if user is None:
            logger.warning("Failed login attempt for username: %s", username)
            return Response(
                {"non_field_errors": ["Неверное имя пользователя или пароль."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        login(request, user)
        logger.info("User logged in successfully: %s (id=%s)", user.username, user.id)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        logger.info("User logout: %s", request.username)
        return Response({"detail": "Выход выполнен."}, status=status.HTTP_200_OK)


class RegistrationView(APIView):
    throttle_classes = [AuthRateThrottle]
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as exc:
            logger.warning("Registration failed: %s", exc.detail)
            raise  # пробрасываем исключение дальше

        user = serializer.save()

        login(request, user)
        logger.info("New user registered: %s (id=%s)", user.username, user.id)
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class CurrentUserView(APIView):
    # Доступ только для авторизованных пользователей
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # request.user автоматически подтягивается из сессии браузера
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReceiptPagination(pagination.PageNumberPagination):
    """Пагинация по 10 элементов"""
    page_size = 10
    page_size_query_param = None


class ReceiptViewSet(mixins.ListModelMixin,
                     mixins.CreateModelMixin,
                     viewsets.GenericViewSet):
    serializer_class = ReceiptSerializer
    pagination_class = ReceiptPagination

    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Возвращаем чеки только залогиненного пользователя"""
        return Receipt.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Ставим текущего пользователя как автора чека"""
        serializer.save(user=self.request.user)


class MainRedirectView(View):
    def get(self, request, *args, **kwargs):
        base_url = settings.FRONTEND_URL.rstrip('/')
        if request.user.is_authenticated:
            # пользователь вошел — отправляем на фронтенд личного кабинета
            return redirect(f'{base_url}/cabinet/')
        # пользователь не вошел — отправляем на главную страницу фронта
        return redirect(f'{base_url}/')
