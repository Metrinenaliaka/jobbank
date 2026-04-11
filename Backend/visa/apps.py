from django.apps import AppConfig


class VisaConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'visa'

    def ready(self):
        import visa.signals