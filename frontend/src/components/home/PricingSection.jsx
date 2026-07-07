// frontend/src/components/home/PricingSection.jsx
import { Link } from 'react-router-dom';
import { HiCheckCircle } from 'react-icons/hi';

const PricingSection = () => {
  const pricingPlans = [
    {
      name: 'Free Basic',
      price: '₹0',
      period: 'forever',
      desc: 'Perfect for summarizing a single policy.',
      features: [
        '1 Policy upload & simplification',
        'Standard AI summary analysis',
        'Coverages & Exclusions list',
        'System light/dark mode',
      ],
      buttonText: 'Start Free Analysis',
      buttonLink: '/register',
      isPopular: false,
    },
    {
      name: 'Pro Premium',
      price: '₹399',
      period: 'month',
      desc: 'Ideal for individuals and active policyholders.',
      features: [
        'Unlimited policy uploads',
        'Full Claims Appeal Co-Pilot access',
        'Side-by-side policy comparisons',
        'Priority Gemini processing',
        'Advanced red-flag warning indicators',
      ],
      buttonText: 'Upgrade to Pro',
      buttonLink: '/register',
      isPopular: true,
    },
    {
      name: 'Agent / HR Portal',
      price: '₹1,199',
      period: 'month',
      desc: 'For insurance brokers and corporate HR teams.',
      features: [
        'White-label portal configuration',
        'Agency profile setup (Logo, Email, Phone)',
        'Hex brand color customizer',
        'Secure public shared client links',
        'Employee benefits portal & QA chat tool',
      ],
      buttonText: 'Start Business Plan',
      buttonLink: '/register',
      isPopular: false,
    },
  ];

  return (
    <section className="py-20 px-4" style={{ backgroundColor: 'var(--bg-card-2)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-extrabold text-primary-theme">Competitive, Simple Plans</h2>
          <p className="text-muted-theme mt-2 max-w-xl mx-auto text-sm">
            Pricing designed to cover computational and Gemini API resource costs while keeping it affordable.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`smooth-card rounded-2xl p-8 border flex flex-col justify-between relative ${
                plan.isPopular ? 'border-primary-500 shadow-lg shadow-primary-500/5' : ''
              }`}
              style={{ backgroundColor: 'var(--bg-card)', borderColor: plan.isPopular ? 'var(--primary-500)' : 'var(--border)' }}
            >
              {plan.isPopular && (
                <span className="absolute top-0 right-6 -translate-y-1/2 bg-primary-600 text-white text-[10px] uppercase font-extrabold px-3 py-1 rounded-full tracking-wider">
                  Most Popular
                </span>
              )}
              
              <div>
                <h3 className="text-lg font-bold text-primary-theme">{plan.name}</h3>
                <p className="text-xs text-subtle-theme mt-1">{plan.desc}</p>
                
                <div className="my-6 flex items-baseline space-x-1">
                  <span className="text-4xl font-extrabold text-primary-theme">{plan.price}</span>
                  <span className="text-xs text-muted-theme">/ {plan.period}</span>
                </div>

                <ul className="space-y-3.5 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-2.5 text-xs text-muted-theme">
                      <HiCheckCircle className="h-4.5 w-4.5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={plan.buttonLink}
                className={`smooth-btn w-full text-center py-3 rounded-xl text-xs font-bold ${
                  plan.isPopular
                    ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-md hover:shadow-lg'
                    : 'border text-muted-theme hover:text-primary-theme hover:bg-dark-100/5'
                }`}
                style={!plan.isPopular ? { borderColor: 'var(--border-input)' } : {}}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
