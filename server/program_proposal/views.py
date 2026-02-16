from django.shortcuts import render
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ProgramProposalSerializer
from .models import ProgramProposal
from django.contrib.auth.models import User

# Create your views here.

class ProgramProposalList(APIView):
    # def get(self, request):
    #     program_proposals = ProgramProposal.objects.filter(
    #         proposal__user=request.user
    #     )

    #     serializer = ProgramProposalSerializer(
    #         program_proposals,
    #         many=True
    #     )

    #     return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = ProgramProposalSerializer(
            data=request.data,
            context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Program proposal created successfully",  
                             "data": serializer.data}, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ProgramProposalDetail(APIView):
    def get(self, request, pk):
        program_proposal = ProgramProposal.objects.get(id=pk)
        serializer = ProgramProposalSerializer(program_proposal)
        return Response(serializer.data, status=status.HTTP_200_OK)
