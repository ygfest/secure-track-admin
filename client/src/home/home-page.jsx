import { Link } from "react-router-dom";
import FlowOfCards from "./components/FlowOfCards";
import HelpCarousel from "./components/HelpCarousel";
import VideoDemo from "./components/VideoDemo";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="bg-white font-poppins">
      {/* Hero Section */}
      <section className="relative flex h-[80vh] w-full items-center justify-center min-w-[400px]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#5CC90C,transparent_1px),linear-gradient(to_bottom,#5CC90C,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_60%_0%,#000_80%,transparent_110%)]" />
        <nav className="fixed left-1/2 top-4 z-40 w-[90%] max-w-[1200px] -translate-x-1/2 rounded-3xl border-2 border-[#42393962] px-4 py-3 backdrop-blur-sm backdrop-saturate-150 bg-white md:px-8 md:py-4">
          <header className="flex w-full items-center justify-between">
            <img src="/st-logo.png" alt="logo" width={120} height={35} />
            <div className="flex gap-1 md:gap-4 items-center">
              <Link to="/sign-in">
                <button className="font-medium min-w-[60px] text-sm md:min-w-[100px] md:text-base p-2 rounded-lg text-primary hover:bg-zinc-200 flex-nowrap">
                  Sign in
                </button>
              </Link>
              <Link to="/sign-up">
                <button className="hidden md:inline p-2 text-sm md:text-base font-medium text-white bg-secondary hover:bg-zinc-600 rounded-lg min-w-[150px] md:min-w-[120px] flex-nowrap">
                  Create an account
                </button>
                <button className="md:hidden p-2 text-sm md:text-base font-medium text-white bg-secondary hover:bg-zinc-600 rounded-lg min-w-[120px] md:min-w-[120px] flex-nowrap">
                  Create account
                </button>
              </Link>
            </div>
          </header>
        </nav>
        <div className="z-30 w-[90%] max-w-[1200px] pt-4">
          <h1 className="text-center text-[2.3rem] font-bold leading-tight md:text-[3.2rem] md:leading-none lg:text-[4rem] 2xl:text-[4.5rem]">
            <span className="text-black">
              Your Luggage, Monitored, Tracked,
            </span>
            <br />
            <span className="bg-gradient-to-b from-[#32CD32] to-[#2E8B57] bg-clip-text text-transparent">
              and Secured, Wherever You Go.
            </span>
          </h1>
        </div>
      </section>

      {/*<section className="relative mt-36 flex flex-col items-center min-w-[400px]">
        <p>Logos...</p>
        <div className="h-[32px] w-full flex justify-center">
          <img src="/ST-logo-with-name.png" className="h-full" />
        </div>
      </section>*/}

      {/* Flow of Cards Section */}
      <FlowOfCards />
      <HelpCarousel />
      <VideoDemo />
      <Footer />
    </main>
  );
}
