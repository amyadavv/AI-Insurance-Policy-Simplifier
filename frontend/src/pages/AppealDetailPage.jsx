// frontend/src/pages/AppealDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiClipboard, HiDownload, HiExclamation, HiTrash } from 'react-icons/hi';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const AppealDetailPage = () => {
  const { id } = useParams();
  const [appeal, setAppeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAppealDetails = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/appeal/${id}`);
      if (data.success) {
        setAppeal(data.data);
      }
    } catch (err) {
      toast.error('Failed to fetch appeal details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppealDetails();
  }, [id]);

  const handleCopy = () => {
    if (!appeal) return;
    navigator.clipboard.writeText(appeal.appealLetter);
    toast.success('Appeal letter copied to clipboard!');
  };

  const handleDownload = () => {
    if (!appeal) return;
    const element = document.createElement('a');
    const file = new Blob([appeal.appealLetter], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Claims_Appeal_${appeal.denialFileName.replace(/\.[^/.]+$/, "")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Appeal letter downloaded!');
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this appeal?')) return;
    try {
      const { data } = await axiosInstance.delete(`/appeal/${id}`);
      if (data.success) {
        toast.success('Appeal deleted successfully');
        navigate('/appeals');
      }
    } catch (err) {
      toast.error('Failed to delete appeal');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-muted-theme">
        <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p>Loading appeal details...</p>
      </div>
    );
  }

  if (!appeal) {
    return (
      <div className="text-center py-20">
        <HiExclamation className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-primary-theme font-medium">Appeal details not found</p>
        <Link to="/appeals" className="text-primary-400 hover:text-primary-300 mt-4 inline-block">
          Go back to Appeals Co-Pilot
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back button & Action list */}
      <div className="flex justify-between items-center mb-8">
        <Link
          to="/appeals"
          className="inline-flex items-center space-x-2 text-muted-theme hover:text-primary-theme transition-colors font-medium"
        >
          <HiArrowLeft className="h-5 w-5" />
          <span>Back to Appeal Co-Pilot</span>
        </Link>

        <button
          onClick={handleDelete}
          className="text-subtle-theme hover:text-red-500 p-2 border rounded-xl hover:bg-red-500/5 transition-colors cursor-pointer"
          style={{ borderColor: 'var(--border)' }}
        >
          <HiTrash className="h-5 w-5" />
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Denial Reason */}
        <div
          className="md:col-span-2 rounded-2xl p-6 border shadow-sm"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h2 className="text-lg font-bold mb-3 text-red-400 flex items-center space-x-2">
            <HiExclamation className="h-5 w-5 flex-shrink-0" />
            <span>Denial Reason Summary</span>
          </h2>
          <p className="text-sm leading-relaxed text-muted-theme">
            {appeal.denialReason || 'No summary extracted.'}
          </p>
        </div>

        {/* File Sources */}
        <div
          className="rounded-2xl p-6 border shadow-sm"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h2 className="text-lg font-bold mb-3 text-primary-theme">Source Files</h2>
          <div className="space-y-3 text-xs">
            <div>
              <p className="font-semibold text-primary-theme">Denial Letter:</p>
              <p className="text-muted-theme truncate" title={appeal.denialFileName}>
                {appeal.denialFileName}
              </p>
            </div>
            <div>
              <p className="font-semibold text-primary-theme">Insurance Policy:</p>
              <p className="text-muted-theme truncate" title={appeal.policyFileName}>
                {appeal.policyFileName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Arguments */}
      <div
        className="rounded-2xl p-6 border shadow-sm mb-8 animate-fade-in"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <h2 className="text-xl font-bold mb-4 text-primary-theme">Appeal Strategy & Arguments</h2>
        <div className="space-y-3">
          {appeal.keyArguments && appeal.keyArguments.map((arg, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-3 p-3 rounded-xl border"
              style={{ backgroundColor: 'var(--bg-card-2)', borderColor: 'var(--border)' }}
            >
              <span className="bg-primary-500/10 text-primary-400 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-sm text-muted-theme leading-relaxed">{arg}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Generate appeal letter content block */}
      <div
        className="rounded-2xl border shadow-sm"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        {/* Header toolbar */}
        <div className="flex justify-between items-center px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-xl font-bold text-primary-theme">Generated Appeal Letter</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopy}
              className="smooth-btn inline-flex items-center space-x-1.5 bg-primary-600/10 text-primary-400 border border-primary-500/20 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
            >
              <HiClipboard className="h-4 w-4" />
              <span>Copy</span>
            </button>
            <button
              onClick={handleDownload}
              className="smooth-btn inline-flex items-center space-x-1.5 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
            >
              <HiDownload className="h-4 w-4" />
              <span>Download .TXT</span>
            </button>
          </div>
        </div>

        {/* Letter body */}
        <div className="p-8 font-mono text-sm leading-relaxed text-muted-theme whitespace-pre-wrap select-text">
          {appeal.appealLetter}
        </div>
      </div>
    </div>
  );
};

export default AppealDetailPage;
