// frontend/src/pages/PolicyComparisonPage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiPlus, HiDocumentText, HiTrash, HiShieldCheck, HiArrowRight, HiCloudUpload, HiX } from 'react-icons/hi';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const PolicyComparisonPage = () => {
  const [comparisons, setComparisons] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [policyAId, setPolicyAId] = useState('');
  const [policyBId, setPolicyBId] = useState('');
  const [policyAFile, setPolicyAFile] = useState(null);
  const [policyBFile, setPolicyBFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();

  const fetchComparisons = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/comparison');
      if (data.success) {
        setComparisons(data.data);
      }
    } catch (err) {
      toast.error('Failed to fetch comparisons');
    } finally {
      setLoading(false);
    }
  };

  const fetchPolicies = async () => {
    try {
      const { data } = await axiosInstance.get('/policy', { params: { status: 'completed' } });
      if (data.success) {
        setPolicies(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch policies');
    }
  };

  useEffect(() => {
    fetchComparisons();
    fetchPolicies();
  }, []);

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!policyAId && !policyAFile) {
      toast.error('Please select or upload Policy A');
      return;
    }
    if (!policyBId && !policyBFile) {
      toast.error('Please select or upload Policy B');
      return;
    }

    setProcessing(true);
    setProcessingStep('uploading');
    setProgress(20);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return 90;
        return p + 10;
      });
    }, 2000);

    try {
      const formData = new FormData();
      if (policyAId) {
        formData.append('policyAId', policyAId);
      } else if (policyAFile) {
        formData.append('policyA', policyAFile);
      }

      if (policyBId) {
        formData.append('policyBId', policyBId);
      } else if (policyBFile) {
        formData.append('policyB', policyBFile);
      }

      setProcessingStep('extracting');
      const { data } = await axiosInstance.post('/comparison/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 240000, // 4 minutes
      });

      clearInterval(interval);
      setProgress(100);

      if (data.success) {
        toast.success('Policies compared successfully!');
        navigate(`/compare/${data.data._id}`);
      }
    } catch (err) {
      clearInterval(interval);
      toast.error(err.response?.data?.message || 'Comparison failed');
    } finally {
      setProcessing(false);
      setProcessingStep('');
      setProgress(0);
    }
  };

  const handleDeleteComparison = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this comparison?')) return;

    try {
      const { data } = await axiosInstance.delete(`/comparison/${id}`);
      if (data.success) {
        setComparisons((prev) => prev.filter((c) => c._id !== id));
        toast.success('Comparison deleted');
      }
    } catch (err) {
      toast.error('Failed to delete comparison');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-theme flex items-center space-x-2">
          <HiShieldCheck className="text-primary-500 h-8 w-8" />
          <span>Compare Policies Side-by-Side</span>
        </h1>
        <p className="mt-1 text-muted-theme">
          Upload two insurance quotes or policies (or choose from existing ones). The AI will compare premiums, coverages, limits, and name a recommended winner.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <div
            className="rounded-2xl p-6 border shadow-sm"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <h2 className="text-xl font-bold mb-6 text-primary-theme">Create New Comparison</h2>

            <form onSubmit={handleCompare} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Policy A */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-primary-theme">Policy A</h3>
                  <select
                    value={policyAId}
                    onChange={(e) => {
                      setPolicyAId(e.target.value);
                      if (e.target.value !== '') setPolicyAFile(null);
                    }}
                    className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 text-sm text-primary-theme animate-fade-in"
                    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-input)' }}
                  >
                    <option value="">-- Upload Quote/Policy File --</option>
                    {policies.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.originalFileName}
                      </option>
                    ))}
                  </select>

                  {!policyAId && (
                    <div
                      onClick={() => document.getElementById('policy-a-file').click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-primary-500/50 transition-all ${
                        policyAFile ? 'border-green-500/50 bg-green-500/5' : 'border-slate-700'
                      }`}
                      style={!policyAFile ? { backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-input)' } : {}}
                    >
                      {policyAFile ? (
                        <div className="flex items-center justify-between space-x-2">
                          <HiDocumentText className="h-6 w-6 text-green-400 flex-shrink-0" />
                          <span className="text-xs text-green-400 truncate">{policyAFile.name}</span>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setPolicyAFile(null); }}
                            className="text-muted-theme hover:text-red-400 cursor-pointer"
                          >
                            <HiX className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <HiCloudUpload className="h-6 w-6 text-subtle-theme mx-auto mb-1" />
                          <span className="text-xs text-muted-theme">Upload Policy A file</span>
                        </>
                      )}
                      <input
                        id="policy-a-file"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setPolicyAFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Policy B */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-primary-theme">Policy B</h3>
                  <select
                    value={policyBId}
                    onChange={(e) => {
                      setPolicyBId(e.target.value);
                      if (e.target.value !== '') setPolicyBFile(null);
                    }}
                    className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 text-sm text-primary-theme animate-fade-in"
                    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-input)' }}
                  >
                    <option value="">-- Upload Quote/Policy File --</option>
                    {policies.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.originalFileName}
                      </option>
                    ))}
                  </select>

                  {!policyBId && (
                    <div
                      onClick={() => document.getElementById('policy-b-file').click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-primary-500/50 transition-all ${
                        policyBFile ? 'border-green-500/50 bg-green-500/5' : 'border-slate-700'
                      }`}
                      style={!policyBFile ? { backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-input)' } : {}}
                    >
                      {policyBFile ? (
                        <div className="flex items-center justify-between space-x-2">
                          <HiDocumentText className="h-6 w-6 text-green-400 flex-shrink-0" />
                          <span className="text-xs text-green-400 truncate">{policyBFile.name}</span>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setPolicyBFile(null); }}
                            className="text-muted-theme hover:text-red-400 cursor-pointer"
                          >
                            <HiX className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <HiCloudUpload className="h-6 w-6 text-subtle-theme mx-auto mb-1" />
                          <span className="text-xs text-muted-theme">Upload Policy B file</span>
                        </>
                      )}
                      <input
                        id="policy-b-file"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setPolicyBFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Indicator */}
              {processing && (
                <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-card-2)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="animate-spin h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full" />
                    <span className="text-primary-400 font-medium capitalize text-sm">
                      {processingStep === 'uploading' && '📤 Uploading policies...'}
                      {processingStep === 'extracting' && '🔍 Reading text (OCR) & mapping features side-by-side...'}
                    </span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--bg-input)' }}>
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={processing || (!policyAId && !policyAFile) || (!policyBId && !policyBFile)}
                className="smooth-btn w-full bg-primary-600 hover:bg-primary-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 text-lg cursor-pointer"
              >
                {processing ? 'Comparing Quotes...' : 'Compare Side-by-Side'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: History */}
        <div className="space-y-6">
          <div
            className="rounded-2xl p-6 border shadow-sm h-full"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <h2 className="text-xl font-bold mb-6 text-primary-theme">Past Comparisons</h2>

            {loading ? (
              <p className="text-sm text-muted-theme">Loading comparisons...</p>
            ) : comparisons.length === 0 ? (
              <div className="text-center py-8">
                <HiDocumentText className="h-10 w-10 text-subtle-theme mx-auto mb-2" />
                <p className="text-sm text-muted-theme">No past comparisons found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {comparisons.map((c) => (
                  <Link
                    key={c._id}
                    to={`/compare/${c._id}`}
                    className="smooth-row flex items-center justify-between p-3 rounded-xl hover:bg-dark-100/50 border transition-all cursor-pointer"
                    style={{ backgroundColor: 'var(--bg-card-2)', borderColor: 'var(--border)' }}
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <HiDocumentText className="h-5 w-5 text-primary-400 flex-shrink-0" />
                      <div className="truncate">
                        <p className="text-sm font-semibold text-primary-theme truncate">
                          {c.policyAFileName}
                        </p>
                        <p className="text-xs text-muted-theme truncate">
                          vs. {c.policyBFileName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        c.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {c.status}
                      </span>
                      <button
                        onClick={(e) => handleDeleteComparison(c._id, e)}
                        className="text-subtle-theme hover:text-red-400 transition-colors p-1"
                      >
                        <HiTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyComparisonPage;
