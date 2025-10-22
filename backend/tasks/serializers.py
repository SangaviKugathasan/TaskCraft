from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    is_overdue = serializers.ReadOnlyField()
    priority_color = serializers.ReadOnlyField()
    
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'is_completed', 
            'priority', 'category', 'due_date', 'created_at', 
            'updated_at', 'is_overdue', 'priority_color'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
