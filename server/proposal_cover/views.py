from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .models import  ProposalCoverPage
from .serializers import ProposalCoverSerializer
# Create your views here.

class ProposalCoverList(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, format=None):
        try:
            proposal_cover =  ProposalCoverPage.objects.all()
            serializer = ProposalCoverSerializer(proposal_cover, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request, format=None):
        try:
            serializer = ProposalCoverSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Proposal Cover Page created successfully"}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class ProposalCoverDetail(APIView):
    permission_classes = [IsAdminUser]

    def get_object(self, pk):
        try:
            return  ProposalCoverPage.objects.get(pk=pk)
        except ProposalCover.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        try:
            proposal_cover = self.get_object(pk)
            serializer = ProposalCoverSerializer(proposal_cover)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def put(self, request, pk, format=None):
        try:
            proposal_cover = self.get_object(pk)
            serializer = ProposalCoverSerializer(proposal_cover, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Proposal Cover Page updated successfully"}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk, format=None):
        try:
            proposal_cover = self.get_object(pk)
            proposal_cover.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)