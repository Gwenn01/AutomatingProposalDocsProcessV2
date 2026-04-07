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
from notifications.models import Notification
from proposals_node.models import Proposal
# Create your views here.
# create reviews =========================================================
class ProposalReviewList(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = ProposalReviewSerializer(data=request.data)

        proposal_reviewer_id = request.data.get('proposal_reviewer')
        reviewer = get_object_or_404(ProposalReviewer, id=proposal_reviewer_id)
        # get the proposal for notification
        proposal = get_object_or_404(Proposal, id=request.data.get('proposal_node'))
        proposal.status = "for_revision"
        proposal.save()
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

            Notification.objects.create(
                user=proposal.user,
                message=f"{reviewer.reviewer.profile.name} has submitted a review for your proposal titled '{proposal.title}'."
            )
            return Response(
                ProposalReviewSerializer(review).data,
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# get the reviews only ======================================================
class ProposalReviewDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, user, proposal):
        return get_object_or_404(
            ProposalReview,
            proposal_reviewer__reviewer=user,
            proposal_node=proposal
        )

    def get(self, request, proposal, format=None):
        review = self.get_object(request.user, proposal)
        serializer = ProposalReviewSerializer(review)
        return Response(serializer.data)

# get the proposal with reviews  =============================================================
class ProposalReviewByProposal(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, proposal_id, proposal_type, format=None):
        data = ProposalReviewSelectors.proposal_reviews_mapper(proposal_id, proposal_type)
        return Response(data, status=status.HTTP_200_OK)
    
# get the proposal with reviews history
class ProposalReviewHistoryByProposalHistory(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, proposal_id, history_id, version, proposal_type, format=None):
        data = ProposalReviewSelectors.proposal_reviews_history_mapper(proposal_id, history_id, version, proposal_type)
        return Response(data, status=status.HTTP_200_OK)
    
# when the reviews is created and then the implementor update the proposal, the reviews will be updated ================================================
class ProposalReviewUpdate(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, proposal, assignment):
        return get_object_or_404(
            ProposalReview,
            proposal_node_id=proposal,
            proposal_reviewer_id=assignment
        )

    def put(self, request, proposal, assignment):

        review = self.get_object(proposal, assignment)

        reviewer = get_object_or_404(
            ProposalReviewer,
            id=assignment
        )
        # get the proposal for notification
        proposal = get_object_or_404(Proposal, id=request.data.get('proposal_node'))
        proposal.status = "for_revision"
        proposal.save()
        # Prevent duplicate review submission
        if reviewer.is_review:
            return Response(
                {"detail": "This reviewer has already submitted a review."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ProposalReviewSerializer(
            review,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():

            serializer.save()

            # mark reviewer as reviewed
            reviewer.is_review = True
            reviewer.save()
            
            Notification.objects.create(
                user=proposal.user,
                message=f"{reviewer.reviewer.profile.name} has submitted a review for your proposal titled '{proposal.title}'."
            )

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)