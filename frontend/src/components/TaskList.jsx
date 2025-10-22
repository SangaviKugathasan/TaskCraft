import React, { useState } from 'react'
import TaskCard from './TaskCard'
import EditTaskModal from './EditTaskModal'

const TaskList = ({ 
  tasks, 
  loading, 
  onMarkDone, 
  onMarkUndone, 
  onUpdateTask, 
  onDeleteTask, 
  onRefresh, 
  activeTab 
}) => {
  const [editingTask, setEditingTask] = useState(null)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('priority')

  const normalizedTasks = Array.isArray(tasks) ? tasks : []

  const filteredTasks = normalizedTasks.filter(task => {
    if (filter === 'overdue') return task.is_overdue
    if (filter === 'today') {
      if (!task.due_date) return false
      const today = new Date().toDateString()
      return new Date(task.due_date).toDateString() === today
    }
    if (filter === 'high') return task.priority === 'high' || task.priority === 'urgent'
    return true
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'due_date':
        if (!a.due_date && !b.due_date) return 0
        if (!a.due_date) return 1
        if (!b.due_date) return -1
        return new Date(a.due_date) - new Date(b.due_date)
      case 'created_at':
        return new Date(b.created_at) - new Date(a.created_at)
      case 'priority':
      default:
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
  })

  const handleEdit = (task) => {
    setEditingTask(task)
  }

  const handleUpdate = async (taskData) => {
    try {
      await onUpdateTask(editingTask.id, taskData)
      setEditingTask(null)
    } catch (error) {
      // Error handling is done in parent component
    }
  }

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await onDeleteTask(taskId)
    }
  }

  const getEmptyStateMessage = () => {
    switch (activeTab) {
      case 'completed':
        return {
          icon: '✅',
          title: 'No completed tasks yet',
          subtitle: 'Complete some tasks to see them here'
        }
      case 'overdue':
        return {
          icon: '⏰',
          title: 'No overdue tasks',
          subtitle: 'Great job staying on top of your deadlines!'
        }
      default:
        return {
          icon: '📝',
          title: 'No active tasks',
          subtitle: 'Add your first task to get started'
        }
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading tasks...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {activeTab === 'completed' ? 'Completed Tasks' : 
               activeTab === 'overdue' ? 'Overdue Tasks' : 'Active Tasks'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {sortedTasks.length} of {normalizedTasks.length} tasks
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Tasks</option>
              <option value="overdue">Overdue</option>
              <option value="today">Due Today</option>
              <option value="high">High Priority</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="priority">Priority</option>
              <option value="due_date">Due Date</option>
              <option value="created_at">Created</option>
            </select>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Refresh tasks"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="p-6">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">{getEmptyStateMessage().icon}</div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              {getEmptyStateMessage().title}
            </h4>
            <p className="text-gray-500">
              {getEmptyStateMessage().subtitle}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onMarkDone={onMarkDone}
                onMarkUndone={onMarkUndone}
                onEdit={handleEdit}
                onDelete={handleDelete}
                activeTab={activeTab}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onUpdate={handleUpdate}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  )
}

export default TaskList