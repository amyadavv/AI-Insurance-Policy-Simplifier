// frontend/src/pages/ClaimsAppealPage.jsx
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiPlus, HiDocumentText, HiTrash, HiShieldCheck, HiArrowRight, HiCloudUpload, HiX } from 'react-icons/hi';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const ClaimsAppealPage = () => {
  const [appeals, setAppeals] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [selectedPolicyId, setSelectedPolicyId] = useState('');
  const [policyFile, setPolicyFile] = useState(null);
  const [denialFile, setDenialFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();

  const fetchAppeals = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/appeal');
      if (data.success) {
        setAppeals(data.data);
      }
    } catch (err) {
      toast.error('Failed to fetch appeals');
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
    fetchAppeals();
    fetchPolicies();
  }, []);

  const handleCreateAppeal = async (e) => {
    e.preventDefault();
    if (!denialFile) {
      toast.error('Please upload a claim denial letter');
      return;
    }
    if (!selectedPolicyId && !policyFile) {
      toast.error('Please select an existing policy or upload a new one');
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
      formData.append('denial', denialFile);
      if (selectedPolicyId) {
        formData.append('policyId', selectedPolicyId);
      } else if (policyFile) {
        formData.append('policy', policyFile);
      }

      setProcessingStep('extracting');
      const { data } = await axiosInstance.post('/appeal/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 180000, // 3 minutes
      });

      clearInterval(interval);
      setProgress(100);

      if (data.success) {
        toast.success('Appeal letter generated successfully!');
        navigate(`/appeals/${data.data._id}`);
      }
    } catch (err) {
      clearInterval(interval);
      toast.error(err.response?.data?.message || 'Failed to generate appeal');
    } finally {
      setProcessing(false);
      setProcessingStep('');
      setProgress(0);
    }
  };

  const handleDeleteAppeal = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this appeal?')) return;

    try {
      const { data } = await axiosInstance.delete(`/appeal/${id}`);
      if (data.success) {
        setAppeals((prev) => prev.filter((a) => a._id !== id));
        toast.success('Appeal deleted successfully');
      }
    } catch (err) {
      toast.error('Failed to delete appeal');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-theme flex items-center space-x-2">
          <HiShieldCheck className="text-primary-500 h-8 w-8" />
          <span>Claims Appeal Co-Pilot</span>
        </h1>
        <p className="mt-1 text-muted-theme">
          Upload your claim denial letter and insurance policy. The AI will analyze clauses and write a professional appeal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <div
            className="rounded-2xl p-6 border shadow-sm"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <h2 className="text-xl font-bold mb-6 text-primary-theme">Create New Appeal</h2>

            <form onSubmit={handleCreateAppeal} className="space-y-6">
              {/* Policy Selection */}
              <div>
                <label className="block text-sm font-medium mb-2 text-label-theme">
                  1. Select Insurance Policy Source
                </label>
                <select
                  value={selectedPolicyId}
                  onChange={(e) => {
                    setSelectedPolicyId(e.target.value);
                    if (e.target.value !== '') setPolicyFile(null);
                  }}
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 text-primary-theme"
                  style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-input)' }}
                >
                  <option value="">-- Upload New Policy Document (.pdf, .jpg, .png) --</option>
                  {policies.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.originalFileName} ({p.simplifiedSummary?.policyType || 'Simplified'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Policy File Upload (only show if no existing policy selected) */}
              {!selectedPolicyId && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-label-theme">
                    Upload Policy Document
                  </label>
                  <div
                    onClick={() => document.getElementById('policy-file-input').click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-primary-500/50 transition-all ${
                      policyFile ? 'border-green-500/50 bg-green-500/5' : 'border-slate-700'
                    }`}
                    style={!policyFile ? { backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-input)' } : {}}
                  >
                    {policyFile ? (
                      <div className="flex items-center justify-center space-x-3">
                        <HiDocumentText className="h-8 w-8 text-green-400" />
                        <span className="text-sm font-medium text-green-400">{policyFile.name}</span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setPolicyFile(null); }}
                          className="text-muted-theme hover:text-red-400 cursor-pointer"
                        >
                          <HiX className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <HiCloudUpload className="h-8 w-8 text-subtle-theme mx-auto mb-2" />
                        <span className="text-sm text-muted-theme">Click to upload insurance policy</span>
                      </>
                    )}
                    <input
                      id="policy-file-input"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setPolicyFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </div>
                </div>
              )}

              {/* Claim Denial Letter Upload */}
              <div>
                <label className="block text-sm font-medium mb-2 text-label-theme">
                  2. Upload Claim Denial Letter (Required)
                </label>
                <div
                  onClick={() => document.getElementById('denial-file-input').click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-primary-500/50 transition-all ${
                    denialFile ? 'border-green-500/50 bg-green-500/5' : 'border-slate-700'
                  }`}
                  style={!denialFile ? { backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-input)' } : {}}
                >
                  {denialFile ? (
                    <div className="flex items-center justify-center space-x-3">
                      <HiDocumentText className="h-8 w-8 text-green-400" />
                      <span className="text-sm font-medium text-green-400">{denialFile.name}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setDenialFile(null); }}
                        className="text-muted-theme hover:text-red-400 cursor-pointer"
                      >
                        <HiX className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <HiCloudUpload className="h-8 w-8 text-subtle-theme mx-auto mb-2" />
                      <span className="text-sm text-muted-theme">Click to upload claim denial letter</span>
                    </>
                  )}
                  <input
                    id="denial-file-input"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setDenialFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Processing Progress Indicator */}
              {processing && (
                <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-card-2)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="animate-spin h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full" />
                    <span className="text-primary-400 font-medium capitalize text-sm">
                      {processingStep === 'uploading' && '📤 Uploading documents to cloud...'}
                      {processingStep === 'extracting' && '🔍 Reading text (OCR) & running AI analysis...'}
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
                disabled={processing || (!selectedPolicyId && !policyFile) || !denialFile}
                className="smooth-btn w-full bg-primary-600 hover:bg-primary-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 text-lg cursor-pointer"
              >
                {processing ? 'Analyzing & Writing Appeal...' : 'Generate Appeal Letter'}
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
            <h2 className="text-xl font-bold mb-6 text-primary-theme">Past Appeals</h2>

            {loading ? (
              <p className="text-sm text-muted-theme">Loading appeals...</p>
            ) : appeals.length === 0 ? (
              <div className="text-center py-8">
                <HiDocumentText className="h-10 w-10 text-subtle-theme mx-auto mb-2" />
                <p className="text-sm text-muted-theme">No generated appeals found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appeals.map((appeal) => (
                  <Link
                    key={appeal._id}
                    to={`/appeals/${appeal._id}`}
                    className="smooth-row flex items-center justify-between p-3 rounded-xl hover:bg-dark-100/50 border transition-all cursor-pointer"
                    style={{ backgroundColor: 'var(--bg-card-2)', borderColor: 'var(--border)' }}
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <HiDocumentText className="h-5 w-5 text-primary-400 flex-shrink-0" />
                      <div className="truncate">
                        <p className="text-sm font-semibold text-primary-theme truncate">
                          {appeal.denialFileName}
                        </p>
                        <p className="text-xs text-muted-theme truncate">
                          vs. {appeal.policyFileName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        appeal.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {appeal.status}
                      </span>
                      <button
                        onClick={(e) => handleDeleteAppeal(appeal._id, e)}
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

export default ClaimsAppealPage;
