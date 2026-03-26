from rest_framework import serializers
from .models import Proposal, YearConfig
from decimal import Decimal, ROUND_HALF_UP

class ProposalSerializer(serializers.ModelSerializer):

    child_id = serializers.SerializerMethodField()
    reviewer_count = serializers.SerializerMethodField()
    reviewed_count = serializers.SerializerMethodField()
    review_progress = serializers.SerializerMethodField()
    child_title = serializers.SerializerMethodField()
    created_by = serializers.SerializerMethodField()
    budget_requested = serializers.SerializerMethodField()

    class Meta:
        model = Proposal
        fields = '__all__'

    def get_child_id(self, obj):
        if obj.proposal_type == "Program" and hasattr(obj, 'program_details'):
            return obj.program_details.id
        if obj.proposal_type == "Project" and hasattr(obj, 'project_details'):
            return obj.project_details.id
        if obj.proposal_type == "Activity" and hasattr(obj, 'activity_details'):
            return obj.activity_details.id
        return None

    def get_reviewer_count(self, obj):
        return obj.assigned_reviewers.count()

    def get_reviewed_count(self, obj):
        return obj.assigned_reviewers.filter(is_review=True).count()

    def get_review_progress(self, obj):
        total = obj.assigned_reviewers.count()
        reviewed = obj.assigned_reviewers.filter(is_review=True).count()
        return f"{reviewed} out of {total}"
    
    def get_child_title(self, obj):
        if obj.proposal_type == "Program" and hasattr(obj, 'program_details'):
            return obj.program_details.program_title
        if obj.proposal_type == "Project" and hasattr(obj, 'project_details'):
            return obj.project_details.project_title
        if obj.proposal_type == "Activity" and hasattr(obj, 'activity_details'):
            return obj.activity_details.activity_title
        
    def get_created_by(self, obj):
        return obj.user.profile.name
    
    def get_budget_requested(self, obj):
        data = obj.program_details.budget_requirements or []

        total = Decimal("0")

        for item in data:
            amount = item.get("amount", 0)
            total += Decimal(str(amount))

        return str(total.quantize(Decimal("0.00"), rounding=ROUND_HALF_UP))
    
    
class YearConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = YearConfig
        fields = ['year', 'total_budget', 'used_budget', 'is_locked']

    def validate_year(self, value):
        if value < 2000:
            raise serializers.ValidationError("Invalid year")
        return value

    def validate_total_budget(self, value):
        if value < 0:
            raise serializers.ValidationError("Budget cannot be negative")
        return value
