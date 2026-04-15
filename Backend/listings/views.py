# listings/views.py

from rest_framework import viewsets, permissions
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import AllowAny, IsAdminUser


from .models import JobListing, Tag
from .serializers import JobSmallSerializer, JobDetailSerializer, TagSerializer
from .pagination import ListingPagination


class JobListingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Job Listings
    - Public can list and retrieve
    - Admin can create, update, delete
    - Expired jobs automatically excluded
    """

    pagination_class = ListingPagination

    filter_backends = [
        DjangoFilterBackend,
        OrderingFilter,
        SearchFilter,
    ]

    # 🔹 Use REAL fields from your model
    filterset_fields = [
        'location_city',
        'location_province',
        'employment_type',
        'work_mode',
    ]

    ordering_fields = [
        'created_at',
        'salary',
        
    ]

    ordering = ['-created_at']

    search_fields = [
        'title',
        'company_name',
        'responsibilities',
        'specialization',
    ]

    def get_queryset(self):

        # ⭐ Admin sees EVERYTHING
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return JobListing.objects.all()

       
        return JobListing.objects.all()
    def get_serializer_class(self):
        """
        Use small serializer for list
        Use detailed serializer for retrieve
        """
        if self.action == 'list':
            return JobSmallSerializer
        return JobDetailSerializer

    def get_permissions(self):
        """
        Admin-only for modifications
        Public for viewing
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAdminUser()]