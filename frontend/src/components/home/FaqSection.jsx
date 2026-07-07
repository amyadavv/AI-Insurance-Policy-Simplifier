// frontend/src/components/home/FaqSection.jsx
import { useState } from 'react';
import { HiChevronDown, HiOutlineQuestionMarkCircle } from 'react-icons/hi';

const FaqSection = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: 'Is the AI summary accurate and effective?',
      a: 'Yes, our engine leverages advanced Gemini models designed specifically to read unstructured contract terms. It extracts policy numbers, deductibles, limits, and exclusions with high precision. However, because it is an automated helper, we always recommend verifying critical policy decisions with your insurance advisor.',
    },
    {
      q: 'Should I trust an AI summary over my official insurance contract?',
      a: 'The AI summary is a powerful review assistant designed to pinpoint hidden warnings, compare quotes, and save you hours of reading. However, the official policy document remains the legally binding contract. Think of this tool as a fast diagnostic helper rather than a complete legal replacement.',
    },
    {
      q: 'How secure are my uploaded documents?',
      a: 'Security is central to our architecture. We process and analyze your policy files entirely in temporary memory. We do not store your documents permanently on our servers unless you choose to create a secure account to save them to your personal dashboard.',
    },
    {
      q: 'Does it support scanned PDFs or pictures of policies?',
      a: 'Absolutely. If your PDF does not have selectable text, our processing pipeline automatically falls back to an integrated OCR (Optical Character Recognition) engine to extract text from images and scans before running the AI simplifier.',
    },
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-extrabold text-primary-theme flex items-center justify-center space-x-2">
            <HiOutlineQuestionMarkCircle className="text-primary-500 h-8 w-8" />
            <span>AI Summaries & Trust FAQ</span>
          </h2>
          <p className="text-muted-theme mt-2 text-sm">
            Answers to questions regarding effectiveness, reliability, and security of automated summaries.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border overflow-hidden transition-all shadow-sm"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-5 text-left text-xs font-bold text-primary-theme focus:outline-none"
              >
                <span>{faq.q}</span>
                <HiChevronDown
                  className={`h-5 w-5 text-subtle-theme transition-transform duration-300 ${
                    activeFaq === idx ? 'rotate-180 text-primary-400' : ''
                  }`}
                />
              </button>
              
              {activeFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-muted-theme leading-relaxed border-t" style={{ borderColor: 'var(--border)' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
