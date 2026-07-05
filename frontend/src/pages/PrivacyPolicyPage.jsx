// frontend/src/pages/PrivacyPolicyPage.jsx
import { Link } from 'react-router-dom';
import { HiShieldCheck, HiArrowLeft } from 'react-icons/hi';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-slate-800">
      {title}
    </h2>
    <div className="text-slate-400 leading-relaxed space-y-3">{children}</div>
  </div>
);

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative py-16 px-4 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-dark-300 to-dark-300" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6">
            <HiShieldCheck className="text-primary-400 h-4 w-4" />
            <span className="text-primary-300 text-sm font-medium">Your Privacy Matters</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-slate-400 text-lg">
            Last updated: <span className="text-white font-medium">July 2025</span>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-white text-sm mb-10 transition-colors"
        >
          <HiArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-dark-100 border border-slate-800 rounded-2xl p-8 md:p-10">

          <Section title="1. Introduction">
            <p>
              Welcome to <strong className="text-white">PolicySimplifier</strong> ("we", "our", or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web application.
            </p>
            <p>
              Please read this policy carefully. If you disagree with its terms, please discontinue use of the application.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p>We collect information that you provide directly to us, including:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-white">Account Information</strong>: Your name and email address when you register.</li>
              <li><strong className="text-white">Uploaded Documents</strong>: Insurance policy files (PDF or image format) that you upload for analysis.</li>
              <li><strong className="text-white">Usage Data</strong>: Pages visited, features used, and interaction timestamps for performance analytics.</li>
              <li><strong className="text-white">Payment Data</strong>: We do not store card details. Payment information is handled directly and securely by Razorpay or Stripe under their respective PCI-DSS compliance standards.</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Provide, operate, and maintain our application.</li>
              <li>Process your uploaded documents through our OCR and AI pipeline to generate simplified summaries.</li>
              <li>Manage your account, subscription, and billing history.</li>
              <li>Send account-related communications (e.g., payment receipts, alerts).</li>
              <li>Improve and optimise our services and user experience.</li>
            </ul>
          </Section>

          <Section title="4. Document Storage & Retention">
            <p className="font-medium text-white">
              Your uploaded documents are treated with the highest level of care:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Uploaded files are stored securely on <strong className="text-white">Cloudinary</strong> encrypted storage servers.</li>
              <li>Files are automatically deleted from our servers <strong className="text-white">30 days</strong> after upload.</li>
              <li>Extracted text is stored in our database solely to power your personal policy history dashboard and will never be sold or shared with third parties.</li>
              <li>You may delete any policy and its associated data at any time from your dashboard.</li>
            </ul>
          </Section>

          <Section title="5. AI Processing & Data Training">
            <p>
              We use the <strong className="text-white">Google Gemini API</strong> to analyse and simplify your policy documents.
            </p>
            <p>
              Under Google AI Studio's API Terms of Service, data submitted via API requests is <strong className="text-white">strictly prohibited from being used to train Google's public models</strong>. Your document content is sent securely to the API, processed, and the response is returned. Google does not retain or train on your data.
            </p>
            <p>
              We never use your document content to train any internal or external machine learning models.
            </p>
          </Section>

          <Section title="6. Data Sharing & Third Parties">
            <p>We do not sell, trade, or rent your personal information. We may share limited data with:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-white">Cloudinary</strong>: For secure file storage.</li>
              <li><strong className="text-white">MongoDB Atlas</strong>: For encrypted database storage.</li>
              <li><strong className="text-white">Razorpay / Stripe</strong>: For secure payment processing.</li>
              <li><strong className="text-white">Google AI Studio</strong>: For AI-based document analysis.</li>
            </ul>
            <p>All third-party providers are bound by strict data processing agreements.</p>
          </Section>

          <Section title="7. Security">
            <p>
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>TLS/SSL encryption for all data transmitted between your browser and our servers.</li>
              <li>Hashed and salted passwords (bcrypt) — we never store your password in plain text.</li>
              <li>JWT-based authentication with expiring tokens.</li>
              <li>Encrypted cloud storage for all uploaded documents.</li>
            </ul>
          </Section>

          <Section title="8. Your Rights">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-white">Access</strong>: Request a copy of the personal data we hold about you.</li>
              <li><strong className="text-white">Delete</strong>: Request deletion of your account and all associated data.</li>
              <li><strong className="text-white">Correct</strong>: Update inaccurate personal information via your profile settings.</li>
              <li><strong className="text-white">Portability</strong>: Request an export of your policy summaries.</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at <strong className="text-white">privacy@policysimplifier.in</strong>.
            </p>
          </Section>

          <Section title="9. Cookies">
            <p>
              We use only essential session cookies required for authentication and application functionality. We do not use advertising, tracking, or third-party analytics cookies.
            </p>
          </Section>

          <Section title="10. Contact Us">
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-3 p-4 bg-dark-200 rounded-xl border border-slate-800">
              <p className="text-white font-medium">PolicySimplifier</p>
              <p>Email: <span className="text-primary-400">privacy@policysimplifier.in</span></p>
            </div>
          </Section>

        </div>

        <div className="mt-6 text-center text-slate-500 text-sm">
          Also read our{' '}
          <Link to="/terms" className="text-primary-400 hover:text-primary-300 transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
