from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'due_date', 'priority']
    ordering = ['-priority', '-created_at']

    def get_queryset(self):
        if self.action == 'list':
            # No slicing! DRF pagination will handle limit/offset
            return Task.objects.filter(is_completed=False).order_by('-priority', '-created_at')
        return Task.objects.all()

    def get_object(self):
        pk = self.kwargs.get('pk')
        return Task.objects.get(pk=pk)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['patch'])
    def done(self, request, pk=None):
        task = self.get_object()
        task.is_completed = True
        task.save()
        return Response({'status': 'task completed'})

    @action(detail=True, methods=['patch'])
    def undo(self, request, pk=None):
        task = self.get_object()
        task.is_completed = False
        task.save()
        return Response({'status': 'task undone'})

    @action(detail=False, methods=['get'])
    def completed(self, request):
        completed_tasks = Task.objects.filter(is_completed=True).order_by('-updated_at')
        serializer = self.get_serializer(completed_tasks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def overdue(self, request):
        from django.utils import timezone
        overdue_tasks = Task.objects.filter(
            due_date__lt=timezone.now(),
            is_completed=False
        ).order_by('due_date')
        serializer = self.get_serializer(overdue_tasks, many=True)
        return Response(serializer.data)
