// frontend/src/atoms/policyAtom.js
import { atom } from 'recoil';

export const policiesAtom = atom({
  key: 'policiesAtom',
  default: [],
});

export const selectedPolicyAtom = atom({
  key: 'selectedPolicyAtom',
  default: null,
});

export const policyLoadingAtom = atom({
  key: 'policyLoadingAtom',
  default: false,
});

export const uploadProgressAtom = atom({
  key: 'uploadProgressAtom',
  default: {
    isUploading: false,
    step: '', // 'uploading', 'extracting', 'simplifying', 'completed'
    progress: 0,
  },
});

export const dashboardStatsAtom = atom({
  key: 'dashboardStatsAtom',
  default: null,
});
