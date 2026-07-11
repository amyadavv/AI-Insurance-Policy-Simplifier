// frontend/src/components/home/WhatWeDoSection.jsx
import {
  HiScale,
  HiClipboardList,
  HiUserGroup,
  HiShieldCheck,
  HiSparkles
} from 'react-icons/hi';

const WhatWeDoSection = () => {
  const features = [
    {
      icon: <HiSparkles className="h-6 w-6 text-primary-500" />,
      title: 'AI-Powered Policy Summaries',
      description: 'Upload complex policy booklets. Our AI reads through the legal jargon and extracts coverages, deductibles, and exclusions into clear, simple English.'
    },
    {
      icon: <HiClipboardList className="h-6 w-6 text-primary-500" />,
      title: 'Claims Appeal Co-Pilot',
      description: 'If a claim is denied, our AI writes a professional, persuasive appeal letter directly citing your policy terms to maximize approval odds.'
    },
    {
      icon: <HiScale className="h-6 w-6 text-primary-500" />,
      title: 'Side-by-Side Comparison',
      description: 'Compare multiple quotes or policies side-by-side to easily find differences in coverage, premiums, and limits before choosing a plan.'
    },
    {
      icon: <HiUserGroup className="h-6 w-6 text-primary-500" />,
      title: 'White-Label Agent Portal',
      description: 'Insurance agents can customize policy summaries with their organization name and agency profile, sharing them with clients through secure, custom portals.'
    },
    {
      icon: <HiShieldCheck className="h-6 w-6 text-primary-500" />,
      title: 'HR & Employee Benefits Hub',
      description: 'HR administrators can upload organization health and benefit plans to let employees search and understand their corporate benefits in seconds.'
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary-theme">What We Do</h2>
          <p className="text-muted-theme mt-4 max-w-2xl mx-auto text-base">
            We simplify the entire insurance lifecycle. From understanding policies and comparing coverage to fighting claims and sharing client portfolios.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className="smooth-card rounded-2xl p-8 border hover:shadow-lg transition-all flex flex-col justify-between"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-3 text-primary-theme">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-theme">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
