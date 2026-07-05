// frontend/src/pages/ComparisonDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiTrash, HiExclamation, HiStar, HiChevronRight, HiDownload } from 'react-icons/hi';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const ComparisonDetailPage = () => {
  const { id } = useParams();
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchComparisonDetails = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/comparison/${id}`);
      if (data.success) {
        setComparison(data.data);
      }
    } catch (err) {
      toast.error('Failed to fetch comparison details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparisonDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comparison?')) return;
    try {
      const { data } = await axiosInstance.delete(`/comparison/${id}`);
      if (data.success) {
        toast.success('Comparison deleted successfully');
        navigate('/compare');
      }
    } catch (err) {
      toast.error('Failed to delete comparison');
    }
  };

  const handleDownload = () => {
    if (!comparison) return;
    const gridText = comparison.comparisonData.comparisonGrid
      .map((row) => `Feature: ${row.feature}\n- Policy A: ${row.policyAValue}\n- Policy B: ${row.policyBValue}\n- Notes: ${row.comparison}\n- Winner: ${row.winner}\n`)
      .join('\n');

    const fullContent = `SIDE-BY-SIDE POLICY COMPARISON\n\nPolicy A: ${comparison.comparisonData.policyA.name}\nPolicy B: ${comparison.comparisonData.policyB.name}\n\n=========================\nCOMPARISON GRID\n=========================\n\n${gridText}\n\n=========================\nWINNER RECOMMENDATION\n=========================\n\n${comparison.comparisonData.winnerRecommendation}`;

    const element = document.createElement('a');
    const file = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Policy_Comparison_${comparison.policyAFileName.replace(/\.[^/.]+$/, "")}_vs_${comparison.policyBFileName.replace(/\.[^/.]+$/, "")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Comparison report downloaded!');
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-muted-theme">
        <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p>Loading comparison details...</p>
      </div>
    );
  }

  if (!comparison || !comparison.comparisonData) {
    return (
      <div className="text-center py-20">
        <HiExclamation className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-primary-theme font-medium">Comparison details not found</p>
        <Link to="/compare" className="text-primary-400 hover:text-primary-300 mt-4 inline-block">
          Go back to Policy Comparison
        </Link>
      </div>
    );
  }

  const { policyA, policyB, comparisonGrid, winnerRecommendation } = comparison.comparisonData;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back button & Action Toolbar */}
      <div className="flex justify-between items-center mb-8">
        <Link
          to="/compare"
          className="inline-flex items-center space-x-2 text-muted-theme hover:text-primary-theme transition-colors font-medium"
        >
          <HiArrowLeft className="h-5 w-5" />
          <span>Back to Policy Comparison</span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownload}
            className="smooth-btn inline-flex items-center space-x-1.5 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
          >
            <HiDownload className="h-4 w-4" />
            <span>Download Report</span>
          </button>
          <button
            onClick={handleDelete}
            className="text-subtle-theme hover:text-red-500 p-2 border rounded-xl hover:bg-red-500/5 transition-colors cursor-pointer"
            style={{ borderColor: 'var(--border)' }}
          >
            <HiTrash className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Comparison Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-center md:text-left">
        <div
          className="rounded-2xl p-6 border shadow-sm flex flex-col justify-between"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-primary-400">Policy A (Left)</span>
            <h2 className="text-2xl font-bold mt-1 text-primary-theme">{policyA.name || comparison.policyAFileName}</h2>
            <p className="text-sm text-muted-theme mt-1">{policyA.type || 'Insurance Policy'}</p>
          </div>
          <p className="text-xs text-subtle-theme mt-4 truncate">File: {comparison.policyAFileName}</p>
        </div>

        <div
          className="rounded-2xl p-6 border shadow-sm flex flex-col justify-between"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-accent-400">Policy B (Right)</span>
            <h2 className="text-2xl font-bold mt-1 text-primary-theme">{policyB.name || comparison.policyBFileName}</h2>
            <p className="text-sm text-muted-theme mt-1">{policyB.type || 'Insurance Policy'}</p>
          </div>
          <p className="text-xs text-subtle-theme mt-4 truncate">File: {comparison.policyBFileName}</p>
        </div>
      </div>

      {/* Grid Comparison Table */}
      <div
        className="rounded-2xl border shadow-sm overflow-hidden mb-8"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wider text-muted-theme" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card-2)' }}>
                <th className="py-4 px-6 font-semibold">Comparison Metric</th>
                <th className="py-4 px-6 font-semibold">{policyA.name}</th>
                <th className="py-4 px-6 font-semibold">{policyB.name}</th>
                <th className="py-4 px-6 font-semibold hidden md:table-cell">Analysis Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm" style={{ divideColor: 'var(--border)' }}>
              {comparisonGrid && comparisonGrid.map((row, index) => (
                <tr key={index} className="hover:bg-dark-100/10 transition-colors" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-4 px-6 font-semibold text-primary-theme">{row.feature}</td>
                  
                  {/* Policy A value */}
                  <td className={`py-4 px-6 ${row.winner === 'policyA' ? 'bg-primary-500/5 font-semibold text-primary-400' : 'text-muted-theme'}`}>
                    <div className="flex items-center space-x-1.5">
                      {row.winner === 'policyA' && <HiStar className="text-yellow-400 h-4 w-4 flex-shrink-0" />}
                      <span>{row.policyAValue}</span>
                    </div>
                  </td>

                  {/* Policy B value */}
                  <td className={`py-4 px-6 ${row.winner === 'policyB' ? 'bg-accent-500/5 font-semibold text-accent-400' : 'text-muted-theme'}`}>
                    <div className="flex items-center space-x-1.5">
                      {row.winner === 'policyB' && <HiStar className="text-yellow-400 h-4 w-4 flex-shrink-0" />}
                      <span>{row.policyBValue}</span>
                    </div>
                  </td>

                  {/* Comparison Notes */}
                  <td className="py-4 px-6 text-xs text-subtle-theme hidden md:table-cell max-w-xs">
                    {row.comparison}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Winner Recommendation Details */}
      <div
        className="rounded-2xl p-6 border shadow-sm mb-8 animate-fade-in"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <h2 className="text-xl font-bold mb-4 text-primary-theme flex items-center space-x-2">
          <HiStar className="text-yellow-400 h-6 w-6" />
          <span>AI Winner Recommendation</span>
        </h2>
        <div className="text-sm leading-relaxed text-muted-theme whitespace-pre-wrap space-y-4">
          {winnerRecommendation}
        </div>
      </div>
    </div>
  );
};

export default ComparisonDetailPage;
