from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from .models import Proposal
from .serializers import ProposalSerializer
# Create your views here.

class ProposalList(APIView):
    def get(self, request, format=None):
        proposals = Proposal.objects.filter(user=request.user)
        serializer = ProposalSerializer(proposals, many=True)
        return Response(serializer.data)

   