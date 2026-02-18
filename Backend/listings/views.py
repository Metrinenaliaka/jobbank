# listings/views.py

from rest_framework import viewsets, permissions
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter

from .models import JobListing
from .serializers import JobSmallSerializer, JobDetailSerializer
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
        'expires_at',
    ]

    ordering = ['-created_at']

    search_fields = [
        'title',
        'company_name',
        'responsibilities',
        'specialization',
    ]

    def get_queryset(self):
        """
        Only show active and non-expired jobs
        """
        return JobListing.objects.filter(
            is_active=True,
            expires_at__gt=timezone.now()
        )

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
