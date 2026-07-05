// frontend/src/pages/HomePage.jsx
import { Link } from 'react-router-dom';
import { HiShieldCheck, HiDocumentText, HiLightBulb, HiCheckCircle } from 'react-icons/hi';

const HomePage = () => {
  const features = [
    {
      icon: <HiDocumentText className="h-8 w-8" />,
      title: 'Upload Any Policy',
      description: 'Simply upload your insurance policy as a PDF or image. We support health, auto, home, life, and travel insurance documents.',
    },
    {
      icon: <HiLightBulb className="h-8 w-8" />,
      title: 'AI-Powered Simplification',
      description: 'Our AI reads through the complex legal jargon and translates it into plain, everyday English that anyone can understand.',
    },
    {
      icon: <HiCheckCircle className="h-8 w-8" />,
      title: 'Know Your Coverage',
      description: "Get a clear breakdown of what's covered, what's excluded, key conditions, and potential claim pitfalls — before you need to file a claim.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-transparent to-accent-700/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/30 rounded-full px-4 py-2 mb-8">
            <HiShieldCheck className="text-primary-500 h-4 w-4" />
            <span className="text-sm font-semibold text-primary-600" style={{ color: 'var(--badge-text, #2563eb)' }}>
              AI-Powered Policy Analysis
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-primary-theme">
            Finally{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Understand
            </span>
            <br />
            Your Insurance Policy
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-muted-theme">
            Upload your insurance policy and get a clear, jargon-free summary in seconds. Know exactly
            what's covered, what's not, and what could affect your claims.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="smooth-btn bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:shadow-xl hover:shadow-primary-500/25"
            >
              Get Started — It's Free
            </Link>
            <Link
              to="/login"
              className="smooth-btn border font-semibold px-8 py-4 rounded-xl text-lg"
              style={{ borderColor: 'var(--border-input)', color: 'var(--text-muted)' }}
            >
              I Have an Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4" style={{ backgroundColor: 'var(--bg-card-2)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-primary-theme">How It Works</h2>
          <p className="text-center mb-12 max-w-xl mx-auto text-muted-theme">
            Three simple steps to understand your insurance policy
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="smooth-card rounded-2xl p-8 border hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/10"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
              >
                <div className="bg-primary-500/10 text-primary-400 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <div className="text-primary-400 text-sm font-semibold mb-2">Step {index + 1}</div>
                <h3 className="text-xl font-bold mb-3 text-primary-theme">{feature.title}</h3>
                <p className="leading-relaxed text-muted-theme">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div
          className="smooth-card max-w-3xl mx-auto text-center rounded-2xl p-8 border hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/10"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          {/* Accent top strip — matches primary icon accent used in feature cards */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-500/10 mb-6 mx-auto">
            <svg className="h-8 w-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-primary-theme">Don't Get Surprised at Claim Time</h2>
          <p className="mb-8 text-lg text-muted-theme">
            Join thousands of policyholders who now understand exactly what their insurance covers — and what it doesn't.
          </p>
          <Link
            to="/register"
            className="smooth-btn inline-block bg-primary-600 hover:bg-primary-500 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:shadow-xl hover:shadow-primary-500/25"
          >
            Simplify Your Policy Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
