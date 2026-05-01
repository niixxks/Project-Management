import React, { useEffect, useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import '../styles/Admin.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('projects');
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    projectName: '',
    projectDescription: '',
    taskTitle: '',
    taskDescription: '',
    projectId: '',
    assignedTo: '',
    priority: 'medium',
  });

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'projects') fetchProjects();
  }, [activeTab]);

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
        projectId: formData.projectId,
        assignedTo: formData.assignedTo,
        priority: formData.priority,
      });
      setFormData({
        ...formData,
        taskTitle: '',
        taskDescription: '',
        projectId: '',
        assignedTo: '',
      });
      alert('✅ Task assigned successfully!');
    } catch (error) {
      alert('❌ Error creating task: ' + error.response?.data?.message);
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
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await API.delete(`/users/${userId}`);
        fetchUsers();
        alert('✅ User deleted!');
      } catch (error) {
        alert('❌ Error deleting user: ' + error.response?.data?.message);
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🔐 Admin Dashboard</h1>
        <p>Welcome, {user?.name}</p>
      </div>

      <div className="admin-tabs">
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
          📋 Assign Tasks
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Manage Users
        </button>
      </div>

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="admin-section">
          <h2>Create Project</h2>
          <form onSubmit={handleCreateProject} className="admin-form">
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

          <div className="projects-list">
            <h3>All Projects</h3>
            {loading ? (
              <p>Loading...</p>
            ) : projects.length === 0 ? (
              <p>No projects yet</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Owner</th>
                    <th>Members</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project._id}>
                      <td>{project.name}</td>
                      <td>{project.owner?.name || 'N/A'}</td>
                      <td>{project.members?.length || 0}</td>
                      <td>
                        {new Date(project.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="admin-section">
          <h2>Assign Task to User</h2>
          <form onSubmit={handleCreateTask} className="admin-form">
            <div className="form-group">
              <label>Select Project</label>
              <select
                value={formData.projectId}
                onChange={(e) =>
                  setFormData({ ...formData, projectId: e.target.value })
                }
                required
              >
                <option value="">-- Choose Project --</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
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
              <label>Task Description</label>
              <textarea
                value={formData.taskDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    taskDescription: e.target.value,
                  })
                }
                placeholder="Enter task description"
              />
            </div>

            <div className="form-group">
              <label>Assign To User</label>
              <select
                value={formData.assignedTo}
                onChange={(e) =>
                  setFormData({ ...formData, assignedTo: e.target.value })
                }
                required
              >
                <option value="">-- Choose User --</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>

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

            <button type="submit" className="btn-submit">
              ✅ Assign Task
            </button>
          </form>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="admin-section">
          <h2>Manage Users</h2>
          {loading ? (
            <p>Loading...</p>
          ) : users.length === 0 ? (
            <p>No users found</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
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
                        onChange={(e) =>
                          handleChangeRole(u._id, e.target.value)
                        }
                        className="role-select"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="btn-delete"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
