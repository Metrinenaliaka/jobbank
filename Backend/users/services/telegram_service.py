import requests
from django.conf import settings
from users.models import User


def send_telegram_message(chat_id, message):

    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage"

    payload = {
        "chat_id": chat_id,
        "text": message
    }

    try:
        requests.post(url, json=payload, timeout=5)
    except Exception:
        pass

def notify_admins_new_user(new_user):

    admins = User.objects.filter(
        is_staff=True,
        telegram_chat_id__isnull=False
    )
    status = "Verified ✅" if new_user.is_active else "Pending ❌"

    message = f"""
🎉 New User Registered

👤 Name: {new_user.full_name}
📧 Email: {new_user.email}
✅ Status: {status}
"""

    for admin in admins:
        send_telegram_message(admin.telegram_chat_id, message)