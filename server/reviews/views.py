from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
# app
from .models import ProposalReview
from .serializers import ProposalReviewSerializer
from .selectors import ProposalReviewSelectors
from reviewer.models import ProposalReviewer
# Create your views here.

class ProposalReviewList(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = ProposalReviewSerializer(data=request.data)

        proposal_reviewer_id = request.data.get('proposal_reviewer')
        reviewer = get_object_or_404(ProposalReviewer, id=proposal_reviewer_id)

        # Check if already reviewed
        if reviewer.is_review:
            return Response(
                {"detail": "This reviewer has already submitted a review."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if serializer.is_valid():
            review = serializer.save()

            reviewer.is_review = True
            reviewer.save()

            return Response(
                ProposalReviewSerializer(review).data,
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProposalReviewDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(ProposalReview, pk=pk)

    def get(self, request, pk, format=None):
        review = self.get_object(pk)
        serializer = ProposalReviewSerializer(review)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        review = self.get_object(pk)
        serializer = ProposalReviewSerializer(review, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk, format=None):
        review = self.get_object(pk)
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# get the proposal with reviews  
class ProposalReviewListByProposal(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, proposal_id, proposal_type, format=None):
        data = ProposalReviewSelectors.proposal_reviews_mapper(proposal_id, proposal_type)
        return Response(data, status=status.HTTP_200_OK)
    
# get the proposal with reviews history
# class ProposalReviewListByProposalHistory(APIView):
#     permission_classes = [IsAuthenticated]
#     def get(self, request, proposal_id, proposal_type, format=None):
#         data = ProposalReviewSelectors.proposal_reviews_detail_mapper(proposal_id, proposal_type)
#         return Response(data, status=status.HTTP_200_OK)