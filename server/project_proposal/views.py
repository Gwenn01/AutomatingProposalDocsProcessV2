from django.shortcuts import render
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ProjectProposal
from .serializers import ProjectProposalSerializer
# Create your views here.

class ProjectProposalList(APIView):
    # def get(self, request):
    #     project_proposals = ProjectProposal.objects.filter(
    #         proposal__user=request.user
    #     )

    #     serializer = ProjectProposalSerializer(
    #         project_proposals,
    #         many=True
    #     )
    #     return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = ProjectProposalSerializer(
            data=request.data,
            context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Project proposal created successfully",  
                             "data": serializer.data}, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ProjectProposalDetail(APIView):
    def get(self, request, pk):
        project_proposal = ProjectProposal.objects.get(
            pk=pk,
            proposal__user=request.user
        )

        serializer = ProjectProposalSerializer(
            project_proposal,
            context={"request": request}
        )

        return Response(serializer.data, status=status.HTTP_200_OK)