// frontend/src/components/common/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authAtom } from '../../atoms/authAtom';

const ProtectedRoute = ({ children }) => {
  const user = useRecoilValue(authAtom);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
