// frontend/src/components/home/HeroSection.jsx
import { Link } from 'react-router-dom';
import { HiShieldCheck } from 'react-icons/hi';

const HeroSection = () => {
  return (
    <section className="relative py-24 px-4 overflow-hidden text-center">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 via-transparent to-accent-700/5" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-5xl mx-auto">
        {/* Header pill */}
        <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/35 rounded-full px-4.5 py-2.5 mb-8">
          <HiShieldCheck className="text-primary-500 h-4.5 w-4.5" />
          <span className="text-xs font-bold text-primary-600 uppercase tracking-wider" style={{ color: 'var(--badge-text, #2563eb)' }}>
            AI-Powered Policy Simplifier
          </span>
        </div>

        <h1 className="text-4xl md:text-6.5xl font-extrabold mb-6 leading-tight text-primary-theme">
          Insurance Policies are{' '}
          <span className="bg-gradient-to-r from-red-500 via-orange-400 to-primary-500 bg-clip-text text-transparent">
            Hard to Read
          </span>
          <br />
          We Make Them Easy.
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-muted-theme leading-relaxed">
          Why struggle with 100-page booklets of legal jargon? Upload your policy and instantly get a simplified, plain-English summary. Protect yourself from hidden exclusions and claim surprises.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="smooth-btn bg-primary-600 hover:bg-primary-500 text-white font-bold px-8 py-4.5 rounded-xl text-lg hover:shadow-xl hover:shadow-primary-500/25 cursor-pointer"
          >
            Get Started — It's Free
          </Link>
          <Link
            to="/login"
            className="smooth-btn border font-semibold px-8 py-4.5 rounded-xl text-lg hover:bg-dark-100/5 cursor-pointer"
            style={{ borderColor: 'var(--border-input)', color: 'var(--text-muted)' }}
          >
            I Have an Account
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
