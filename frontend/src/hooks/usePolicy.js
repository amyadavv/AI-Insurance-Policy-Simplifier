// frontend/src/hooks/usePolicy.js
import { useRecoilState } from 'recoil';
import {
  policiesAtom,
  selectedPolicyAtom,
  policyLoadingAtom,
  uploadProgressAtom,
  dashboardStatsAtom,
} from '../atoms/policyAtom';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const usePolicy = () => {
  const [policies, setPolicies] = useRecoilState(policiesAtom);
  const [selectedPolicy, setSelectedPolicy] = useRecoilState(selectedPolicyAtom);
  const [loading, setLoading] = useRecoilState(policyLoadingAtom);
  const [uploadProgress, setUploadProgress] = useRecoilState(uploadProgressAtom);
  const [stats, setStats] = useRecoilState(dashboardStatsAtom);

  // Upload a new policy
  const uploadPolicy = async (file, tags = '', clientName = '', clientEmail = '', isWhiteLabeled = false) => {
    setUploadProgress({ isUploading: true, step: 'uploading', progress: 10 });

    try {
      const formData = new FormData();
      formData.append('document', file);
      if (tags) formData.append('tags', tags);
      if (clientName) formData.append('clientName', clientName);
      if (clientEmail) formData.append('clientEmail', clientEmail);
      formData.append('isWhiteLabeled', isWhiteLabeled);

      setUploadProgress({ isUploading: true, step: 'uploading', progress: 30 });

      // Simulate status indicator progress steps
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (!prev.isUploading) {
            clearInterval(interval);
            return prev;
          }
          if (prev.step === 'uploading' && prev.progress >= 50) {
            return { isUploading: true, step: 'extracting', progress: 60 };
          }
          if (prev.step === 'extracting' && prev.progress >= 80) {
            return { isUploading: true, step: 'simplifying', progress: 85 };
          }
          const nextProgress = Math.min(prev.progress + 5, 95);
          return { ...prev, progress: nextProgress };
        });
      }, 3000);

      const { data } = await axiosInstance.post('/policy/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000, // 2 minute timeout for large files + AI processing
      });

      clearInterval(interval);
      setUploadProgress({ isUploading: false, step: 'completed', progress: 100 });

      if (data.success) {
        toast.success('Policy simplified successfully!');
        return data.data;
      }
    } catch (error) {
      setUploadProgress({ isUploading: false, step: '', progress: 0 });
      toast.error(error.response?.data?.message || 'Upload failed');
      return null;
    }
  };

  // Fetch all policies
  const fetchPolicies = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/policy', { params });
      if (data.success) {
        setPolicies(data.data);
        return data;
      }
    } catch (error) {
      toast.error('Failed to fetch policies');
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single policy
  const fetchPolicyById = async (id) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/policy/${id}`);
      if (data.success) {
        setSelectedPolicy(data.data);
        return data.data;
      }
    } catch (error) {
      toast.error('Failed to fetch policy details');
    } finally {
      setLoading(false);
    }
  };

  // Delete a policy
  const deletePolicy = async (id) => {
    try {
      const { data } = await axiosInstance.delete(`/policy/${id}`);
      if (data.success) {
        setPolicies((prev) => prev.filter((p) => p._id !== id));
        toast.success('Policy deleted');
        return true;
      }
    } catch (error) {
      toast.error('Failed to delete policy');
      return false;
    }
  };

  // Toggle bookmark
  const toggleBookmark = async (id) => {
    try {
      const { data } = await axiosInstance.put(`/policy/${id}/bookmark`);
      if (data.success) {
        setPolicies((prev) =>
          prev.map((p) =>
            p._id === id ? { ...p, isBookmarked: data.data.isBookmarked } : p
          )
        );
        // Also update selected policy if matched
        setSelectedPolicy((prev) => {
          if (prev && prev._id === id) {
            return { ...prev, isBookmarked: data.data.isBookmarked };
          }
          return prev;
        });
      }
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const { data } = await axiosInstance.get('/policy/stats');
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  return {
    policies,
    selectedPolicy,
    loading,
    uploadProgress,
    stats,
    uploadPolicy,
    fetchPolicies,
    fetchPolicyById,
    deletePolicy,
    toggleBookmark,
    fetchStats,
  };
};

export default usePolicy;
