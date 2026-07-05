// frontend/src/pages/HRDashboardPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiUserAdd, HiTrash, HiShieldCheck, HiDocumentText, HiOutlineQuestionMarkCircle, HiUsers, HiCloudUpload } from 'react-icons/hi';
import axiosInstance from '../api/axiosInstance';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const HRDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'hr-admin') {
      if (user.role === 'employee') {
        navigate('/employee/portal');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  // States
  const [stats, setStats] = useState({
    employeeCount: 0,
    policyCount: 0,
    questionCount: 0,
    recentQuestions: [],
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Invite Form States
  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [inviting, setInviting] = useState(false);

  // Policy Upload States
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchHRDashboardData = async () => {
    try {
      const statsRes = await axiosInstance.get('/hr/stats');
      const empRes = await axiosInstance.get('/hr/employees');
      
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (empRes.data.success) setEmployees(empRes.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHRDashboardData();
  }, []);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setInviting(true);
    try {
      const { data } = await axiosInstance.post('/hr/employees', {
        name: empName,
        email: empEmail,
        password: empPassword,
      });

      if (data.success) {
        toast.success('Employee registered successfully!');
        setEmpName('');
        setEmpEmail('');
        setEmpPassword('');
        fetchHRDashboardData(); // Refresh list and counts
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add employee');
    } finally {
      setInviting(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to remove this employee account?')) return;

    try {
      const { data } = await axiosInstance.delete(`/hr/employees/${id}`);
      if (data.success) {
        toast.success('Employee account deleted');
        fetchHRDashboardData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete employee');
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    setUploadProgress(20);

    try {
      const formData = new FormData();
      formData.append('document', uploadFile);

      setUploadProgress(50);
      const { data } = await axiosInstance.post('/policy/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        setUploadProgress(100);
        toast.success('Group benefits policy uploaded! AI extraction in progress.');
        setUploadFile(null);
        // Clear input element
        const fileInput = document.getElementById('hr-policy-file');
        if (fileInput) fileInput.value = '';
        fetchHRDashboardData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (!user || user.role !== 'hr-admin') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-10 w-10 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-muted-theme">
        <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p>Loading HR Admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-theme flex items-center space-x-2">
          <HiShieldCheck className="text-primary-500 h-8 w-8" />
          <span>HR Benefits Portal Admin Dashboard</span>
        </h1>
        <p className="mt-1 text-muted-theme">
          Manage employee list, upload group benefit policies, and audit benefits QA logs for <span className="font-bold text-primary-400">{user?.organizationName}</span>.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Active Group Policies', value: stats.policyCount, icon: HiDocumentText, color: 'text-blue-400 bg-blue-500/10' },
          { label: 'Registered Employees', value: stats.employeeCount, icon: HiUsers, color: 'text-emerald-400 bg-emerald-500/10' },
          { label: 'AI Benefits Inquiries', value: stats.questionCount, icon: HiOutlineQuestionMarkCircle, color: 'text-purple-400 bg-purple-500/10' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl p-6 border shadow-sm flex items-center justify-between"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div>
                <p className="text-xs font-semibold text-muted-theme uppercase tracking-wider">{item.label}</p>
                <h3 className="text-3xl font-extrabold text-primary-theme mt-2">{item.value}</h3>
              </div>
              <div className={`p-4 rounded-xl ${item.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Grid: Upload Policy & Add Employee */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Upload Corporate Benefits policy */}
        <div
          className="rounded-2xl p-6 border shadow-sm space-y-6"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h2 className="text-lg font-bold text-primary-theme flex items-center space-x-2">
            <HiCloudUpload className="text-blue-500" />
            <span>Upload Group Benefits Policy</span>
          </h2>
          <p className="text-xs text-subtle-theme">
            Upload policies (PDFs, images) such as Health Insurance plans, Vision, Dental, Life plans, or HR Manuals. Employees can query them instantly.
          </p>

          <form onSubmit={handleFileUpload} className="space-y-4">
            <div
              className="border border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-primary-500/50 transition-all"
              style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-input)' }}
              onClick={() => document.getElementById('hr-policy-file').click()}
            >
              <HiDocumentText className="h-10 w-10 text-subtle-theme mx-auto mb-2" />
              <span className="text-sm font-semibold text-primary-theme">
                {uploadFile ? uploadFile.name : 'Select group policy document'}
              </span>
              <p className="text-xs text-muted-theme mt-1">PDF or image files up to 20MB</p>
              <input
                id="hr-policy-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </div>

            {uploading && (
              <div className="w-full rounded-full h-1.5" style={{ backgroundColor: 'var(--bg-card-2)' }}>
                <div
                  className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={!uploadFile || uploading}
              className="smooth-btn w-full bg-primary-600 hover:bg-primary-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-xs font-bold py-3 rounded-xl cursor-pointer"
            >
              {uploading ? 'Uploading plan...' : 'Upload Corporate Benefits Policy'}
            </button>
          </form>
        </div>

        {/* Add Employee Form */}
        <div
          className="rounded-2xl p-6 border shadow-sm space-y-6"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h2 className="text-lg font-bold text-primary-theme flex items-center space-x-2">
            <HiUserAdd className="text-emerald-500" />
            <span>Register Employee Account</span>
          </h2>
          <p className="text-xs text-subtle-theme">
            Create user credentials for employees. They can log in to ask questions about uploaded corporate plans.
          </p>

          <form onSubmit={handleAddEmployee} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-muted-theme">Employee Name</label>
                <input
                  type="text"
                  required
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2.5 text-xs focus:outline-none text-primary-theme"
                  style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-input)' }}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-muted-theme">Email Address</label>
                <input
                  type="email"
                  required
                  value={empEmail}
                  onChange={(e) => setEmpEmail(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2.5 text-xs focus:outline-none text-primary-theme"
                  style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-input)' }}
                  placeholder="john@company.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-muted-theme">Password</label>
              <input
                type="password"
                required
                value={empPassword}
                onChange={(e) => setEmpPassword(e.target.value)}
                className="w-full border rounded-xl px-3 py-2.5 text-xs focus:outline-none text-primary-theme"
                style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-input)' }}
                placeholder="Choose temporary password"
              />
            </div>

            <button
              type="submit"
              disabled={inviting}
              className="smooth-btn w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-xs font-bold py-3 rounded-xl cursor-pointer"
            >
              {inviting ? 'Inviting...' : 'Add Employee'}
            </button>
          </form>
        </div>
      </div>

      {/* Audit Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Employees List */}
        <div
          className="rounded-2xl p-6 border shadow-sm space-y-4 lg:col-span-1"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h2 className="text-lg font-bold text-primary-theme">Organization Staff roster</h2>
          <div className="space-y-3 overflow-y-auto max-h-[400px] pr-1">
            {employees.length === 0 ? (
              <p className="text-xs text-subtle-theme text-center py-6">No employee accounts created yet.</p>
            ) : (
              employees.map((emp) => (
                <div
                  key={emp._id}
                  className="p-3.5 rounded-xl border flex justify-between items-center bg-dark-100/5 hover:bg-dark-100/10 transition-colors"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="truncate pr-2">
                    <p className="text-xs font-bold text-primary-theme truncate">{emp.name}</p>
                    <p className="text-[10px] text-muted-theme truncate">{emp.email}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteEmployee(emp._id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 cursor-pointer"
                    title="Remove Employee"
                  >
                    <HiTrash className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Benefits Questions Audit Log */}
        <div
          className="rounded-2xl p-6 border shadow-sm space-y-4 lg:col-span-2"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h2 className="text-lg font-bold text-primary-theme">Employee Benefits Query Log</h2>
          <div className="space-y-4 overflow-y-auto max-h-[400px] pr-1">
            {stats.recentQuestions.length === 0 ? (
              <p className="text-xs text-subtle-theme text-center py-10">No benefit questions logged yet.</p>
            ) : (
              stats.recentQuestions.map((log) => (
                <div
                  key={log._id}
                  className="p-4 rounded-xl border space-y-2 text-xs"
                  style={{ backgroundColor: 'var(--bg-card-2)', borderColor: 'var(--border)' }}
                >
                  <div className="flex justify-between items-center text-[10px] text-muted-theme">
                    <span>
                      Staff: <span className="font-semibold text-primary-theme">{log.user?.name}</span> ({log.user?.email})
                    </span>
                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="font-semibold text-primary-theme">Question: "{log.question}"</p>
                  <p className="text-muted-theme leading-relaxed">
                    <span className="font-bold text-emerald-400">AI Answer:</span> {log.answer}
                  </p>
                  <div className="text-[9px] text-subtle-theme truncate">
                    Referenced Policy: {log.policy?.originalFileName}
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

export default HRDashboardPage;
export { HRDashboardPage };
