from django.db.models import Count
from .models import UserProfile


class OverviewUserService:

    @staticmethod
    def get_user_overview():
        # total users (all users)
        total_user = UserProfile.objects.count()
        # group by role
        role_counts = (
            UserProfile.objects
            .values('role')
            .annotate(total=Count('id'))
        )
        # default values
        overview = {
            'total_user': total_user,
            'implementor': 0,
            'reviewer': 0,
            'admin': 0,
        }
        # fill the values
        for item in role_counts:
            role = item['role']
            if role in overview:
                overview[role] = item['total']

        return overview
