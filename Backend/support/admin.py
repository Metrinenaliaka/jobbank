from django.contrib import admin

from .models import SupportTicket, SiteSetting

admin.site.register(SupportTicket)

@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ("whatsapp_link", "is_whatsapp_active")
