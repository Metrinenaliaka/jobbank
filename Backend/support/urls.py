from rest_framework.routers import DefaultRouter
from .views import SupportTicketViewSet, SiteSettingViewSet

router = DefaultRouter()
router.register(r'support', SupportTicketViewSet, basename='support')
router.register(r'site-settings', SiteSettingViewSet, basename='site-settings')

urlpatterns = router.urls
