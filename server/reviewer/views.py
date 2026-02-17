from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import ReviewerSerializer

class AssignReviewerView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ReviewerSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            reviewer = serializer.save()
            return Response(
                {"message": "Reviewer assigned successfully", "data": ReviewerSerializer(reviewer).data},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
