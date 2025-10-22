import React, { useState, useEffect } from 'react'
import axios from 'axios'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import Header from './components/Header'
import Footer from './components/Footer'
import Stats from './components/Stats'
import './index.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [tasks, setTasks] = useState([])
  const [completedTasks, setCompletedTasks] = useState([])
  const [overdueTasks, setOverdueTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('active')
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    overdue: 0,
    today: 0
  })

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const [activeRes, completedRes, overdueRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/tasks/`),
        axios.get(`${API_BASE_URL}/api/tasks/completed/`),
        axios.get(`${API_BASE_URL}/api/tasks/overdue/`)
      ])
      
      const activeData = Array.isArray(activeRes.data) ? activeRes.data : (activeRes.data?.results || [])
      const completedData = Array.isArray(completedRes.data) ? completedRes.data : (completedRes.data?.results || [])
      const overdueData = Array.isArray(overdueRes.data) ? overdueRes.data : (overdueRes.data?.results || [])
      
      setTasks(activeData)
      setCompletedTasks(completedData)
      setOverdueTasks(overdueData)
      
      // Calculate stats
      const today = new Date().toDateString()
      const todayTasks = activeData.filter(task => {
        if (!task.due_date) return false
        return new Date(task.due_date).toDateString() === today
      }).length
      
      setStats({
        total: activeData.length,
        completed: completedData.length,
        overdue: overdueData.length,
        today: todayTasks
      })
    } catch (err) {
      setError('Failed to fetch tasks. Please try again.')
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  // Add new task
  const addTask = async (taskData) => {
    try {
      setError(null)
      const response = await axios.post(`${API_BASE_URL}/api/tasks/`, taskData)
      // Optimistic update: prepend new task to the list
      setTasks(prev => [response.data, ...prev])
      setStats(prev => ({ ...prev, total: prev.total + 1 }))
      return response.data
    } catch (err) {
      setError('Failed to add task. Please try again.')
      console.error('Error adding task:', err)
      throw err
    }
  }

  // Mark task as done
  const markTaskDone = async (taskId) => {
    try {
      setError(null)
      await axios.patch(`${API_BASE_URL}/api/tasks/${taskId}/done/`)
      // Remove task from active list and add to completed
      const task = tasks.find(t => t.id === taskId)
      if (task) {
        setTasks(prev => prev.filter(t => t.id !== taskId))
        setCompletedTasks(prev => [{ ...task, is_completed: true }, ...prev])
        setStats(prev => ({ 
          ...prev, 
          total: prev.total - 1, 
          completed: prev.completed + 1 
        }))
      }
    } catch (err) {
      setError('Failed to complete task. Please try again.')
      console.error('Error completing task:', err)
      await fetchTasks()
    }
  }

  // Mark task as undone
  const markTaskUndone = async (taskId) => {
    try {
      setError(null)
      await axios.patch(`${API_BASE_URL}/api/tasks/${taskId}/undo/`)
      // Move task from completed to active
      const task = completedTasks.find(t => t.id === taskId)
      if (task) {
        setCompletedTasks(prev => prev.filter(t => t.id !== taskId))
        setTasks(prev => [{ ...task, is_completed: false }, ...prev])
        setStats(prev => ({ 
          ...prev, 
          total: prev.total + 1, 
          completed: prev.completed - 1 
        }))
      }
    } catch (err) {
      setError('Failed to undo task. Please try again.')
      console.error('Error undoing task:', err)
      await fetchTasks()
    }
  }

  // Update task
  const updateTask = async (taskId, taskData) => {
    try {
      setError(null)
      const response = await axios.patch(`${API_BASE_URL}/api/tasks/${taskId}/`, taskData)
      // Update task in the appropriate list
      if (response.data.is_completed) {
        setCompletedTasks(prev => prev.map(t => t.id === taskId ? response.data : t))
      } else {
        setTasks(prev => prev.map(t => t.id === taskId ? response.data : t))
      }
      return response.data
    } catch (err) {
      setError('Failed to update task. Please try again.')
      console.error('Error updating task:', err)
      throw err
    }
  }

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      setError(null)
      await axios.delete(`${API_BASE_URL}/api/tasks/${taskId}/`)
      // Remove task from all lists
      setTasks(prev => prev.filter(t => t.id !== taskId))
      setCompletedTasks(prev => prev.filter(t => t.id !== taskId))
      setOverdueTasks(prev => prev.filter(t => t.id !== taskId))
      setStats(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }))
    } catch (err) {
      setError('Failed to delete task. Please try again.')
      console.error('Error deleting task:', err)
    }
  }

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks()
  }, [])

  const getCurrentTasks = () => {
    switch (activeTab) {
      case 'completed':
        return completedTasks
      case 'overdue':
        return overdueTasks
      default:
        return tasks
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col">
      <Header stats={stats} activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 w-full flex flex-col items-center">
        <div className="w-full max-w-6xl px-2 sm:px-4 md:px-6 lg:px-8 py-3 md:py-8 flex flex-col gap-y-6">
          {/* Stats Section */}
          <Stats stats={stats} />
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          {/* Task Form */}
          <div>
            <TaskForm onAddTask={addTask} />
          </div>
          {/* Task List */}
          <div>
            <TaskList 
              tasks={getCurrentTasks()}
              loading={loading} 
              onMarkDone={markTaskDone}
              onMarkUndone={markTaskUndone}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              onRefresh={fetchTasks}
              activeTab={activeTab}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App