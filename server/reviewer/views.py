from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.exceptions import PermissionDenied

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
# ADMIN VIEWS assign reviewer and get the assigned 
class AssignReviewerView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        proposal_reviewers = ProposalReviewer.objects.filter(assigned_by=request.user)
        serializer = ReviewerSerializer(proposal_reviewers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ReviewerSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            reviewer = serializer.save()
            return Response(
                {"message": "Reviewer assigned successfully", "data": ReviewerSerializer(reviewer).data},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# get all reviewers  
class ReviewerListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        reviewers = User.objects.all()
        reviewers = reviewers.filter(profile__role='reviewer')
        serializer = UserSerializer(reviewers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
# REVIEWER VIEWS get the assigned proposal for the reviewer
class MyAssignedProposalsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        proposal_reviewers = ProposalReviewer.objects.filter(reviewer=request.user)
        serializer = ReviewerProposalSerializer(proposal_reviewers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
#GENERAL VIEWS get the assigned reviewers for a proposal
class AssignedReviewerProposalView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, proposal_id, format=None):
        proposals = ProposalReviewer.objects.filter(
            proposal_id=proposal_id,
        )
         # allow admin
        if request.user.is_staff:
            pass

        # allow proposal owner
        elif proposals.user == request.user:
            pass

        # allow assigned reviewer
        elif not ProposalReviewer.objects.filter(
            proposal=proposals,
            reviewer=request.user
        ).exists():
            raise PermissionDenied("You cannot view this proposal reviewers.")
        
        serializer = ReviewerAssignedProposalSerializer(proposals, many=True)
        return Response(serializer.data)
