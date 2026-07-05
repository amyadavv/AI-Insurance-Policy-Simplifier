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
  <div className="bg-dark-100 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
    <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <p className="text-3xl font-bold">{value}</p>
    <p className="text-slate-400 text-sm mt-1">{title}</p>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const { stats, fetchStats, fetchPolicies, policies, loading } = usePolicy();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'bookmarked', 'completed', 'failed'

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const params = {
      limit: 20,
      sortBy: 'createdAt',
      order: 'desc',
    };

    if (search.trim()) {
      params.search = search;
    }

    if (activeFilter === 'bookmarked') {
      params.isBookmarked = true;
    } else if (activeFilter !== 'all') {
      params.status = activeFilter;
    }

    fetchPolicies(params);
  }, [search, activeFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-400 mt-1">
            Here's an overview of your insurance policies
          </p>
        </div>
        <Link
          to="/upload"
          className="mt-4 sm:mt-0 inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-primary-500/25 cursor-pointer font-medium"
        >
          <HiPlus />
          <span>Upload Policy</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          icon={<HiDocumentText className="h-6 w-6 text-primary-400" />}
          title="Total Policies"
          value={stats?.totalPolicies || 0}
          color="bg-primary-500/10"
        />
        <StatsCard
          icon={<HiCheckCircle className="h-6 w-6 text-green-400" />}
          title="Simplified"
          value={stats?.completedPolicies || 0}
          color="bg-green-500/10"
        />
        <StatsCard
          icon={<HiExclamationCircle className="h-6 w-6 text-red-400" />}
          title="Failed"
          value={stats?.failedPolicies || 0}
          color="bg-red-500/10"
        />
        <StatsCard
          icon={<HiBookmark className="h-6 w-6 text-yellow-400" />}
          title="Bookmarked"
          value={stats?.bookmarkedPolicies || 0}
          color="bg-yellow-500/10"
        />
      </div>

      {/* Search & Filter Row */}
      <div className="bg-dark-100 border border-slate-800 rounded-2xl p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search policies by name, type, or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-dark-200 border border-slate-800 rounded-xl focus:border-primary-500 focus:outline-none text-sm transition-colors text-white"
            />
            <div className="absolute left-3 top-3.5 text-slate-500">
              <HiSearch className="h-5 w-5" />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Policies' },
              { id: 'bookmarked', label: 'Bookmarked' },
              { id: 'completed', label: 'Completed' },
              { id: 'failed', label: 'Failed' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-colors border cursor-pointer ${
                  activeFilter === filter.id
                    ? 'bg-primary-600 border-primary-500 text-white'
                    : 'bg-dark-200 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Policies History Table */}
      <div className="bg-dark-100 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6">Policy History</h2>

        {loading ? (
          <div className="text-center py-10 text-slate-400">Loading policies...</div>
        ) : policies.length === 0 ? (
          <div className="text-center py-10">
            <HiDocumentText className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">
              {search.trim() || activeFilter !== 'all' 
                ? 'No matching policies found' 
                : 'No policies uploaded yet'}
            </p>
            {!search.trim() && activeFilter === 'all' && (
              <Link
                to="/upload"
                className="text-primary-400 hover:text-primary-300 text-sm mt-2 inline-block font-medium"
              >
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
                className="flex items-center justify-between p-4 bg-dark-200/50 hover:bg-dark-200 rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-slate-800"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-500/10 p-3 rounded-lg">
                    <HiDocumentText className="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-primary-400 transition-colors">
                      {policy.originalFileName}
                    </p>
                    <p className="text-slate-500 text-sm">
                      {policy.simplifiedSummary?.policyType || 'Processing...'} •{' '}
                      {new Date(policy.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {policy.isBookmarked && (
                    <HiBookmark className="h-5 w-5 text-yellow-400" />
                  )}
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${
                      policy.status === 'completed'
                        ? 'bg-green-500/10 text-green-400'
                        : policy.status === 'failed'
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}
                  >
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
