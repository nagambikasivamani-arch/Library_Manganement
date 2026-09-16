from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

from expenses.views import ExpenseViewSet, RegisterView


router = DefaultRouter()
router.register(
    r'expenses',
    ExpenseViewSet,
    basename='expense'
)


urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/', include(router.urls)),

    path(
        'api/register/',
        RegisterView.as_view(),
        name='register'
    ),

    path(
        'api/login/',
        TokenObtainPairView.as_view(),
        name='login'
    ),

    path(
        'api/token/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),
]