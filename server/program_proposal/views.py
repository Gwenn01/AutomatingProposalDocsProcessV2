from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny 
from .serializers import ProgramProposalSerializer
from .models import ProgramProposal
from django.contrib.auth.models import User

# Create your views here.

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
            return Response(
                {
                    "message": "Program proposal created successfully",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class ProgramProposalDetail(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk, user):
        program_proposal = get_object_or_404(ProgramProposal, id=pk)

        # Allow if admin
        if user.is_staff:
            return program_proposal

        # Allow if owner
        if program_proposal.proposal.user == user:
            return program_proposal

        # Otherwise deny
        raise PermissionDenied("You do not have permission to view this proposal.")
    
    def get(self, request, pk):
        program_proposal = self.get_object(pk, request.user)
        serializer = ProgramProposalSerializer(program_proposal)
        return Response(serializer.data, status=status.HTTP_200_OK)