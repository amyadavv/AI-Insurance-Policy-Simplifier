// frontend/src/pages/DashboardPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiDocumentText,
  HiCheckCircle,
  HiExclamationCircle,
  HiBookmark,
  HiPlus,
  HiSearch,
} from 'react-icons/hi';
import usePolicy from '../hooks/usePolicy';
import useAuth from '../hooks/useAuth';

const StatsCard = ({ icon, title, value, color }) => (
  <div
    className="rounded-2xl p-6 border transition-all"
    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
  >
    <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <p className="text-3xl font-bold text-primary-theme">{value}</p>
    <p className="text-sm mt-1 text-muted-theme">{title}</p>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const { stats, fetchStats, fetchPolicies, policies, loading } = usePolicy();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => { fetchStats(); }, []);

  useEffect(() => {
    const params = { limit: 20, sortBy: 'createdAt', order: 'desc' };
    if (search.trim()) params.search = search;
    if (activeFilter === 'bookmarked') params.isBookmarked = true;
    else if (activeFilter !== 'all') params.status = activeFilter;
    fetchPolicies(params);
  }, [search, activeFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-theme">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-muted-theme">Here's an overview of your insurance policies</p>
        </div>
        <Link
          to="/upload"
          className="smooth-btn mt-4 sm:mt-0 inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 cursor-pointer font-medium"
        >
          <HiPlus />
          <span>Upload Policy</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={<HiDocumentText className="h-6 w-6 text-primary-400" />} title="Total Policies" value={stats?.totalPolicies || 0} color="bg-primary-500/10" />
        <StatsCard icon={<HiCheckCircle className="h-6 w-6 text-green-400" />} title="Simplified" value={stats?.completedPolicies || 0} color="bg-green-500/10" />
        <StatsCard icon={<HiExclamationCircle className="h-6 w-6 text-red-400" />} title="Failed" value={stats?.failedPolicies || 0} color="bg-red-500/10" />
        <StatsCard icon={<HiBookmark className="h-6 w-6 text-yellow-400" />} title="Bookmarked" value={stats?.bookmarkedPolicies || 0} color="bg-yellow-500/10" />
      </div>

      {/* Search & Filter */}
      <div className="rounded-2xl p-4 mb-6 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search policies by name, type, or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:border-primary-500 focus:outline-none text-sm transition-colors text-primary-theme"
              style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-input)' }}
            />
            <div className="absolute left-3 top-3.5 text-subtle-theme">
              <HiSearch className="h-5 w-5" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Policies' },
              { id: 'bookmarked', label: 'Bookmarked' },
              { id: 'completed', label: 'Completed' },
              { id: 'failed', label: 'Failed' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-colors border cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-primary-600 border-primary-500 text-white'
                    : 'text-muted-theme hover:text-primary-400'
                }`}
                style={activeFilter !== f.id ? { backgroundColor: 'var(--bg-card-2)', borderColor: 'var(--border)' } : {}}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Policy List */}
      <div className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <h2 className="text-xl font-bold mb-6 text-primary-theme">Policy History</h2>

        {loading ? (
          <div className="text-center py-10 text-muted-theme">Loading policies...</div>
        ) : policies.length === 0 ? (
          <div className="text-center py-10">
            <HiDocumentText className="h-12 w-12 mx-auto mb-3 text-subtle-theme" />
            <p className="text-muted-theme">
              {search.trim() || activeFilter !== 'all' ? 'No matching policies found' : 'No policies uploaded yet'}
            </p>
            {!search.trim() && activeFilter === 'all' && (
              <Link to="/upload" className="text-primary-400 hover:text-primary-300 text-sm mt-2 inline-block font-medium">
                Upload your first policy →
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {policies.map((policy) => (
              <Link
                key={policy._id}
                to={`/policy/${policy._id}`}
                className="smooth-row flex items-center justify-between p-4 rounded-xl cursor-pointer border border-transparent"
                style={{ backgroundColor: 'var(--bg-hover)' }}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-500/10 p-3 rounded-lg">
                    <HiDocumentText className="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-primary-400 transition-colors text-primary-theme">
                      {policy.originalFileName}
                    </p>
                    <p className="text-sm text-muted-theme">
                      {policy.simplifiedSummary?.policyType || 'Processing...'} •{' '}
                      {new Date(policy.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {policy.isBookmarked && <HiBookmark className="h-5 w-5 text-yellow-400" />}
                  <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${
                    policy.status === 'completed' ? 'bg-green-500/10 text-green-400'
                    : policy.status === 'failed' ? 'bg-red-500/10 text-red-400'
                    : 'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {policy.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
