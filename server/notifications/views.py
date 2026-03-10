from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .models import Notification
from .serializers import NotificationSerializer
# Create your views here.

class NotificationList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class NotificationDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        notification = get_object_or_404(
            Notification,
            id=pk
        )
        return notification
    
    def put(self, request, pk):
        notification = self.get_object(pk)
        notification.is_read = True
        notification.save()
        return Response({"message": "Notification Read Successfully"}, status=status.HTTP_200_OK)