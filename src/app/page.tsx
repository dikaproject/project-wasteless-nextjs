// page.tsx
import Navbar from '@/components/common/navbar';
import HeroSection from '@/components/hero-section';
import AboutSection from '@/components/about-section';
import HowToOrder from '@/components/how-to-order';
import TestimonialSection from '@/components/testimonial-section';
import Footer from '@/components/common/footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
        <AboutSection />
      <HowToOrder />
      <TestimonialSection />
      <Footer />
    </main>
  );
}