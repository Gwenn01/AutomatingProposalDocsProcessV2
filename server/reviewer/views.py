from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from proposals_node.models import Proposal
from notifications.models import Notification

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
        serializer = ReviewerSerializer(
            data=request.data,
            context={'request': request}
        )
        user = get_object_or_404(User, id=request.data.get('reviewer'))
        proposal = get_object_or_404(Proposal, id=request.data.get('proposal')) 
        if serializer.is_valid():
            reviewer = serializer.save()
            # use reviewer.proposal instead of querying again
            reviewer.proposal.status = "for_review"
            reviewer.proposal.save()
            Notification.objects.create(
                user=user,
                message=f'You have been assigned to review proposal {proposal.title}',
            )
            return Response(
                {
                    "message": "Reviewer assigned successfully",
                    "data": ReviewerSerializer(reviewer).data
                },
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

        proposal = proposal_reviewer.proposal
        reviewer = proposal_reviewer.reviewer
        proposal_type = proposal_reviewer.proposal_type

        # If PROGRAM → delete everything under it
        if proposal_type == "program":

            program = proposal.program_details

            # delete project reviewers
            project_proposals = program.projects.all()
            ProposalReviewer.objects.filter(
                reviewer=reviewer,
                proposal__project_details__in=project_proposals
            ).delete()

            # delete activity reviewers
            ProposalReviewer.objects.filter(
                reviewer=reviewer,
                proposal__activity_details__project_proposal__in=project_proposals
            ).delete()

        # If PROJECT → delete activities under it
        elif proposal_type == "project":

            project = proposal.project_details

            ProposalReviewer.objects.filter(
                reviewer=reviewer,
                proposal__activity_details__project_proposal=project
            ).delete()

        # Finally delete the selected one itself
        proposal_reviewer.delete()

        return Response(
            {"message": "Reviewer unassigned successfully"},
            status=status.HTTP_204_NO_CONTENT
        )
    
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
class MyAssignedProgramProposalsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        return Response(ReviewerProposalSelector.get_reviewer_assigned_program_proposals(request.user), status=status.HTTP_200_OK)
 
class MyAssignedProjectProposalsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, program_id, format=None):
        return Response(ReviewerProposalSelector.get_reviewer_assigned_project_proposals(request.user, program_id=program_id), status=status.HTTP_200_OK)
    
class MyAssignedActivityProposalsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, project_id, format=None):
        return Response(ReviewerProposalSelector.get_reviewer_assigned_activity_proposal(request.user, project_id=project_id), status=status.HTTP_200_OK)
 
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


# check if the proposal is already reviewed by all reviewers, so that implementor can edit it
class ProposalCheckIfAllReviews(APIView):
    def get(self, request, proposal_id):
        reviewers = ProposalReviewer.objects.filter(proposal_id=proposal_id)

        #  NEW: No reviewers assigned
        if not reviewers.exists():
            return Response({
                "all_reviewed": False,
                "can_edit": False,
                "message": "No reviewers assigned yet. Editing is not allowed."
            })

        #  Check if there are pending reviews
        has_pending = reviewers.filter(is_review=False).exists()
        if has_pending:
            return Response({
                "all_reviewed": False,
                "can_edit": False,
                "message": "Not all reviewers have submitted their reviews."
            })

        #  All reviewers done
        return Response({
            "all_reviewed": True,
            "can_edit": True,
            "message": "All reviewers have completed their reviews."
        })
    