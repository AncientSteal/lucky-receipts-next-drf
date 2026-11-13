from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, permissions, pagination, mixins, status
from .models import Receipt
from .serializers import ReceiptSerializer, UserSerializer, RegisterSerializer
from django.shortcuts import redirect
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, get_user_model, login, logout


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CsrfTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({"detail": "CSRF cookie set"}, status=status.HTTP_200_OK)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response(
                {"non_field_errors": ["Неверное имя пользователя или пароль."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        login(request, user)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"detail": "Выход выполнен."}, status=status.HTTP_200_OK)


class RegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        login(request, user)
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
        if request.user.is_authenticated:
            # пользователь вошел — отправляем на фронтенд
            return redirect('http://localhost:3000/')
        # пользователь не вошел — отправляем на главную страницу фронта
        return redirect('http://localhost:3000/')
