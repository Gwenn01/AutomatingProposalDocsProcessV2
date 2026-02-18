from django.shortcuts import render
from rest_framework.permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from .models import Proposal
from .serializers import (
    ProposalSerializer
)
from .services import OverviewService
# Create your views here.

# IMPLEMENTOR VIEWS get list of proposal
class ProposalList(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, proposal_type, format=None):
        proposals = Proposal.objects.filter(
            user=request.user,
            proposal_type=proposal_type
        )

        serializer = ProposalSerializer(proposals, many=True)
        return Response(serializer.data)
    
# ADMIN VIEWS get all proposal 
class AdminProposalList(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, proposal_type, format=None):
        proposals = Proposal.objects.filter(proposal_type=proposal_type)
        serializer = ProposalSerializer(proposals, many=True)
        return Response(serializer.data)
    
class AdminOverviewView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, format=None):
        service = OverviewService()
        data = service.get_status_counts()
        return Response(data, status=status.HTTP_200_OK)
    