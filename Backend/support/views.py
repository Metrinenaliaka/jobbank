from rest_framework import viewsets, permissions
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from .models import SupportTicket
from .serializers import SupportTicketSerializer


class SupportTicketViewSet(viewsets.ModelViewSet):

    serializer_class = SupportTicketSerializer

    # ===== PERMISSIONS =====
    def get_permissions(self):

        # normal users can create tickets
        if self.action in ["create"]:
            return [permissions.IsAuthenticated()]

        # ONLY admins can update/delete tickets
        if self.action in ["update", "partial_update", "destroy"]:
            return [permissions.IsAdminUser()]

        # list/retrieve → authenticated
        return [permissions.IsAuthenticated()]

    # ===== QUERYSET =====
    def get_queryset(self):

        # admins see ALL tickets
        if self.request.user.is_staff:
            return SupportTicket.objects.all()

        # normal users only own tickets
        return SupportTicket.objects.filter(user=self.request.user)

    # ===== CREATE =====
    def perform_create(self, serializer):

        ticket = serializer.save(user=self.request.user)

        send_mail(
            subject=f"Support Ticket Received - {ticket.id}",
            message=(
                f"Your support request has been received.\n\n"
                f"Ticket ID: {ticket.id}\n"
                f"Subject: {ticket.subject}\n\n"
                f"We will respond in 24-48 hours."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[self.request.user.email],
            fail_silently=False,
        )

    # ===== ADMIN UPDATE =====
    def perform_update(self, serializer):

        ticket = serializer.save()

        if ticket.status == "resolved" and not ticket.resolved_at:
            ticket.resolved_at = timezone.now()
            ticket.save()

            send_mail(
                subject=f"Support Ticket Resolved - {ticket.id}",
                message=(
                    f"Your support ticket was resolved.\n\n"
                    f"Response:\n{ticket.admin_response}"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[ticket.user.email],
                fail_silently=False,
            )