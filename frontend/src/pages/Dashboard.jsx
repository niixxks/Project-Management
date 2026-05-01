import React, { useEffect, useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useContext(AuthContext);
  const [expandedTask, setExpandedTask] = useState(null);
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, tasksRes, projectsRes] = await Promise.all([
        API.get('/tasks/dashboard/stats'),
        API.get('/tasks/my/tasks'),
        API.get('/projects'),
      ]);
      setStats(statsRes.data);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      
      // Initialize comments for each task
      const commentMap = {};
      tasksRes.data.forEach(task => {
        commentMap[task._id] = task.comments || [];
      });
      setComments(commentMap);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      fetchDashboardData();
      alert('✅ Status updated!');
    } catch (error) {
      alert('❌ Error: ' + error.response?.data?.message);
    }
  };

  const handleAddComment = async (taskId) => {
    if (!newComments[taskId]?.trim()) return;
    
    try {
      await API.post(`/tasks/${taskId}/comments`, {
        comment: newComments[taskId],
      });
      setNewComments({ ...newComments, [taskId]: '' });
      fetchDashboardData();
      alert('✅ Comment added!');
    } catch (error) {
      alert('❌ Error: ' + error.response?.data?.message);
    }
  };

  const getUpcomingDeadlines = () => {
    const now = new Date();
    const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    return tasks.filter(
      (task) =>
        task.dueDate &&
        new Date(task.dueDate) > now &&
        new Date(task.dueDate) < twoWeeksLater &&
        task.status !== 'done'
    );
  };

  const overdueTasks = tasks.filter(
    (task) =>
      task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'
  );

  const upcomingDeadlines = getUpcomingDeadlines();

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p>Let's make today productive</p>
        </div>
        <div className="header-date">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          📋 My Tasks
        </button>
        <button
          className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          📁 Projects
        </button>
        <button
          className={`tab-btn ${activeTab === 'deadlines' ? 'active' : ''}`}
          onClick={() => setActiveTab('deadlines')}
        >
          📅 Calendar
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="dashboard-section">
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card glass">
              <div className="stat-icon">📁</div>
              <div className="stat-content">
                <h3>{projects.length}</h3>
                <p>My Projects</p>
              </div>
            </div>
            <div className="stat-card glass">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <h3>{tasks.length}</h3>
                <p>Total Tasks</p>
              </div>
            </div>
            <div className="stat-card glass">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>{stats?.completed || 0}</h3>
                <p>Completed</p>
              </div>
            </div>
            <div className="stat-card glass">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <h3>{stats?.inProgress || 0}</h3>
                <p>In Progress</p>
              </div>
            </div>
            <div className="stat-card glass">
              <div className="stat-icon">📌</div>
              <div className="stat-content">
                <h3>{stats?.todo || 0}</h3>
                <p>To Do</p>
              </div>
            </div>
            <div className="stat-card glass warning">
              <div className="stat-icon">⏰</div>
              <div className="stat-content">
                <h3>{overdueTasks.length}</h3>
                <p>Overdue</p>
              </div>
            </div>
          </div>

          {/* Quick Overview */}
          <div className="overview-grid">
            <div className="overview-card glass">
              <h3>🔴 Overdue Tasks</h3>
              {overdueTasks.length === 0 ? (
                <p className="empty">No overdue tasks! 🎉</p>
              ) : (
                <ul className="task-list">
                  {overdueTasks.slice(0, 5).map((task) => (
                    <li key={task._id}>
                      <span>{task.title}</span>
                      <span className="task-date">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="overview-card glass">
              <h3>📅 Upcoming Deadlines</h3>
              {upcomingDeadlines.length === 0 ? (
                <p className="empty">No upcoming deadlines</p>
              ) : (
                <ul className="task-list">
                  {upcomingDeadlines.slice(0, 5).map((task) => (
                    <li key={task._id}>
                      <span>{task.title}</span>
                      <span className="task-date">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="overview-card glass">
              <h3>📈 Progress</h3>
              <div className="progress-container">
                <div className="progress-stat">
                  <span>Tasks Completed</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          tasks.length > 0
                            ? Math.round(((stats?.completed || 0) / tasks.length) * 100)
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {stats?.completed || 0} / {tasks.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="overview-card glass">
              <h3>⚡ Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-icon">🟡</span>
                  <span>
                    {stats?.inProgress || 0} tasks in progress
                  </span>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">📌</span>
                  <span>
                    {stats?.todo || 0} tasks to start
                  </span>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">✅</span>
                  <span>
                    {stats?.completed || 0} completed this sprint
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TASKS TAB */}
      {activeTab === 'tasks' && (
        <div className="dashboard-section">
          <h2>📋 My Tasks</h2>
          {tasks.length === 0 ? (
            <div className="empty-state glass">
              <p>✨ No tasks assigned yet</p>
            </div>
          ) : (
            <div className="tasks-list">
              {tasks.map((task) => (
                <div key={task._id} className="task-card glass">
                  <div className="task-header">
                    <div className="task-title-section">
                      <h3>{task.title}</h3>
                      <span className={`status-badge status-${task.status}`}>
                        {task.status}
                      </span>
                      <span className={`priority-badge priority-${task.priority}`}>
                        {task.priority}
                      </span>
                    </div>
                    <button
                      className="expand-btn"
                      onClick={() =>
                        setExpandedTask(
                          expandedTask === task._id ? null : task._id
                        )
                      }
                    >
                      {expandedTask === task._id ? '▼' : '▶'}
                    </button>
                  </div>

                  {task.dueDate && (
                    <p className="task-due-date">
                      📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}

                  {expandedTask === task._id && (
                    <div className="task-details">
                      <p className="task-description">{task.description}</p>

                      <div className="task-actions">
                        <label>Update Status:</label>
                        <div className="status-buttons">
                          <button
                            className={`status-btn ${task.status === 'todo' ? 'active' : ''}`}
                            onClick={() =>
                              handleUpdateTaskStatus(task._id, 'todo')
                            }
                          >
                            To Do
                          </button>
                          <button
                            className={`status-btn ${task.status === 'inprogress' ? 'active' : ''}`}
                            onClick={() =>
                              handleUpdateTaskStatus(task._id, 'inprogress')
                            }
                          >
                            In Progress
                          </button>
                          <button
                            className={`status-btn ${task.status === 'done' ? 'active' : ''}`}
                            onClick={() =>
                              handleUpdateTaskStatus(task._id, 'done')
                            }
                          >
                            Done
                          </button>
                        </div>
                      </div>

                      <div className="task-comments">
                        <h4>💬 Comments</h4>
                        {comments[task._id]?.length === 0 ? (
                          <p className="no-comments">No comments yet</p>
                        ) : (
                          <div className="comments-list">
                            {comments[task._id]?.map((comment, idx) => (
                              <div key={idx} className="comment">
                                <span className="comment-author">
                                  {comment.author || 'User'}
                                </span>
                                <p>{comment.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="comment-input">
                          <textarea
                            value={newComments[task._id] || ''}
                            onChange={(e) =>
                              setNewComments({
                                ...newComments,
                                [task._id]: e.target.value,
                              })
                            }
                            placeholder="Add a comment..."
                          />
                          <button
                            onClick={() => handleAddComment(task._id)}
                            className="btn-comment"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PROJECTS TAB */}
      {activeTab === 'projects' && (
        <div className="dashboard-section">
          <h2>📁 My Projects</h2>
          {projects.length === 0 ? (
            <div className="empty-state glass">
              <p>✨ No projects assigned yet</p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => (
                <div key={project._id} className="project-card glass">
                  <h3>{project.name}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-stats">
                    <span>👤 Owner: {project.owner?.name}</span>
                    <span>👥 Members: {project.members?.length || 0}</span>
                  </div>
                  <div className="project-footer">
                    <span className="project-date">
                      Created: {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CALENDAR/DEADLINES TAB */}
      {activeTab === 'deadlines' && (
        <div className="dashboard-section">
          <h2>📅 Deadlines & Calendar</h2>
          <div className="deadlines-container">
            <div className="deadline-section glass">
              <h3>🔴 Overdue ({overdueTasks.length})</h3>
              {overdueTasks.length === 0 ? (
                <p className="empty">All caught up! ✨</p>
              ) : (
                <ul className="deadline-list">
                  {overdueTasks.map((task) => (
                    <li key={task._id} className="deadline-item overdue">
                      <div className="deadline-info">
                        <span className="deadline-title">{task.title}</span>
                        <span className="deadline-date">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`priority-badge priority-${task.priority}`}>
                        {task.priority}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="deadline-section glass">
              <h3>📅 This Week</h3>
              {upcomingDeadlines.filter(
                (t) =>
                  new Date(t.dueDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              ).length === 0 ? (
                <p className="empty">No deadlines this week</p>
              ) : (
                <ul className="deadline-list">
                  {upcomingDeadlines
                    .filter(
                      (t) =>
                        new Date(t.dueDate) <
                        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    )
                    .map((task) => (
                      <li key={task._id} className="deadline-item upcoming">
                        <div className="deadline-info">
                          <span className="deadline-title">{task.title}</span>
                          <span className="deadline-date">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        <span className={`priority-badge priority-${task.priority}`}>
                          {task.priority}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </div>

            <div className="deadline-section glass">
              <h3>📍 Later</h3>
              {upcomingDeadlines.filter(
                (t) =>
                  new Date(t.dueDate) >=
                  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              ).length === 0 ? (
                <p className="empty">No deadlines scheduled</p>
              ) : (
                <ul className="deadline-list">
                  {upcomingDeadlines
                    .filter(
                      (t) =>
                        new Date(t.dueDate) >=
                        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    )
                    .map((task) => (
                      <li key={task._id} className="deadline-item later">
                        <div className="deadline-info">
                          <span className="deadline-title">{task.title}</span>
                          <span className="deadline-date">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        <span className={`priority-badge priority-${task.priority}`}>
                          {task.priority}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
