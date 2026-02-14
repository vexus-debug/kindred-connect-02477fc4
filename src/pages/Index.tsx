import { Layout } from "@/components/layout";
import {
  HeroSection,
  AboutPreviewSection,
  WhyChooseUsSection,
  ServicesSection,
  TreatmentProcessSection,
  ValentinePromoSection,
  TestimonialsSection,
  FAQSection,
  LocationSection,
  CTASection,
} from "@/components/home";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section - WOW Factor with animated word rotation, floating elements */}
      <HeroSection />

      {/* About Preview - Trust Builder with animated counters */}
      <AboutPreviewSection />

      {/* NEW: Why Choose Us - Feature cards with hover effects */}
      <WhyChooseUsSection />

      {/* Services - Interactive showcase with stock images */}
      <ServicesSection />

      {/* NEW: Treatment Process - Animated timeline */}
      <TreatmentProcessSection />

      {/* Valentine Promo - Countdown timer, floating hearts */}
      <ValentinePromoSection />

      {/* Testimonials - Auto-playing carousel */}
      <TestimonialsSection />

      {/* NEW: FAQ Accordion - Expandable questions */}
      <FAQSection />

      {/* Location - Enhanced map, contact cards, Instagram preview */}
      <LocationSection />

      {/* CTA Section - Animated gradient, urgency messaging */}
      <CTASection />
    </Layout>
  );
};

export default Index;
