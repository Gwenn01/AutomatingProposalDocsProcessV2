from django.shortcuts import render
from rest_framework.permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from django.shortcuts import get_object_or_404
from .models import Proposal, YearConfig
from .serializers import (
    ProposalSerializer,
    YearConfigSerializer
)
from .services import OverviewService
from notifications.services import NotificationService
# Create your views here.

# IMPLEMENTOR VIEWS get list of proposal
class ProposalList(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, proposal_type, format=None):
        proposals = Proposal.objects.filter(
            user=request.user,
            proposal_type=proposal_type
        )

        serializer = ProposalSerializer(proposals, many=True)
        return Response(serializer.data)

# implementor progress proposal node
class UpdateProposalProgressView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self, proposal_id):
        proposal = get_object_or_404(Proposal, id=proposal_id)
        return proposal
    
    def put(self, request, proposal_id, format=None):
        proposal = self.get_object(proposal_id)
        progress = request.data.get("progress")
        proposal.progress = progress
        proposal.save()
        if proposal:
            return Response({
                "message": "Proposal progress updated successfully",
                "proposal_id": proposal_id,
                "progress": proposal.progress
            }, status=status.HTTP_200_OK)
        return Response({
            "message": "Failed to update proposal progress",
        }, status=status.HTTP_400_BAD_REQUEST)
    
# ADMIN VIEWS get all proposal ===========================================================================
# get overview data
class AdminOverviewView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request, year, format=None):
        service = OverviewService()
        data = service.get_status_counts(year)
        return Response(data, status=status.HTTP_200_OK)
    
# get the list of proposal
class AdminProposalList(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request, proposal_type, format=None):
        proposals = Proposal.objects.filter(proposal_type=proposal_type)
        serializer = ProposalSerializer(proposals, many=True)
        return Response(serializer.data)

# set and get year config view 
class AdminYearConfigView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, year):
        config = get_object_or_404(YearConfig, year=year)
        return Response(YearConfigSerializer(config).data)

    def post(self, request):
        serializer = YearConfigSerializer(data=request.data)

        if serializer.is_valid():
            config, _ = YearConfig.objects.update_or_create(
                year=serializer.validated_data['year'],
                defaults=serializer.validated_data
            )
            return Response(YearConfigSerializer(config).data)

        return Response(serializer.errors, status=400) 

# set budget for implementor proposal
class AdminSetImplementorProposalBudgetView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, proposal_id, budget, format=None):
        try:
            proposal = Proposal.objects.get(id=proposal_id)
            # generate notification to implementor
            NotificationService.create_notification(
                user=proposal.user,
                message = f"The budget for the proposal '{proposal.title}' has been set to {budget} by the administrator."
            )

            proposal.budget_approved = budget
            proposal.save()

            return Response({
                "message": "Implementor budget set",
                "proposal_id": proposal_id,
                "approved_budget": proposal.budget_approved
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    
# REVIEWER VIEWS APPROVE PROPOSAL ==========================================================================
class ReviewerApproveProposalView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, proposal_id, format=None):
        proposal = get_object_or_404(Proposal, id=proposal_id)
        proposal.status = 'for_approval'
        proposal.save()
        return Response({"message": "Proposal approved successfully"},status=status.HTTP_200_OK)