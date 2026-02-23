from .base import *

DEBUG = False

ALLOWED_HOSTS = ["simizi.net", "www.simizi.net"]

CORS_ALLOWED_ORIGINS = [
    "https://simizi.net",
    "https://www.simizi.net",
]


# Security hardening
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True

SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True