import React, { useEffect, useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import '../styles/Admin.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [formData, setFormData] = useState({
    projectName: '',
    projectDescription: '',
    taskTitle: '',
    taskDescription: '',
    projectId: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: '',
  });

  useEffect(() => {
    fetchOverviewData();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'projects') fetchProjects();
    if (activeTab === 'tasks') fetchAllTasks();
    if (activeTab === 'reports') fetchReports();
  }, [activeTab]);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      const [usersRes, projectsRes, tasksRes, statsRes] = await Promise.all([
        API.get('/users'),
        API.get('/projects'),
        API.get('/tasks'),
        API.get('/tasks/dashboard/stats'),
      ]);
      setUsers(usersRes.data);
      setProjects(projectsRes.data);
      setTasks(tasksRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await API.get('/projects');
      setProjects(res.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await API.get('/tasks/dashboard/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await API.post('/projects', {
        name: formData.projectName,
        description: formData.projectDescription,
      });
      setFormData({ ...formData, projectName: '', projectDescription: '' });
      fetchProjects();
      alert('✅ Project created successfully!');
    } catch (error) {
      alert('❌ Error creating project: ' + error.response?.data?.message);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tasks', {
        title: formData.taskTitle,
        description: formData.taskDescription,
        project: formData.projectId,
        assignedTo: formData.assignedTo,
        priority: formData.priority,
        dueDate: formData.dueDate,
      });
      setFormData({
        ...formData,
        taskTitle: '',
        taskDescription: '',
        projectId: '',
        assignedTo: '',
        dueDate: '',
      });
      alert('✅ Task created!');
    } catch (error) {
      alert('❌ Error: ' + error.response?.data?.message);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await API.put(`/users/${userId}`, { role: newRole });
      fetchUsers();
      alert('✅ User role updated!');
    } catch (error) {
      alert('❌ Error updating role: ' + error.response?.data?.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await API.delete(`/users/${userId}`);
        fetchUsers();
        alert('✅ User deleted!');
      } catch (error) {
        alert('❌ Error: ' + error.response?.data?.message);
      }
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await API.delete(`/projects/${projectId}`);
        fetchProjects();
        alert('✅ Project deleted!');
      } catch (error) {
        alert('❌ Error: ' + error.response?.data?.message);
      }
    }
  };

  const handleReassignTask = async (taskId, newUserId) => {
    try {
      await API.put(`/tasks/${taskId}`, { assignedTo: newUserId });
      fetchAllTasks();
      alert('✅ Task reassigned!');
    } catch (error) {
      alert('❌ Error: ' + error.response?.data?.message);
    }
  };

  const handleUpdateTaskPriority = async (taskId, newPriority) => {
    try {
      await API.put(`/tasks/${taskId}`, { priority: newPriority });
      fetchAllTasks();
      alert('✅ Priority updated!');
    } catch (error) {
      alert('❌ Error: ' + error.response?.data?.message);
    }
  };

  const overdueTasks = tasks.filter(
    (task) =>
      task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'
  );

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🔐 System Control Center</h1>
        <p>Admin Panel - {user?.name}</p>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          📁 Projects
        </button>
        <button
          className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          📋 Tasks
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button
          className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          📈 Reports
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="admin-section">
          <h2>System Overview</h2>
          <div className="stats-grid">
            <div className="stat-card glass">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>{users.length}</h3>
                <p>Total Users</p>
              </div>
            </div>
            <div className="stat-card glass">
              <div className="stat-icon">📁</div>
              <div className="stat-content">
                <h3>{projects.length}</h3>
                <p>Projects</p>
              </div>
            </div>
            <div className="stat-card glass">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <h3>{tasks.length}</h3>
                <p>Total Tasks</p>
              </div>
            </div>
            <div className="stat-card glass warning">
              <div className="stat-icon">⏰</div>
              <div className="stat-content">
                <h3>{overdueTasks.length}</h3>
                <p>Overdue Tasks</p>
              </div>
            </div>
            <div className="stat-card glass success">
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
          </div>

          <div className="overview-grid">
            <div className="overview-card glass">
              <h3>🔴 Overdue Tasks</h3>
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
            </div>

            <div className="overview-card glass">
              <h3>👥 Recent Users</h3>
              <ul className="user-list">
                {users.slice(0, 5).map((u) => (
                  <li key={u._id}>
                    <span>{u.name}</span>
                    <span className={`role-badge role-${u.role}`}>{u.role}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* PROJECTS TAB */}
      {activeTab === 'projects' && (
        <div className="admin-section">
          <h2>📁 Project Management</h2>
          <form onSubmit={handleCreateProject} className="admin-form glass">
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) =>
                  setFormData({ ...formData, projectName: e.target.value })
                }
                required
                placeholder="Enter project name"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.projectDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    projectDescription: e.target.value,
                  })
                }
                placeholder="Enter project description"
              />
            </div>
            <button type="submit" className="btn-submit">
              ➕ Create Project
            </button>
          </form>

          <div className="projects-section">
            <h3>All Projects</h3>
            {loading ? (
              <p className="loading">Loading...</p>
            ) : projects.length === 0 ? (
              <p className="empty">No projects yet</p>
            ) : (
              <div className="projects-grid">
                {projects.map((project) => (
                  <div key={project._id} className="project-card glass">
                    <div className="project-header">
                      <h4>{project.name}</h4>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteProject(project._id)}
                        title="Delete project"
                      >
                        🗑️
                      </button>
                    </div>
                    <p className="project-description">{project.description}</p>
                    <div className="project-meta">
                      <span>👤 Owner: {project.owner?.name}</span>
                      <span>👥 Members: {project.members?.length || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TASKS TAB */}
      {activeTab === 'tasks' && (
        <div className="admin-section">
          <h2>📋 Task Oversight & Management</h2>
          <form onSubmit={handleCreateTask} className="admin-form glass">
            <div className="form-row">
              <div className="form-group">
                <label>Project</label>
                <select
                  value={formData.projectId}
                  onChange={(e) =>
                    setFormData({ ...formData, projectId: e.target.value })
                  }
                  required
                >
                  <option value="">-- Select Project --</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Assign To</label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) =>
                    setFormData({ ...formData, assignedTo: e.target.value })
                  }
                  required
                >
                  <option value="">-- Select User --</option>
                  {users
                    .filter((u) => u.role === 'member')
                    .map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Task Title</label>
              <input
                type="text"
                value={formData.taskTitle}
                onChange={(e) =>
                  setFormData({ ...formData, taskTitle: e.target.value })
                }
                required
                placeholder="Enter task title"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.taskDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    taskDescription: e.target.value,
                  })
                }
                placeholder="Task details"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                />
              </div>
            </div>
            <button type="submit" className="btn-submit">
              ➕ Create Task
            </button>
          </form>

          <div className="tasks-section">
            <h3>All Tasks</h3>
            {loading ? (
              <p className="loading">Loading...</p>
            ) : tasks.length === 0 ? (
              <p className="empty">No tasks</p>
            ) : (
              <div className="tasks-table-wrapper glass">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Assigned To</th>
                      <th>Project</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Due Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task._id}>
                        <td>{task.title}</td>
                        <td>{task.assignedTo?.name || 'Unassigned'}</td>
                        <td>{task.project?.name}</td>
                        <td>
                          <select
                            value={task.priority}
                            onChange={(e) =>
                              handleUpdateTaskPriority(task._id, e.target.value)
                            }
                            className="priority-select"
                          >
                            <option value="low">🟢 Low</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="high">🔴 High</option>
                          </select>
                        </td>
                        <td>
                          <span className={`status-badge status-${task.status}`}>
                            {task.status}
                          </span>
                        </td>
                        <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                        <td>
                          <select
                            onChange={(e) =>
                              handleReassignTask(task._id, e.target.value)
                            }
                            defaultValue=""
                            className="reassign-select"
                          >
                            <option value="">Reassign...</option>
                            {users
                              .filter((u) => u.role === 'member')
                              .map((u) => (
                                <option key={u._id} value={u._id}>
                                  {u.name}
                                </option>
                              ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="admin-section">
          <h2>👥 User Management</h2>
          {loading ? (
            <p className="loading">Loading...</p>
          ) : (
            <div className="users-table-wrapper glass">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Tasks</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u._id, e.target.value)}
                          className="role-select"
                        >
                          <option value="member">👤 Member</option>
                          <option value="admin">🔐 Admin</option>
                        </select>
                      </td>
                      <td>{tasks.filter((t) => t.assignedTo?._id === u._id).length}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteUser(u._id)}
                          title="Delete user"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* REPORTS TAB */}
      {activeTab === 'reports' && (
        <div className="admin-section">
          <h2>📈 Reports & Analytics</h2>
          <div className="reports-grid">
            <div className="report-card glass">
              <h3>Project Completion Rate</h3>
              <div className="metric">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${
                        tasks.length > 0
                          ? Math.round(
                              ((stats?.completed || 0) / tasks.length) * 100
                            )
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <p>
                  {stats?.completed || 0} of {tasks.length} tasks completed
                </p>
              </div>
            </div>

            <div className="report-card glass">
              <h3>User Performance</h3>
              <div className="user-performance">
                {users
                  .filter((u) => u.role === 'member')
                  .slice(0, 5)
                  .map((u) => {
                    const userTasks = tasks.filter(
                      (t) => t.assignedTo?._id === u._id
                    );
                    const completed = userTasks.filter(
                      (t) => t.status === 'done'
                    ).length;
                    const rate =
                      userTasks.length > 0
                        ? Math.round((completed / userTasks.length) * 100)
                        : 0;
                    return (
                      <div key={u._id} className="user-perf-item">
                        <span>{u.name}</span>
                        <span className="perf-rate">{rate}%</span>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="report-card glass">
              <h3>Task Status Distribution</h3>
              <div className="status-dist">
                <div className="dist-item">
                  <span>📌 To Do</span>
                  <span className="count">{stats?.todo || 0}</span>
                </div>
                <div className="dist-item">
                  <span>⚡ In Progress</span>
                  <span className="count">{stats?.inProgress || 0}</span>
                </div>
                <div className="dist-item">
                  <span>✅ Done</span>
                  <span className="count">{stats?.completed || 0}</span>
                </div>
              </div>
            </div>

            <div className="report-card glass">
              <h3>Priority Distribution</h3>
              <div className="priority-dist">
                <div className="dist-item">
                  <span>🟢 Low</span>
                  <span className="count">
                    {tasks.filter((t) => t.priority === 'low').length}
                  </span>
                </div>
                <div className="dist-item">
                  <span>🟡 Medium</span>
                  <span className="count">
                    {tasks.filter((t) => t.priority === 'medium').length}
                  </span>
                </div>
                <div className="dist-item">
                  <span>🔴 High</span>
                  <span className="count">
                    {tasks.filter((t) => t.priority === 'high').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="admin-section">
          <h2>⚙️ System Settings</h2>
          <div className="settings-grid">
            <div className="settings-card glass">
              <h3>📝 Task Settings</h3>
              <div className="setting-item">
                <label>Default Priority</label>
                <select>
                  <option>Low</option>
                  <option selected>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div className="setting-item">
                <label>Task Status Workflow</label>
                <div className="status-list">
                  <span className="status-tag">To Do</span>
                  <span className="status-tag">In Progress</span>
                  <span className="status-tag">Done</span>
                </div>
              </div>
            </div>

            <div className="settings-card glass">
              <h3>🔔 Notification Settings</h3>
              <div className="setting-item">
                <input type="checkbox" id="deadline-notify" defaultChecked />
                <label htmlFor="deadline-notify">Deadline Reminders</label>
              </div>
              <div className="setting-item">
                <input type="checkbox" id="task-notify" defaultChecked />
                <label htmlFor="task-notify">Task Assignment Notifications</label>
              </div>
              <div className="setting-item">
                <input type="checkbox" id="comment-notify" defaultChecked />
                <label htmlFor="comment-notify">Comment Notifications</label>
              </div>
            </div>

            <div className="settings-card glass">
              <h3>👥 User Permissions</h3>
              <div className="permission-item">
                <span>Member Can Create Projects</span>
                <input type="checkbox" />
              </div>
              <div className="permission-item">
                <span>Member Can Delete Tasks</span>
                <input type="checkbox" />
              </div>
              <div className="permission-item">
                <span>Member Can View All Projects</span>
                <input type="checkbox" defaultChecked />
              </div>
            </div>

            <div className="settings-card glass">
              <h3>💾 Data Management</h3>
              <button className="btn-setting">📥 Export Reports</button>
              <button className="btn-setting">🔄 Clear Cache</button>
              <button className="btn-setting" style={{ color: '#ff6b6b' }}>
                ⚠️ Danger Zone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
