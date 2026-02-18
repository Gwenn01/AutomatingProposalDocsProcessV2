from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from .views import AssignReviewerView, ReviewerListView

urlpatterns = [
    path('assign-reviewer/', AssignReviewerView.as_view(), name='assign-reviewer'),
    path('reviewers/', ReviewerListView.as_view(), name='reviewer-list'),
]

urlpatterns = format_suffix_patterns(urlpatterns)