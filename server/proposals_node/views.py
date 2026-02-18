from django.shortcuts import render
from rest_framework.permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from .models import Proposal
from .serializers import ProposalSerializer
# Create your views here.

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
