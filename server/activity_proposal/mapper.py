class ActivityHistoryMapper:
    @staticmethod
    def history_list_mapper(activity, history):
        data = []
        data.append({
            "activity_id": activity['id'],
            "activity_title": activity['activity_title'],
            "project_leader": activity['project_leader'],
            "status": "current"
        })
        for h in history:
            data.append({
                "activity_history_id": h['id'],
                "activity_title": h['activity_title'],
                "project_leader": h['project_leader'],
                "version": h['version'],
                "status": "history"
            })
        return data