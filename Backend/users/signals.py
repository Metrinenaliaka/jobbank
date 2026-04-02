from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import User
import requests
from users.services.telegram_service import notify_admins_new_user





def send_telegram(chat_id, message):
    token = getattr(settings, "TELEGRAM_BOT_TOKEN", None)

    if not token or not chat_id:
        return

    url = f"https://api.telegram.org/bot{token}/sendMessage"

    data = {
        "chat_id": chat_id,
        "text": message
    }

    try:
        requests.post(url, json=data, timeout=5)
    except Exception as e:
        print("Telegram notification failed:", e)

@receiver(post_save, sender=User)
def user_created_signal(sender, instance, created, **kwargs):

    if created:
        notify_admins_new_user(instance)


@receiver(post_save, sender=User)
def notify_user_status_change(sender, instance, created, **kwargs):

    if created:
        return

    try:

        if instance.is_active:

            subject = "Your Simizi Account Has Been Activated"

            message = f"""
Hello {instance.full_name},

I hope this message finds you well.

Thank you for showing interest in applying for employment opportunities in Canada through Simizi. We sincerely appreciate your initiative and enthusiasm in exploring international career opportunities, and we are pleased to guide you through the process.

Simizi is an online job application and recruitment support platform designed to assist qualified candidates who are seeking employment opportunities with Canadian companies. The platform connects applicants with employers across various industries, including warehouse operations, logistics, agriculture, retail, manufacturing, and other skilled and semi-skilled sectors. Through Simizi, candidates are able to review available job openings, submit applications, and begin the necessary documentation process required for international employment.

Our system is structured to simplify the job search and application process while ensuring that applicants can access legitimate employment opportunities with reputable Canadian employers. Once an applicant identifies a suitable position, the platform guides them through the next steps, including application submission, document verification, and preparation for employer review.

To proceed with your application, kindly follow the steps below:

1. Visit the official Simizi website: https://www.simizi.net
2. Log in to your account using this email: {instance.email}
3. Browse through the available job listings posted by Canadian employers.
4. Select a position that matches your skills, experience, and preferences.
5. Complete the application process and submit the required details.

Applying through the Simizi platform allows you to explore multiple job opportunities and choose a role that best aligns with your qualifications and career goals.

If you encounter any difficulty while logging in or submitting your application, please do not hesitate to contact us. Our team will be happy to assist you throughout the process.

Once again, thank you for choosing Simizi as your pathway to explore employment opportunities in Canada. We wish you the very best as you begin your application.

Kind regards,
Simizi Recruitment Team
https://www.simizi.net
"""

        else:

            subject = "Your Simizi Account Has Been Suspended"

            message = (
                f"Hello {instance.full_name},\n\n"
                "We would like to inform you that your Simizi account has been temporarily suspended by the administrator.\n\n"
                "If you believe this action was taken in error or if you require further clarification, "
                "please contact our support team at info@simizi.net and we will be happy to assist you.\n\n"
                "Thank you for your understanding.\n\n"
                "Kind regards,\n"
                "Simizi Recruitment Team\n"
                "www.simizi.net"
            )

        # EMAIL
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [instance.email],
            fail_silently=True
        )

        # TELEGRAM (safe)
        send_telegram(instance.telegram_chat_id, message)

    except Exception as e:
        print("Notification error:", e)