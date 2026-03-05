class ActivityHistoryMapper:
    @staticmethod
    def history_list_mapper(activity, history):
        data = []
        data.append({
            "proposal_id": activity['proposal'],
            "activity_id": activity['id'],
            "activity_title": activity['activity_title'],
            "project_leader": activity['project_leader'],
            "status": "current"
        })
        for h in history:
            data.append({
                "proposal_id": activity['proposal_id'],
                "history_id": h['history_id'],
                "activity_title": h['activity_title'],
                "project_leader": h['project_leader'],
                "version": h['version'],
                "status": "history"
            })
        return data