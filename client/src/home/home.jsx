import { useEffect, useRef } from "react";
import { FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import { SiVite } from "react-icons/si";

export default function Home() {
  const cardsRef = useRef([]);

  // Apply fade-in animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      },
      { threshold: 0.3 }
    );

    cardsRef.current.forEach((card) => observer.observe(card));
    return () => cardsRef.current.forEach((card) => observer.unobserve(card));
  }, []);

  const features = [
    { title: "Real-time Location Tracking", image: "/location.svg" },
    { title: "Intrusion Monitoring", image: "/intrusion.svg" },
    { title: "Fall Detection", image: "/fall.svg" },
    { title: "Temperature Monitoring", image: "/temp.svg" },
    { title: "Geofencing", image: "/geofence.svg" },
    { title: "Reporting Feature", image: "/reporting.svg" },
  ];

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

      {/* Flow of Cards Section */}
      <section className="relative flex flex-col items-center py-16 min-w-[400px]">
        <div className="w-[90%] max-w-[1200px] space-y-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              ref={(el) => (cardsRef.current[idx] = el)}
              className={`flex items-center justify-between gap-8 p-6 h-[380px] rounded-lg shadow-md bg-light-gray ${
                idx % 2 === 0 ? "flex-row" : "flex-row-reverse"
              } flex-wrap md:flex-nowrap`} // Added flex-wrap for responsiveness
            >
              <div className="w-full md:w-1/2 flex justify-center items-center">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full max-w-[500px] h-auto object-cover"
                />
              </div>
              <div className="w-full md:w-1/2 space-y-2 text-left mt-4 md:mt-0">
                <h3 className="text-lg font-bold text-secondary">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam scelerisque aliquam odio et faucibus.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Other Sections */}
      <section className="h-[500px]"></section>
      <footer className="w-full min-w-[400px] py-8 text-center">
        <div className="pt-12 pb-4 flex flex-col gap-8">
          <div className="text-textMuted/70 text-sm md:text-base grid gap-2 place-items-center">
            <p>Built by Stefano San Esteban</p>
            <p>Powered by</p>
            <SiVite className="size-8 text-primary" />
          </div>
          <p className="text-sm text-textMuted/60 md:text-left text-center">
            This web app is still under testing
          </p>
        </div>
      </footer>
    </main>
  );
}
