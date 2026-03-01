from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404

# app
from django.contrib.auth.models import User
from users.serializers import UserSerializer
from .models import ProposalReviewer
from .serializers import (
    ReviewerSerializer,
    ReviewerProposalSerializer,
    ReviewerAssignedProposalSerializer   
)
from .selectors import ReviewerProposalSelector
from proposals_node.models import Proposal
# ====================================================================================================
# ADMIN VIEWS assign reviewer and get the assigned 
class AssignReviewerView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        proposal_reviewers = ProposalReviewer.objects.filter(assigned_by=request.user)
        serializer = ReviewerSerializer(proposal_reviewers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ReviewerSerializer(data=request.data, context={'request': request})
        proposal = get_object_or_404(Proposal, id=request.data.get('proposal'))
        if serializer.is_valid():
            reviewer = serializer.save()
            # update the status when assign
            proposal.status = "for_review"
            proposal.save()
            
            return Response(
                {"message": "Reviewer assigned successfully", "data": ReviewerSerializer(reviewer).data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# get the list assigned to a proposal
class GetAssignedReviewerView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request, proposal):
        proposal_reviewers = ProposalReviewer.objects.filter(
            proposal=proposal,
            assigned_by=request.user
        )
        serializer = ReviewerSerializer(proposal_reviewers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# remove the assigned reviewer
class UnassignReviewerView(APIView):
    permission_classes = [IsAdminUser]
    def delete(self, request, pk):
        proposal_reviewer = get_object_or_404(
            ProposalReviewer,
            id=pk,
            assigned_by=request.user
        )
        proposal_reviewer.delete()
        return Response({"message": "Reviewer unassigned successfully"}, status=status.HTTP_204_NO_CONTENT)
    
# get all reviewers  
class ReviewerListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        reviewers = User.objects.all()
        reviewers = reviewers.filter(profile__role='reviewer')
        serializer = UserSerializer(reviewers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
# ====================================================================================================
# REVIEWER VIEWS get the assigned proposal for the reviewer
class MyAssignedProposalsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        return Response(ReviewerProposalSelector.get_reviewer_assigned_proposals(request.user), status=status.HTTP_200_OK)
 
 
  # ====================================================================================================   
#GENERAL VIEWS get the assigned reviewers proposal
class AssignedReviewerProposalView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, proposal_id, format=None):
        proposals = ProposalReviewer.objects.filter(
            proposal_id=proposal_id,
        )
        serializer = ReviewerAssignedProposalSerializer(proposals, many=True)
        return Response(serializer.data)
