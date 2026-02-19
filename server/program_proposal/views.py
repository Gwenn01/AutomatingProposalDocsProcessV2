from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny 
# app
from .models import ProgramProposal
from django.contrib.auth.models import User
from .serializers import (
    ProgramProposalSerializer,
    ProgramProjectsSerializer
)

from notifications.services import NotificationService
# Create your views here.

# IMPLEMENTOR VIEWS CREATE proposal
class ProgramProposalList(APIView):
    permission_classes = [IsAuthenticated]

    # def get(self, request):
    #     program_proposals = ProgramProposal.objects.filter(
    #         proposal__user=request.user
    #     )
    #
    #     serializer = ProgramProposalSerializer(
    #         program_proposals,
    #         many=True
    #     )
    #
    #     return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ProgramProposalSerializer(
            data=request.data,
            context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            # add notification to admin
            NotificationService.admin_notifications(
                f"New program proposal submitted by {request.user.username}"
            )
            return Response(
                {
                    "message": "Program proposal created successfully",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# get the program proposal details
class ProgramProposalDetail(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk, user):
        program_proposal = get_object_or_404(
            ProgramProposal,
            id=pk,
            proposal__user=user
        )
        return program_proposal

    
    def get(self, request, pk):
        try:
            program_proposal = self.get_object(pk, request.user)
        except ProgramProposal.DoesNotExist:
            return Response(
                {"detail": "Program proposal not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ProgramProposalSerializer(program_proposal)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
# list of project proposal under a program proposal
class ProgramProjectsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, program_proposal_id):
        try:
            program_proposal = ProgramProposal.objects.get(id=program_proposal_id)
        except ProgramProposal.DoesNotExist:
            return Response(
                {"detail": "Program proposal not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = ProgramProjectsSerializer(program_proposal)
        return Response(serializer.data, status=status.HTTP_200_OK)

