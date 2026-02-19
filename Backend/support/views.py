from rest_framework import viewsets, permissions
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from .models import SupportTicket
from .serializers import SupportTicketSerializer


class SupportTicketViewSet(viewsets.ModelViewSet):

    serializer_class = SupportTicketSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return SupportTicket.objects.all()
        return SupportTicket.objects.filter(user=self.request.user)

    def get_permissions(self):
        if self.action in ['create', 'list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

    def perform_create(self, serializer):
        ticket = serializer.save(user=self.request.user)

        # 📧 Send confirmation email with timeframe
        send_mail(
            subject=f"Support Ticket Received - {ticket.id}",
            message=(
                f"Hello,\n\n"
                f"Your support ticket has been received.\n\n"
                f"Ticket ID: {ticket.id}\n"
                f"Subject: {ticket.subject}\n\n"
                f"Our team will respond within 24-48 hours.\n\n"
                f"Thank you."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[self.request.user.email],
            fail_silently=False,
        )

    def perform_update(self, serializer):
        ticket = serializer.save()

        # If marked resolved, set resolved time and notify user
        if ticket.status == 'resolved':
            ticket.resolved_at = timezone.now()
            ticket.save()

            send_mail(
                subject=f"Your Support Ticket Has Been Resolved - {ticket.id}",
                message=(
                    f"Hello,\n\n"
                    f"Your support ticket has been resolved.\n\n"
                    f"Response:\n{ticket.admin_response}\n\n"
                    f"Thank you."
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[ticket.user.email],
                fail_silently=False,
            )
