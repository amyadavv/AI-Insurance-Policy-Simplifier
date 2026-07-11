// frontend/src/components/home/WhyChooseUsSection.jsx
import { HiCheckCircle, HiLightningBolt, HiLockClosed, HiEmojiHappy } from 'react-icons/hi';
import ScrollReveal from '../common/ScrollReveal';

const WhyChooseUsSection = () => {
  const reasons = [
    {
      icon: <HiLightningBolt className="h-6 w-6 text-yellow-500" />,
      title: 'Save Hundreds of Hours',
      description: 'Skip reading 80+ page legal booklets. Get deep insights, list of coverages, and potential warnings instantly in plain English.'
    },
    {
      icon: <HiEmojiHappy className="h-6 w-6 text-green-500" />,
      title: 'Uncover Hidden Traps',
      description: 'Avoid unexpected out-of-pocket costs. Our AI specifically highlights exclusions, deductibles, and tricky fine-print terms.'
    },
    {
      icon: <HiCheckCircle className="h-6 w-6 text-primary-500" />,
      title: 'Fight Denied Claims',
      description: 'Use custom-generated appeal letters that cite relevant clauses in your policy to challenge insurance company decisions successfully.'
    },
    {
      icon: <HiLockClosed className="h-6 w-6 text-red-500" />,
      title: 'Bank-Grade Data Security',
      description: 'Your uploaded insurance policies are handled with secure encryption and absolute privacy. We do not sell or share your personal documents.'
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Info */}
          <ScrollReveal className="lg:col-span-5" animation="slide-right" delay={100}>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary-theme leading-tight">
                Why Choose <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">AIPolicySimplifier</span>?
              </h2>
              <p className="text-muted-theme leading-relaxed text-base">
                Insurance companies count on the complexity of their policy documents to protect their margins. We put the power back in your hands by translating legal jargon into direct, plain-English definitions.
              </p>
              <div className="pt-4">
                <span className="inline-block px-4 py-2 bg-primary-500/10 text-primary-500 rounded-full font-semibold text-xs tracking-wider uppercase">
                  Empowering Policyholders & Agents
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Reasons List */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
            {reasons.map((reason, index) => (
              <ScrollReveal
                key={index}
                animation="fade-up"
                delay={200 + index * 100}
                className="flex"
              >
                <div
                  className="smooth-card rounded-2xl p-6 border flex flex-col justify-start w-full"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
                >
                  <div className="w-12 h-12 rounded-xl bg-dark-100/5 dark:bg-white/5 flex items-center justify-center mb-4">
                    {reason.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-primary-theme">{reason.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-theme">{reason.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
