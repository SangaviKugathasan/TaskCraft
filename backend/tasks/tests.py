from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from .models import Task


class TaskModelTest(TestCase):
    def setUp(self):
        self.task = Task.objects.create(
            title="Test Task",
            description="Test Description",
            is_completed=False
        )

    def test_task_creation(self):
        self.assertEqual(self.task.title, "Test Task")
        self.assertEqual(self.task.description, "Test Description")
        self.assertFalse(self.task.is_completed)
        self.assertIsNotNone(self.task.created_at)

    def test_task_str_representation(self):
        self.assertEqual(str(self.task), "Test Task")

    def test_task_ordering(self):
        task2 = Task.objects.create(
            title="Second Task",
            description="Second Description"
        )
        tasks = Task.objects.all().order_by('-created_at')
        self.assertEqual(tasks[0], task2)  # Most recent first


class TaskAPITest(APITestCase):
    def setUp(self):
        # Clear all tasks before each test
        Task.objects.all().delete()
        
        self.task_data = {
            'title': 'API Test Task',
            'description': 'API Test Description'
        }
        self.task = Task.objects.create(
            title="Existing Task",
            description="Existing Description"
        )

    def test_create_task(self):
        url = '/api/tasks/'
        response = self.client.post(url, self.task_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 2)
        # Check that the created task exists in the database
        created_task = Task.objects.filter(title='API Test Task').first()
        self.assertIsNotNone(created_task)
        self.assertEqual(created_task.title, 'API Test Task')

    def test_list_tasks(self):
        url = '/api/tasks/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # The response should have a 'results' key with the tasks
        self.assertIn('results', response.data)
        self.assertEqual(len(response.data['results']), 1)

    def test_mark_task_done(self):
        url = f'/api/tasks/{self.task.pk}/done/'
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check if task is marked as completed
        self.task.refresh_from_db()
        self.assertTrue(self.task.is_completed)

    def test_list_only_uncompleted_tasks(self):
        # Create a completed task
        completed_task = Task.objects.create(
            title="Completed Task",
            description="Completed Description",
            is_completed=True
        )
        
        url = '/api/tasks/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)  # Only uncompleted task
        self.assertEqual(response.data['results'][0]['title'], 'Existing Task')

    def test_latest_5_tasks_limit(self):
        # Create 6 tasks
        for i in range(6):
            Task.objects.create(
                title=f"Task {i}",
                description=f"Description {i}"
            )
        
        url = '/api/tasks/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 5)  # Only latest 5

    def test_create_task_without_description(self):
        task_data = {'title': 'Task without description'}
        url = '/api/tasks/'
        response = self.client.post(url, task_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Check that the created task exists in the database
        created_task = Task.objects.filter(title='Task without description').first()
        self.assertIsNotNone(created_task)
        self.assertEqual(created_task.description, None)

    def test_create_task_validation(self):
        # Test with empty title
        task_data = {'title': ''}
        url = '/api/tasks/'
        response = self.client.post(url, task_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)