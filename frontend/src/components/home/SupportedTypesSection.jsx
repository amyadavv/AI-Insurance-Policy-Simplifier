// frontend/src/components/home/SupportedTypesSection.jsx

const SupportedTypesSection = () => {
  const insuranceTypes = [
    { name: 'Health Insurance', icon: '🏥', desc: 'Medical coverages, specialist copays, and exclusions.' },
    { name: 'Auto Insurance', icon: '🚗', desc: 'Collision, liability limits, and deductibles.' },
    { name: 'Home & Property', icon: '🏠', desc: 'Natural disaster rules, structural coverage, and theft clauses.' },
    { name: 'Life Insurance', icon: '🌱', desc: 'Term limits, beneficiary guidelines, and exceptions.' },
    { name: 'Travel & Medical', icon: '✈️', desc: 'Trip cancellations, emergency assistance, and baggage loss.' },
    { name: 'Pet Insurance', icon: '🐾', desc: 'Veterinary limits, pre-existing conditions, and illness copays.' },
    { name: 'Dental & Vision', icon: '🦷', desc: 'Annual checkups, orthodontics, and glasses allowances.' },
    { name: 'Corporate Benefits', icon: '🏢', desc: 'Group insurance packages and employer sponsored plans.' },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-extrabold text-primary-theme">Supported Insurance Policies</h2>
          <p className="text-muted-theme mt-2 max-w-xl mx-auto text-sm">
            We process and simplify documents across all categories. Upload any policy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {insuranceTypes.map((type, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border bg-gradient-to-b hover:shadow-md transition-all space-y-3"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div className="text-3xl">{type.icon}</div>
              <h3 className="font-bold text-primary-theme text-sm leading-tight">{type.name}</h3>
              <p className="text-[11px] text-muted-theme leading-relaxed">{type.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportedTypesSection;
