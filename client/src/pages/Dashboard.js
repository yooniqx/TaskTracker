import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, createTask, updateTask, deleteTask, toggleTaskStatus } from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks();
      // Handle both old and new API response formats
      const tasksData = response.data.tasks || response.data;
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    if (formData.title.length > 200) {
      setError('Task title must not exceed 200 characters');
      return;
    }

    if (formData.description.length > 1000) {
      setError('Description must not exceed 1000 characters');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData);
        setEditingTask(null);
      } else {
        await createTask(formData);
      }
      setFormData({ title: '', description: '' });
      await fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({ title: task.title, description: task.description || '' });
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTask(id);
      await fetchTasks();
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleTaskStatus(id);
      await fetchTasks();
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to update task status');
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setFormData({ title: '', description: '' });
    setError('');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Task Tracker</h1>
        <div className="user-info">
          <span>Welcome, {user.username || 'User'}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="task-form-section">
          <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="task-form">
            <input
              type="text"
              placeholder="Task title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              maxLength={200}
              required
              disabled={submitting}
            />
            <textarea
              placeholder="Task description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              maxLength={1000}
              disabled={submitting}
            />
            <div className="form-buttons">
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Saving...' : editingTask ? 'Update Task' : 'Add Task'}
              </button>
              {editingTask && (
                <button 
                  type="button" 
                  onClick={cancelEdit} 
                  className="cancel-btn"
                  disabled={submitting}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="tasks-section">
          <div className="filters">
            <h2>My Tasks</h2>
            <div className="filter-buttons">
              <button
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'active' : ''}
              >
                All ({tasks.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={filter === 'pending' ? 'active' : ''}
              >
                Pending ({tasks.filter(t => t.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={filter === 'completed' ? 'active' : ''}
              >
                Completed ({tasks.filter(t => t.status === 'completed').length})
              </button>
            </div>
          </div>

          <div className="tasks-list">
            {filteredTasks.length === 0 ? (
              <p className="no-tasks">
                {filter === 'all' 
                  ? 'No tasks yet. Create one above!' 
                  : `No ${filter} tasks found.`}
              </p>
            ) : (
              filteredTasks.map(task => (
                <div key={task._id} className={`task-card ${task.status}`}>
                  <div className="task-content">
                    <div className="task-header">
                      <h3>{task.title}</h3>
                      <span className={`status-badge ${task.status}`}>
                        {task.status}
                      </span>
                    </div>
                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}
                    <small className="task-date">
                      Created: {new Date(task.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </small>
                  </div>
                  <div className="task-actions">
                    <button
                      onClick={() => handleToggleStatus(task._id)}
                      className="toggle-btn"
                      title={task.status === 'pending' ? 'Mark as complete' : 'Mark as pending'}
                    >
                      {task.status === 'pending' ? '✓ Complete' : '↺ Undo'}
                    </button>
                    <button
                      onClick={() => handleEdit(task)}
                      className="edit-btn"
                      title="Edit task"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="delete-btn"
                      title="Delete task"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// Made with Bob
