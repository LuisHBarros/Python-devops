from typing import TYPE_CHECKING

from django.contrib import admin

from users.models import User

if TYPE_CHECKING:
    _BaseAdmin = admin.ModelAdmin[User]
else:
    _BaseAdmin = admin.ModelAdmin


@admin.register(User)
class UserAdmin(_BaseAdmin):
    list_display = ("email", "name", "is_active", "is_staff", "date_joined")
    list_filter = ("is_active", "is_staff")
    search_fields = ("email", "name")
    ordering = ("-date_joined",)
