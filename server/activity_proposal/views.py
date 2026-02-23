from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny 
from .models import ActivityProposal
from .serializers import ActivityProposalSerializer
from notifications.services import NotificationService

class ActivityProposalList(APIView):
    permission_classes = [IsAuthenticated]
    # def post(self, request):
    #     serializer = ActivityProposalSerializer(
    #         data=request.data,
    #         context={"request": request}
    #     )
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response({"message": "Activity proposal created successfully",  
    #                          "data": serializer.data}, status=status.HTTP_201_CREATED
    #         )
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActivityProposalDetail(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk, user):
        activity_proposal = get_object_or_404(
            ActivityProposal,
            id=pk,
            proposal__user=user
        )
        return activity_proposal

    def get(self, request, pk):
        try:
            activity_proposal = self.get_object(pk, request.user)
        except ActivityProposal.DoesNotExist:
            return Response({"message": "Activity proposal not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ActivityProposalSerializer(activity_proposal)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, pk):
        try:
            activity_proposal = self.get_object(pk, request.user)
        except ActivityProposal.DoesNotExist:
            return Response({"message": "Activity proposal not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ActivityProposalSerializer(
            activity_proposal,
            data=request.data,
            partial=True,
            context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            NotificationService.admin_notifications(
                f"Activity proposal already created by {request.user.username}"
            )
            return Response({"message": "Activity proposal updated successfully",  
                             "data": serializer.data}, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

   