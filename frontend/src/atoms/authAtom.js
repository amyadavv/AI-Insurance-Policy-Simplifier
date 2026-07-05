// frontend/src/atoms/authAtom.js
import { atom } from 'recoil';

// Get initial auth state from localStorage
const getInitialAuthState = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      return JSON.parse(userInfo);
    }
  } catch (error) {
    localStorage.removeItem('userInfo');
  }
  return null;
};

export const authAtom = atom({
  key: 'authAtom',
  default: getInitialAuthState(),
});

export const authLoadingAtom = atom({
  key: 'authLoadingAtom',
  default: false,
});
