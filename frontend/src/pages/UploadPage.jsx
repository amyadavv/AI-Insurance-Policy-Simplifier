// frontend/src/pages/UploadPage.jsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCloudUpload, HiDocumentText, HiX, HiLockClosed } from 'react-icons/hi';
import usePolicy from '../hooks/usePolicy';
import useAuth from '../hooks/useAuth';

const UploadPage = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [isWhiteLabeled, setIsWhiteLabeled] = useState(true);
  
  const [dragActive, setDragActive] = useState(false);
  const { uploadPolicy, uploadProgress } = usePolicy();
  const navigate = useNavigate();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const result = await uploadPolicy(file, tags, clientName, clientEmail, isWhiteLabeled);
    if (result) navigate(`/policy/${result._id}`);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 text-primary-theme">Upload Insurance Policy</h1>
      <p className="mb-8 text-muted-theme">
        Upload your policy document and we'll simplify it for you using AI.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input').click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-primary-500 bg-primary-500/5'
              : file
              ? 'border-green-500/50 bg-green-500/5'
              : 'hover:border-primary-500/50'
          }`}
          style={!dragActive && !file ? { borderColor: 'var(--border-input)', backgroundColor: 'var(--bg-card)' } : {}}
        >
          {file ? (
            <div className="flex items-center justify-center space-x-4">
              <HiDocumentText className="h-10 w-10 text-green-400" />
              <div className="text-left">
                <p className="font-medium text-green-400">{file.name}</p>
                <p className="text-sm text-muted-theme">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="text-muted-theme hover:text-red-400 transition-colors cursor-pointer"
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <>
              <HiCloudUpload className="h-12 w-12 mx-auto mb-4 text-subtle-theme" />
              <p className="font-medium mb-1 text-primary-theme">Drag & drop your policy document here</p>
              <p className="text-sm text-subtle-theme">or click to browse • PDF, JPEG, PNG (max 10 MB)</p>
            </>
          )}
          <input id="file-input" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,.tiff" onChange={handleFileChange} className="hidden" />
        </div>

        {/* Privacy & Trust Reassurance */}
        <div className="flex items-start space-x-3 p-4 rounded-xl border bg-green-500/5 dark:bg-green-500/10 border-green-500/20 text-xs text-muted-theme mt-4">
          <HiLockClosed className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-primary-theme block mb-0.5">Privacy-First Architecture</span>
            Your uploaded policies are processed entirely in temporary memory and are handled with secure encryption.
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2 text-label-theme">Tags (optional)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-primary-theme"
            style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-input)' }}
            placeholder="health, family, 2025 (comma separated)"
          />
        </div>

        {/* Agent Client Branding Options */}
        {user?.isAgent && (
          <div className="border rounded-2xl p-5 space-y-4 shadow-sm" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold text-primary-theme">Client Portal Options (White-Label)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-muted-theme">Client Name (optional)</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none text-primary-theme"
                  style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-input)' }}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-muted-theme">Client Email (optional)</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none text-primary-theme"
                  style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-input)' }}
                  placeholder="john.smith@example.com"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-1">
              <input
                id="is-whitelabel-check"
                type="checkbox"
                checked={isWhiteLabeled}
                onChange={(e) => setIsWhiteLabeled(e.target.checked)}
                className="w-4 h-4 text-primary-600 border rounded focus:ring-primary-500 cursor-pointer"
              />
              <label htmlFor="is-whitelabel-check" className="text-xs text-muted-theme cursor-pointer select-none">
                Enable white-label summary sharing link for this client
              </label>
            </div>
          </div>
        )}

        {/* Progress */}
        {uploadProgress.isUploading && (
          <div className="rounded-xl p-6 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center space-x-3 mb-3">
              <div className="animate-spin h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full" />
              <span className="text-primary-400 font-medium">
                {uploadProgress.step === 'uploading' && '📤 Uploading document...'}
                {uploadProgress.step === 'extracting' && '🔍 Extracting text (OCR)...'}
                {uploadProgress.step === 'simplifying' && '🤖 AI is simplifying your policy...'}
              </span>
            </div>
            <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--bg-card-2)' }}>
              <div
                className="bg-gradient-to-r from-primary-600 to-primary-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${uploadProgress.progress}%` }}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!file || uploadProgress.isUploading}
          className="smooth-btn w-full bg-primary-600 hover:bg-primary-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 text-lg cursor-pointer"
        >
          {uploadProgress.isUploading ? 'Processing...' : 'Upload & Simplify'}
        </button>
      </form>
    </div>
  );
};

export default UploadPage;
