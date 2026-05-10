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
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (err) {
      setError('Failed to load tasks');
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData);
        setEditingTask(null);
      } else {
        await createTask(formData);
      }
      setFormData({ title: '', description: '' });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({ title: task.title, description: task.description });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleTaskStatus(id);
      fetchTasks();
    } catch (err) {
      setError('Failed to update task status');
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setFormData({ title: '', description: '' });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Task Tracker</h1>
        <div className="user-info">
          <span>Welcome, {user.username}!</span>
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
              placeholder="Task title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Task description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
            />
            <div className="form-buttons">
              <button type="submit" className="submit-btn">
                {editingTask ? 'Update Task' : 'Add Task'}
              </button>
              {editingTask && (
                <button type="button" onClick={cancelEdit} className="cancel-btn">
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
              <p className="no-tasks">No tasks found. Create one above!</p>
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
                    <p className="task-description">{task.description}</p>
                    <small className="task-date">
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <div className="task-actions">
                    <button
                      onClick={() => handleToggleStatus(task._id)}
                      className="toggle-btn"
                    >
                      {task.status === 'pending' ? '✓ Complete' : '↺ Undo'}
                    </button>
                    <button
                      onClick={() => handleEdit(task)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="delete-btn"
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
