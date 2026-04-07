from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny 
# app
from .models import ProgramProposal, ProgramProposalHistory
from django.contrib.auth.models import User
from .serializers import (
    ProgramProposalSerializer,
    ProgramProjectsSerializer,
    ProgramProposalHistoryListSerializer,
    ProgramProposalHistorySerializer
)
from .mapper import ProgramHistoryMapper
from proposals_node.models import Proposal
from proposals_node.services import YearConfigService
from notifications.services import NotificationService
from reviewer.models import ProposalReviewer
from reviewer.services import ProposalReviewerServices
from notifications.models import Notification
# Create your views here.

# IMPLEMENTOR VIEWS CREATE proposal
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
        if YearConfigService.check_year_lock():
            return Response({"message": "The creation of proposals is locked. You cannot submit a proposal until the admin unlock."}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ProgramProposalSerializer(
            data=request.data,
            context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            # add notification to admin
            NotificationService.admin_notifications(
                f"New program proposal submitted by Mr/Mrs.{request.user.profile.name} with title '{serializer.data.get('program_title')}'."
            )
            return Response(
                {
                    "message": "Program proposal created successfully",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# get the program proposal details
class ProgramProposalDetail(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk):
        program_proposal = get_object_or_404(
            ProgramProposal,
            id=pk
        )
        return program_proposal
    
    def get(self, request, pk):
        program_proposal = self.get_object(pk) 
        serializer = ProgramProposalSerializer(program_proposal)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    # update program proposal 
    def put(self, request, pk):
        program_proposal = self.get_object(pk)
        serializer = ProgramProposalSerializer(program_proposal, data=request.data)
        
        # get the proposal reviewer to notify that this proposal is already reviewed
        proposal_reviewer = ProposalReviewer.objects.filter(proposal=request.data.get('proposal'))
        
        # check if all reviewers have reviewed the proposal
        proposal = request.data.get('proposal')
        if not ProposalReviewerServices.check_all_reviewer_already_review(proposal_id=proposal):
            return Response({"message": "All reviewers should review this proposal before updating"}, status=status.HTTP_400_BAD_REQUEST)
        
        if serializer.is_valid():
            program_data = serializer.save()
             # notification for admin
            NotificationService.admin_notifications(
                f"The program proposal titled '{serializer.data.get('program_title')}' has been updated by Mr/Mrs. {request.user.profile.name} and saved to history."
            )
            # save notification for every reviewer that this proposal is already revised
            for r in proposal_reviewer:
                Notification.objects.create(
                    user= r.reviewer,
                    message=f"The proposal '{program_data.program_title}' has been revised by the implementor and is ready for your review."
                )
            # remove the reviewed indicator for reviewer
            proposal_reviewer.update(is_review=False)
            
            return Response(
                {"detail": "Program proposal updated successfully"},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# list of project proposal under a program proposal
class ProgramProjectsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, program_proposal_id):
        program_proposal = ProgramProposal.objects.get(id=program_proposal_id)
        serializer = ProgramProjectsSerializer(program_proposal)
        return Response(serializer.data, status=status.HTTP_200_OK)   
    
# get the list of proposal history under a program proposal
class ProgramListHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, proposal_id):
        # serialize the object
        proposal = get_object_or_404(Proposal, id=proposal_id)
        program_proposal = get_object_or_404(ProgramProposal, proposal=proposal)
        history = proposal.program_history.all()
        
        # serialize the object
        program_serializer = ProgramProposalSerializer(program_proposal)
        history_serializer = ProgramProposalHistoryListSerializer(history, many=True)
        return Response(ProgramHistoryMapper.history_list_mapper(program_serializer.data, history_serializer.data), status=status.HTTP_200_OK)

# get the history including the details
# class ProgramProposalHistoryDetails(APIView):
#     permission_classes = [IsAuthenticated]

#     def get_object(self, request, pk):
#         return get_object_or_404(ProgramProposalHistory, id=pk)
#     def get(self, request, pk):
#         ...
#         program_history = self.get_object(request, pk)
#         serializer = ProgramProposalHistorySerializer(program_history)
#         return Response(serializer.data, status=status.HTTP_200_OK)