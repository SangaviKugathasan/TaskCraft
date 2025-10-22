import React, { useState } from 'react'

const TaskCard = ({ task, onMarkDone, onMarkUndone, onEdit, onDelete, activeTab }) => {
  const [isCompleting, setIsCompleting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleMarkDone = async () => {
    try {
      setIsCompleting(true)
      await onMarkDone(task.id)
    } finally {
      setIsCompleting(false)
    }
  }

  const handleMarkUndone = async () => {
    try {
      setIsCompleting(true)
      await onMarkUndone(task.id)
    } finally {
      setIsCompleting(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await onDelete(task.id)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays === -1) return 'Yesterday'
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`
    return `In ${diffDays} days`
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      urgent: 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[priority] || colors.medium
  }

  const getCategoryIcon = (category) => {
    const icons = {
      work: '💼',
      personal: '👤',
      health: '🏥',
      finance: '💰',
      learning: '📚',
      other: '📝'
    }
    return icons[category] || icons.other
  }

  const isOverdue = task.is_overdue || (task.due_date && new Date(task.due_date) < new Date() && !task.is_completed)

  return (
    <div className={`group relative bg-white border border-gray-200 rounded-xl p-6 transition-all duration-200 hover:shadow-md ${
      isOverdue ? 'border-red-200 bg-red-50' : 'hover:border-gray-300'
    }`}>
      {/* Priority Indicator */}
      <div className="absolute top-4 right-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      {/* Overdue Badge */}
      {isOverdue && (
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            ⏰ Overdue
          </span>
        </div>
      )}

      <div className="pr-20">
        {/* Title and Category */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold text-gray-900 mb-1 ${
              task.is_completed ? 'line-through opacity-60' : ''
            }`}>
              {task.title}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{getCategoryIcon(task.category)}</span>
              <span className="capitalize">{task.category}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className={`text-gray-600 mb-4 leading-relaxed ${
            task.is_completed ? 'line-through opacity-60' : ''
          }`}>
            {task.description}
          </p>
        )}

        {/* Due Date */}
        {task.due_date && (
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              {formatDate(task.due_date)}
            </span>
            {isOverdue && (
              <span className="ml-2 text-red-600 font-medium">⚠️</span>
            )}
          </div>
        )}

        {/* Created Date */}
        <div className="flex items-center text-xs text-gray-400 mb-4">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Created {new Date(task.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          {/* Edit Button */}
          {!task.is_completed && (
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
            title="Delete task"
          >
            {isDeleting ? (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Complete/Undo Button */}
        <button
          onClick={task.is_completed ? handleMarkUndone : handleMarkDone}
          disabled={isCompleting}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
            task.is_completed
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-green-600 text-white hover:bg-green-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isCompleting ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : task.is_completed ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Undo</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Done</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default TaskCard