from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, PaymentMethodViewSet

router = DefaultRouter()
router.register(r"methods", PaymentMethodViewSet, basename="payment-methods")
router.register(r"", PaymentViewSet, basename="payments")


urlpatterns = router.urls