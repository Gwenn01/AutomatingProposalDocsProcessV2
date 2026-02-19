from .serializers import NotificationSerializer
from .models import Notification
from django.contrib.auth.models import User

class NotificationService:
    
    @staticmethod
    def create_notification(user, message):
        notification = Notification.objects.create(user=user, message=message)
        return NotificationSerializer(notification).data
    
    # admin notifications
    @staticmethod
    def admin_notifications(message):
        user = User.objects.filter(is_superuser=True).first()
        if user:
            return NotificationService.create_notification(user, message)
        return None