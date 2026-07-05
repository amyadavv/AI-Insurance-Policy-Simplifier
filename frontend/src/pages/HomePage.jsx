// frontend/src/pages/HomePage.jsx
import { Link } from 'react-router-dom';
import { HiShieldCheck, HiDocumentText, HiLightBulb, HiCheckCircle } from 'react-icons/hi';

const HomePage = () => {
  const features = [
    {
      icon: <HiDocumentText className="h-8 w-8" />,
      title: 'Upload Any Policy',
      description:
        'Simply upload your insurance policy as a PDF or image. We support health, auto, home, life, and travel insurance documents.',
    },
    {
      icon: <HiLightBulb className="h-8 w-8" />,
      title: 'AI-Powered Simplification',
      description:
        'Our AI reads through the complex legal jargon and translates it into plain, everyday English that anyone can understand.',
    },
    {
      icon: <HiCheckCircle className="h-8 w-8" />,
      title: 'Know Your Coverage',
      description:
        "Get a clear breakdown of what's covered, what's excluded, key conditions, and potential claim pitfalls — before you need to file a claim.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-dark-300 to-accent-700/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-8">
            <HiShieldCheck className="text-primary-400" />
            <span className="text-primary-300 text-sm font-medium">
              AI-Powered Policy Analysis
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            <span className="text-white">Finally </span>
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Understand
            </span>
            <br />
            <span className="text-white">Your Insurance Policy</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Upload your insurance policy and get a clear, jargon-free summary
            in seconds. Know exactly what's covered, what's not, and what
            could affect your claims.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-primary-500/25 hover:-translate-y-0.5"
            >
              Get Started — It's Free
            </Link>
            <Link
              to="/login"
              className="border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:bg-dark-100"
            >
              I Have an Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-dark-200/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            How It Works
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
            Three simple steps to understand your insurance policy
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-dark-100 border border-slate-800 rounded-2xl p-8 hover:border-primary-500/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/5"
              >
                <div className="bg-primary-500/10 text-primary-400 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <div className="text-primary-400 text-sm font-semibold mb-2">
                  Step {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-primary-900/40 to-dark-100 border border-primary-500/20 rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Don't Get Surprised at Claim Time
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            Join thousands of policyholders who now understand exactly what
            their insurance covers — and what it doesn't.
          </p>
          <Link
            to="/register"
            className="inline-block bg-primary-600 hover:bg-primary-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-primary-500/25"
          >
            Simplify Your Policy Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
