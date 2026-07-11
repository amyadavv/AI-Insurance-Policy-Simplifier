// frontend/src/pages/HomePage.jsx
import HeroSection from '../components/home/HeroSection';
import WhatWeDoSection from '../components/home/WhatWeDoSection';
import WhyChooseUsSection from '../components/home/WhyChooseUsSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import SupportedTypesSection from '../components/home/SupportedTypesSection';
import PricingSection from '../components/home/PricingSection';
import FaqSection from '../components/home/FaqSection';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-page text-primary-theme pb-20">
      <HeroSection />
      <WhatWeDoSection />
      <WhyChooseUsSection />
      <HowItWorksSection />
      <SupportedTypesSection />
      <PricingSection />
      <FaqSection />
    </div>
  );
};

export default HomePage;
