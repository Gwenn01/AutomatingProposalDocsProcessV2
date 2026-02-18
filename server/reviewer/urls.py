from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from .views import AssignReviewerView

urlpatterns = [
    path('assign-reviewer/', AssignReviewerView.as_view(), name='assign-reviewer'),
]

urlpatterns = format_suffix_patterns(urlpatterns)