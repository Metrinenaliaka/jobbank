from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from .models import VisaStage


@receiver(pre_save, sender=VisaStage)
def notify_user_on_notes_change(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        old_instance = VisaStage.objects.get(pk=instance.pk)
    except VisaStage.DoesNotExist:
        return

    if old_instance.notes != instance.notes and instance.notes:

        user = instance.visa_application.application.applicant
        user_email = user.email
        full_name = getattr(user, "full_name", "User")  # fallback safety

        subject = "Update on Your Visa Application"

        html_content = f"""
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #2c3e50;">
            
            <p>Dear {full_name},</p>

            <p>
                There is an update regarding your visa application.
            </p>

            <p><strong>Stage:</strong> {instance.name}</p>

            <div style="
                background: #f4f8fb;
                padding: 12px 15px;
                border-left: 4px solid #3498db;
                border-radius: 6px;
                margin: 15px 0;
            ">
                {instance.notes}
            </div>

            <p>
                Please log in to your dashboard to view more details.
            </p>

            <br/>

            <p>
                Regards,<br/>
                <strong>Simizi Management Team</strong><br/>
                <a href="https://www.simizi.net" target="_blank">
                    www.simizi.net
                </a>
            </p>

        </div>
        """

        text_content = strip_tags(html_content)

        email = EmailMultiAlternatives(
            subject,
            text_content,
            None,
            [user_email],
        )

        email.attach_alternative(html_content, "text/html")
        email.send()