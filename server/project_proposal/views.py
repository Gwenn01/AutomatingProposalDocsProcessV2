from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny 
from .models import ProjectProposal
from .serializers import (
    ProjectProposalSerializer,
    ProjectProposalUpdateSaveHistorySerializer,
    ProjectActivitiesSerializer,
    ProjectProposalHistoryListSerializer
)
from .mapper import ProjectHistoryMapper
from notifications.services import NotificationService
from reviewer.services import ProposalReviewerServices
from proposals_node.models import Proposal
from proposals_node.services import YearConfigService
from notifications.models import Notification
from reviewer.models import ProposalReviewer
# Create your views here.

class ProjectProposalList(APIView):
    permission_classes = [IsAuthenticated]
    # def get(self, request):
    #     project_proposals = ProjectProposal.objects.filter(
    #         proposal__user=request.user
    #     )

    #     serializer = ProjectProposalSerializer(
    #         project_proposals,
    #         many=True
    #     )
    #     return Response(serializer.data, status=status.HTTP_200_OK)
    
    # def post(self, request):
    #     serializer = ProjectProposalSerializer(
    #         data=request.data,
    #         context={"request": request}
    #     )
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response({"message": "Project proposal created successfully",  
    #                          "data": serializer.data}, status=status.HTTP_201_CREATED
    #         )
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# update the specific fields of a project proposal
# project proposal creations
class ProjectProposalDetail(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk):
        project_proposal = get_object_or_404(
            ProjectProposal,
            id=pk
        )
        return project_proposal
    
    def get(self, request, pk):
        project_proposal = self.get_object(pk)
        serializer = ProjectProposalSerializer(
            project_proposal,
            context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, pk):
        if YearConfigService.check_year_lock():
            return Response({"message": "The creation of proposals is locked. You cannot submit a proposal until the admin unlock."}, status=status.HTTP_400_BAD_REQUEST)
        
        project_proposal = self.get_object(pk)
        serializer = ProjectProposalSerializer(
            project_proposal,
            data=request.data,
            context={"request": request},
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            NotificationService.admin_notifications(
                f"New project proposal submitted by{request.user.profile.name} with title '{serializer.data.get('project_title')}'."
            )
            return Response({"message": "Project proposal updated successfully",
                         "data": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# views for update proposal and save the history of it
class UpdateProjectSaveHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk):
        project_proposal = get_object_or_404(
            ProjectProposal,
            id=pk
        )
        return project_proposal
    
    def put(self, request, pk):
        project_proposal = self.get_object(pk)
        serializer = ProjectProposalUpdateSaveHistorySerializer(
            project_proposal,
            data=request.data,
            context={"request": request},
            partial=True
        )
        
        #get the proposal reviewer to notify that this proposal is already reviewed
        proposal_reviewer = ProposalReviewer.objects.filter(proposal=request.data.get('proposal'))
        
        # check if all reviewers have reviewed the proposal
        proposal = request.data.get('proposal')
        if not ProposalReviewerServices.check_all_reviewer_already_review(proposal_id=proposal):
            return Response({"message": "All reviewers should review this proposal before updating"}, status=status.HTTP_400_BAD_REQUEST)
        
        
        if serializer.is_valid():
            project_data = serializer.save()
            # notification for admin
            NotificationService.admin_notifications(
                f"The project proposal titled '{serializer.data.get('project_title')}' has been updated by {request.user.profile.name} and saved to history."
            )
            
            # notification for reviewer
            # save notification for every reviewer that this proposal is already revised
            for r in proposal_reviewer:
                Notification.objects.create(
                    user= r.reviewer,
                    message=f"The proposal '{project_data.project_title}' has been revised by the implementor and is ready for your review."
                )
            # remove the reviewed indicator for reviewer
            proposal_reviewer.update(is_review=False)
            
            return Response({"message": "Project proposal updated successfully",
                         "data": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# list of activities for a project proposal
class ProjectActivitiesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, project_proposal_id):
        try:
            project_proposal = ProjectProposal.objects.get(id=project_proposal_id)
        except ProjectProposal.DoesNotExist:
            return Response("Project proposal not found", status=status.HTTP_404_NOT_FOUND)
        serializer = ProjectActivitiesSerializer(project_proposal)
        return Response(serializer.data, status=status.HTTP_200_OK)


# list of project list history 
class ProjectListHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, proposal_id):
        # serialize the object
        ...
        proposal = get_object_or_404(Proposal, id=proposal_id)
        project_proposals = get_object_or_404(ProjectProposal, proposal=proposal)
        history = proposal.project_history.all()
        
        project_serializer = ProjectProposalSerializer(project_proposals)
        history_serializer = ProjectProposalHistoryListSerializer(history, many=True)
        
        return Response(ProjectHistoryMapper.history_list_mapper(project_serializer.data, history_serializer.data), status=status.HTTP_200_OK)