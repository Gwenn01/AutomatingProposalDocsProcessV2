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
    ProposalSerializer
)
from .services import OverviewService
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
    
# ADMIN VIEWS get all proposal ===========================================================================
class AdminOverviewView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, year, format=None):
        service = OverviewService()
        data = service.get_status_counts(year)
        return Response(data, status=status.HTTP_200_OK)
class AdminProposalList(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, proposal_type, format=None):
        proposals = Proposal.objects.filter(proposal_type=proposal_type)
        serializer = ProposalSerializer(proposals, many=True)
        return Response(serializer.data)
    
class AdminSetYearConfigView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, format=None):
        try:
            year = request.data.get('year')
            total_budget = request.data.get('total_budget')
            used_budget = request.data.get('used_budget', 0)
            is_locked = request.data.get('is_locked', False)
            #  VALIDATION
            if not year:
                return Response({"error": "Year is required"}, status=400)
            if total_budget is None:
                return Response({"error": "Total budget is required"}, status=400)
            config, created = YearConfig.objects.update_or_create(
                year=year,
                defaults={
                    'total_budget': total_budget,
                    'used_budget': used_budget,
                    'is_locked': is_locked
                }
            )
            return Response({
                "message": "Year config saved",
                "year": config.year,
                "total_budget": str(config.total_budget),
                "used_budget": str(config.used_budget),
                "is_locked": config.is_locked
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
            
class AdminGetYearConfigView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, year, format=None):
        try:
            year_configs = YearConfig.objects.get(year=year)
            
            return Response({
                "message": "Year configs retrieved",
                "year": year_configs.year,
                "total_budget": str(year_configs.total_budget),
                "used_budget": str(year_configs.used_budget),
                "is_locked": year_configs.is_locked
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST) 

    
# REVIEWER VIEWS APPROVE PROPOSAL ==========================================================================
class ReviewerApproveProposalView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, proposal_id, format=None):
        proposal = get_object_or_404(Proposal, id=proposal_id)
        proposal.status = 'for_approval'
        proposal.save()
        return Response({"message": "Proposal approved successfully"},status=status.HTTP_200_OK)