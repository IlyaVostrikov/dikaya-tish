import HeroSection from "@/components/sections/HeroSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import FermentationPath from "@/components/sections/FermentationPath";
import GongFuChaSection from "@/components/sections/GongFuChaSection";
import CatalogSection from "@/components/sections/CatalogSection";
import CountriesSection from "@/components/sections/CountriesSection";
import CreatorSection from "@/components/sections/CreatorSection";
import ContactSection from "@/components/sections/ContactSection";
import FooterSection from "@/components/sections/FooterSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <PhilosophySection />
      <FermentationPath />
      <GongFuChaSection />
      <CatalogSection />
      <CountriesSection />
      <CreatorSection />
      <ContactSection />
      <FooterSection />
    </main>
  );
}
