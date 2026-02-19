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
    permission_classes = [IsAdminUser, IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class NotificationDetail(APIView):
    permission_classes = [IsAdminUser, IsAuthenticated]

    def get_object(self, pk, user):
        notification = get_object_or_404(
            Notification,
            id=pk,
            user=user
        )
        return notification
    
    def get(self, request, pk):
        try:
            notification = self.get_object(pk, request.user)
        except Notification.DoesNotExist:
            return Response({"message": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = NotificationSerializer(
            notification,
            context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        try:
            notification = self.get_object(pk, request.user)
        except Notification.DoesNotExist:
            return Response({"message": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)

        notification.is_read = True
        notification.save()

        serializer = NotificationSerializer(
            notification,
            context={"request": request}
        )
        if serializer.is_valid():
            serializer.save() 
            return Response({"message": "Notification marked as read",
                             "data": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)