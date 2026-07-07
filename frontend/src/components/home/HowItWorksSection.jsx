// frontend/src/components/home/HowItWorksSection.jsx

const HowItWorksSection = () => {
  const steps = [
    {
      title: 'Upload Your Policy',
      description: 'Drag and drop your insurance policy booklet as a PDF, scanned file, or smartphone photo. We support files up to 20MB.',
    },
    {
      title: 'Instant AI Simplification',
      description: 'Our advanced Gemini AI reads through the complex legal booklet and extracts deductibles, exclusions, and warnings into simple terms.',
    },
    {
      title: 'Action & Appeal',
      description: 'Compare multiple quotes side-by-side, verify coverages, or use the Appeals Co-Pilot to generate appeal letters if a claim is rejected.',
    },
  ];

  return (
    <section className="py-20 px-4" style={{ backgroundColor: 'var(--bg-card-2)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-extrabold text-primary-theme">How It Works</h2>
          <p className="text-muted-theme mt-2 max-w-xl mx-auto text-sm">
            Three simple steps to translate policy jargon into clear, actionable overviews.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="smooth-card rounded-2xl p-8 border flex flex-col justify-between"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary-500/15 text-primary-500 font-extrabold flex items-center justify-center mb-6 text-sm">
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold mb-3 text-primary-theme">{step.title}</h3>
                <p className="text-xs leading-relaxed text-muted-theme">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
