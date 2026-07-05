// frontend/src/hooks/useAuth.js
import { useRecoilState } from 'recoil';
import { authAtom, authLoadingAtom } from '../atoms/authAtom';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const useAuth = () => {
  const [user, setUser] = useRecoilState(authAtom);
  const [loading, setLoading] = useRecoilState(authLoadingAtom);

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/auth/register', {
        name,
        email,
        password,
      });
      if (data.success) {
        localStorage.setItem('userInfo', JSON.stringify(data.data));
        setUser(data.data);
        toast.success('Account created successfully!');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/auth/login', {
        email,
        password,
      });
      if (data.success) {
        localStorage.setItem('userInfo', JSON.stringify(data.data));
        setUser(data.data);
        toast.success('Logged in successfully!');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    toast.success('Logged out');
  };

  return { user, loading, register, login, logout };
};

export default useAuth;
