from django.shortcuts import render
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ActivityProposal
from .serializers import ActivityProposalSerializer

class ActivityProposalList(APIView):
    def post(self, request):
        serializer = ActivityProposalSerializer(
            data=request.data,
            context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Activity proposal created successfully",  
                             "data": serializer.data}, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ActivityProposalDetail(APIView):
    def get(self, request, pk):
        activity_proposal = ActivityProposal.objects.get(pk=pk)
        serializer = ActivityProposalSerializer(activity_proposal)
        return Response(serializer.data, status=status.HTTP_200_OK)

   