from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import ProposalReviewer
from .serializers import ReviewerSerializer
from django.contrib.auth.models import User
from users.serializers import UserSerializer

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
    
class ReviewerListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        reviewers = User.objects.all()
        reviewers = reviewers.filter(profile__role='reviewer')
        serializer = UserSerializer(reviewers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
