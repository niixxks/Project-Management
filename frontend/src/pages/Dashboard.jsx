import React, { useEffect, useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, tasksRes] = await Promise.all([
        API.get('/tasks/dashboard/stats'),
        API.get('/tasks/my/tasks'),
      ]);
      setStats(statsRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container"><div className="spinner"></div></div>;
  }

  return (
    <div className="container dashboard-container">
      <h1>Welcome, {user?.name}! 👋</h1>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📁</div>
          <div className="stat-content">
            <h3>{stats?.totalProjects || 0}</h3>
            <p>Projects</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats?.totalTasks || 0}</h3>
            <p>Total Tasks</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats?.completed || 0}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h3>{stats?.inProgress || 0}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📌</div>
          <div className="stat-content">
            <h3>{stats?.todo || 0}</h3>
            <p>To Do</p>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>{stats?.overdue || 0}</h3>
            <p>Overdue</p>
          </div>
        </div>
      </div>

      {/* My Tasks */}
      <div className="card">
        <h2>My Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks assigned to you yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.slice(0, 5).map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.project?.name}</td>
                  <td>
                    <span className={`status-badge status-${task.status}`}>
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <span className={`priority-${task.priority}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
