import FlowOfCards from "./components/FlowOfCards";
import HelpCarousel from "./components/HelpCarousel";
import VideoDemo from "./components/VideoDemo";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";

export default function Home() {
  return (
    <main className="bg-white font-poppins">
      <HeroSection />
      <FlowOfCards />
      <HelpCarousel />
      <VideoDemo />
      <Footer />
    </main>
  );
}
