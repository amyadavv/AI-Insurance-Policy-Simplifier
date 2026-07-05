// frontend/src/components/common/Footer.jsx
import { Link } from 'react-router-dom';
import { HiShieldCheck } from 'react-icons/hi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-dark-200/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-3">
              <div className="bg-primary-600 p-1.5 rounded-lg">
                <HiShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">PolicySimplifier</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              AI-powered insurance policy simplification. Understand what you're covered for — in plain English.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Upload Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal & Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@policysimplifier.in"
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-slate-500 text-sm">
            © {currentYear} PolicySimplifier. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-slate-500 text-xs">
            <HiShieldCheck className="h-3.5 w-3.5 text-green-500" />
            <span>SSL Encrypted · Files auto-deleted after 30 days · No AI training on your data</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
