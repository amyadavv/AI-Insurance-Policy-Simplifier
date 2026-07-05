// frontend/src/pages/UploadPage.jsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCloudUpload, HiDocumentText, HiX } from 'react-icons/hi';
import usePolicy from '../hooks/usePolicy';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const { uploadPolicy, uploadProgress } = usePolicy();
  const navigate = useNavigate();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const result = await uploadPolicy(file, tags);
    if (result) {
      navigate(`/policy/${result._id}`);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Upload Insurance Policy</h1>
      <p className="text-slate-400 mb-8">
        Upload your policy document and we'll simplify it for you using AI.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-primary-500 bg-primary-500/5'
              : file
              ? 'border-green-500/50 bg-green-500/5'
              : 'border-slate-700 hover:border-slate-600 bg-dark-100'
          }`}
          onClick={() => document.getElementById('file-input').click()}
        >
          {file ? (
            <div className="flex items-center justify-center space-x-4">
              <HiDocumentText className="h-10 w-10 text-green-400" />
              <div className="text-left">
                <p className="font-medium text-green-400">{file.name}</p>
                <p className="text-slate-400 text-sm">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <>
              <HiCloudUpload className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-300 font-medium mb-1">
                Drag & drop your policy document here
              </p>
              <p className="text-slate-500 text-sm">
                or click to browse • PDF, JPEG, PNG (max 10 MB)
              </p>
            </>
          )}
          <input
            id="file-input"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.tiff"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Tags (optional)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full bg-dark-100 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            placeholder="health, family, 2025 (comma separated)"
          />
        </div>

        {/* Upload Progress */}
        {uploadProgress.isUploading && (
          <div className="bg-dark-100 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="animate-spin h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full" />
              <span className="text-primary-400 font-medium capitalize">
                {uploadProgress.step === 'uploading' && '📤 Uploading document...'}
                {uploadProgress.step === 'extracting' && '🔍 Extracting text (OCR)...'}
                {uploadProgress.step === 'simplifying' && '🤖 AI is simplifying your policy...'}
              </span>
            </div>
            <div className="w-full bg-dark-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-600 to-primary-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${uploadProgress.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || uploadProgress.isUploading}
          className="w-full bg-primary-600 hover:bg-primary-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-primary-500/25 text-lg cursor-pointer"
        >
          {uploadProgress.isUploading
            ? 'Processing...'
            : 'Upload & Simplify'}
        </button>
      </form>
    </div>
  );
};

export default UploadPage;
