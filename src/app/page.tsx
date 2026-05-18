import HeroSection from "@/components/sections/HeroSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import FermentationPath from "@/components/sections/FermentationPath";
import CatalogSection from "@/components/sections/CatalogSection";
import CountriesSection from "@/components/sections/CountriesSection";
import FooterSection from "@/components/sections/FooterSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <PhilosophySection />
      <FermentationPath />
      <CatalogSection />
      <CountriesSection />
      <FooterSection />
    </main>
  );
}
