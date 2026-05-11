import { Hero } from "../components/Hero";
import { ChapterTwo } from "../components/ChapterTwo";
import { ProductShowcase } from "../components/ProductShowcase";
import { Testimonials } from "../components/Testimonials";
import { ArtisanSpotlight } from "../components/ArtisanSpotlight";
import { JournalPreview } from "../components/JournalPreview";
import { Newsletter } from "../components/Newsletter";
import { ChapterThree } from "../components/ChapterThree";

export function LandingPageView() {
  return (
    <div className="pt-20">
      <Hero />
      <ChapterTwo />
      <ProductShowcase />
      <Testimonials />
      <ArtisanSpotlight />
      <JournalPreview />
      <Newsletter />
      <ChapterThree />
    </div>
  );
}
