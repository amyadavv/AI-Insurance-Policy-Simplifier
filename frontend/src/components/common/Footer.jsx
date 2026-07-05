// frontend/src/components/common/Footer.jsx
import { Link } from 'react-router-dom';
import { HiShieldCheck } from 'react-icons/hi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t mt-16"
      style={{ backgroundColor: 'var(--bg-card-2)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-3">
              <div className="bg-primary-600 p-1.5 rounded-lg">
                <HiShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg text-primary-theme">PolicySimplifier</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-theme">
              AI-powered insurance policy simplification. Understand what you're covered for — in plain English.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-theme">Product</h3>
            <ul className="space-y-2">
              {[['/', 'Home'], ['/dashboard', 'Dashboard'], ['/upload', 'Upload Policy']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sm transition-colors text-muted-theme hover:text-primary-400">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-theme">Legal & Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm transition-colors text-muted-theme hover:text-primary-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm transition-colors text-muted-theme hover:text-primary-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@policysimplifier.in"
                  className="text-sm transition-colors text-muted-theme hover:text-primary-400"
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-3"
          style={{ borderColor: 'var(--border)' }}
        >
          <p className="text-sm text-subtle-theme">
            © {currentYear} PolicySimplifier. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-xs text-subtle-theme">
            <HiShieldCheck className="h-3.5 w-3.5 text-green-500" />
            <span>SSL Encrypted · Files auto-deleted after 30 days · No AI training on your data</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
