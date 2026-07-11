// frontend/src/components/home/SupportedTypesSection.jsx
import ScrollReveal from '../common/ScrollReveal';
import {
  HiOutlineHeart,
  HiOutlineShieldCheck,
  HiOutlineHome,
  HiOutlineUser,
  HiOutlinePaperAirplane,
  HiOutlineSparkles,
  HiOutlineEye,
  HiOutlineBriefcase
} from 'react-icons/hi';

const SupportedTypesSection = () => {
  const insuranceTypes = [
    { name: 'Health Insurance', icon: <HiOutlineHeart className="h-6 w-6 text-red-500" />, desc: 'Medical coverages, specialist copays, and exclusions.' },
    { name: 'Auto Insurance', icon: <HiOutlineShieldCheck className="h-6 w-6 text-blue-500" />, desc: 'Collision, liability limits, and deductibles.' },
    { name: 'Home & Property', icon: <HiOutlineHome className="h-6 w-6 text-amber-600" />, desc: 'Natural disaster rules, structural coverage, and theft clauses.' },
    { name: 'Life Insurance', icon: <HiOutlineUser className="h-6 w-6 text-green-500" />, desc: 'Term limits, beneficiary guidelines, and exceptions.' },
    { name: 'Travel & Medical', icon: <HiOutlinePaperAirplane className="h-6 w-6 text-indigo-500" />, desc: 'Trip cancellations, emergency assistance, and baggage loss.' },
    { name: 'Pet Insurance', icon: <HiOutlineSparkles className="h-6 w-6 text-purple-500" />, desc: 'Veterinary limits, pre-existing conditions, and illness copays.' },
    { name: 'Dental & Vision', icon: <HiOutlineEye className="h-6 w-6 text-teal-500" />, desc: 'Annual checkups, orthodontics, and glasses allowances.' },
    { name: 'Corporate Benefits', icon: <HiOutlineBriefcase className="h-6 w-6 text-cyan-600" />, desc: 'Group insurance packages and employer sponsored plans.' },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-primary-theme">Supported Insurance Policies</h2>
            <p className="text-muted-theme mt-2 max-w-xl mx-auto text-base">
              We process and simplify documents across all categories. Upload any policy.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {insuranceTypes.map((type, idx) => (
            <ScrollReveal
              key={idx}
              animation="fade-up"
              delay={idx * 50}
              className="flex"
            >
              <div
                className="smooth-card p-6 rounded-2xl border hover:shadow-lg transition-all space-y-4 w-full group cursor-pointer"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
              >
                <div className="w-12 h-12 rounded-xl bg-dark-100/5 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {type.icon}
                </div>
                <h3 className="font-bold text-primary-theme text-base leading-tight group-hover:text-primary-500 transition-colors">{type.name}</h3>
                <p className="text-sm text-muted-theme leading-relaxed">{type.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportedTypesSection;
