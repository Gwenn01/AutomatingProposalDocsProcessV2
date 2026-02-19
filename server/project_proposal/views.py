from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny 
from .models import ProjectProposal
from .serializers import (
    ProjectProposalSerializer,
    ProjectActivitiesSerializer,
)
from notifications.services import NotificationService
# Create your views here.

class ProjectProposalList(APIView):
    permission_classes = [IsAuthenticated]
    # def get(self, request):
    #     project_proposals = ProjectProposal.objects.filter(
    #         proposal__user=request.user
    #     )

    #     serializer = ProjectProposalSerializer(
    #         project_proposals,
    #         many=True
    #     )
    #     return Response(serializer.data, status=status.HTTP_200_OK)
    
    # def post(self, request):
    #     serializer = ProjectProposalSerializer(
    #         data=request.data,
    #         context={"request": request}
    #     )
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response({"message": "Project proposal created successfully",  
    #                          "data": serializer.data}, status=status.HTTP_201_CREATED
    #         )
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# update the specific fields of a project proposal
class ProjectProposalDetail(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk, user):
        project_proposal = get_object_or_404(
            ProjectProposal,
            id=pk,
            proposal__user=user
        )
        return project_proposal
    
    def get(self, request, pk):
        try:
            project_proposal = self.get_object(pk, request.user)
        except ProjectProposal.DoesNotExist:
            return Response({"message": "Project proposal not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProjectProposalSerializer(
            project_proposal,
            context={"request": request}
        )

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, pk):
        try:
            project_proposal = self.get_object(pk, request.user)
        except ProjectProposal.DoesNotExist:
            return Response({"message": "Project proposal not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProjectProposalSerializer(
            project_proposal,
            data=request.data,
            context={"request": request},
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            NotoficationService.admin_notifications(
                f"Project proposal updated by {request.user.username}"
            )
            return Response({"message": "Project proposal updated successfully",
                         "data": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# list of activities for a project proposal
class ProjectActivitiesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, project_proposal_id):
        try:
            project_proposal = ProjectProposal.objects.get(id=project_proposal_id)
        except ProjectProposal.DoesNotExist:
            return Response("Project proposal not found", status=status.HTTP_404_NOT_FOUND)
        serializer = ProjectActivitiesSerializer(project_proposal)
        return Response(serializer.data, status=status.HTTP_200_OK)

        