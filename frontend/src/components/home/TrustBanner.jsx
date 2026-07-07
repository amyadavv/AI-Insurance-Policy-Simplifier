// frontend/src/components/home/TrustBanner.jsx
import { HiLockClosed } from 'react-icons/hi';

const TrustBanner = () => {
  return (
    <section className="px-4 pb-16">
      <div 
        className="max-w-3xl mx-auto rounded-2xl p-5 border flex items-start space-x-3.5 text-left shadow-sm"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="p-2 rounded-xl bg-green-500/10 text-green-500 flex-shrink-0 mt-0.5">
          <HiLockClosed className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-primary-theme uppercase tracking-wider">Privacy-First Architecture</h4>
          <p className="text-xs text-muted-theme mt-1 leading-relaxed">
            Your privacy is our priority. We process and analyze your policy files entirely in temporary memory. No document data is stored permanently on our servers unless you choose to create a secure account to save them.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustBanner;
