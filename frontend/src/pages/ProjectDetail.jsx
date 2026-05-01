import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjectDetail();
    fetchAllUsers();
  }, [id]);

  const fetchProjectDetail = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        API.get(`/projects/${id}`),
        API.get(`/tasks/project/${id}`),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await API.get('/users');
      setAllUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await API.post('/tasks', {
        ...formData,
        projectId: id,
      });
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'medium',
        dueDate: '',
      });
      setShowTaskForm(false);
      fetchProjectDetail();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      fetchProjectDetail();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await API.delete(`/tasks/${taskId}`);
        fetchProjectDetail();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  if (loading) {
    return <div className="container"><div className="spinner"></div></div>;
  }

  if (!project) {
    return <div className="container">Project not found</div>;
  }

  const isOwner = project.owner._id === user?.id;

  return (
    <div className="container project-detail-container">
      <div className="project-header">
        <div>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
        </div>
        <div className="project-status">
          <span className={`status-badge status-${project.status}`}>
            {project.status}
          </span>
        </div>
      </div>

      <div className="project-info">
        <div className="info-card">
          <strong>Owner:</strong> {project.owner.name}
        </div>
        <div className="info-card">
          <strong>Members:</strong> {project.members.length}
        </div>
        {project.dueDate && (
          <div className="info-card">
            <strong>Due Date:</strong> {new Date(project.dueDate).toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="card">
        <div className="tasks-header">
          <h2>Tasks</h2>
          {isOwner && (
            <button className="btn btn-primary btn-small" onClick={() => setShowTaskForm(!showTaskForm)}>
              {showTaskForm ? 'Cancel' : '+ New Task'}
            </button>
          )}
        </div>

        {showTaskForm && (
          <form onSubmit={handleSubmit} className="task-form">
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Assign To</label>
                <select name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
                  <option value="">Select member...</option>
                  {project.members.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-success">
              Create Task
            </button>
          </form>
        )}

        {tasks.length === 0 ? (
          <p>No tasks in this project yet.</p>
        ) : (
          <div className="tasks-list">
            {tasks.map((task) => (
              <div key={task._id} className="task-item">
                <div className="task-info">
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                  <div className="task-meta">
                    {task.assignedTo && (
                      <span>👤 {task.assignedTo.name}</span>
                    )}
                    <span className={`priority-${task.priority}`}>
                      ⚠️ {task.priority}
                    </span>
                    {task.dueDate && (
                      <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="task-actions">
                  <select
                    value={task.status}
                    onChange={(e) => handleTaskStatusChange(task._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                  {isOwner && (
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
