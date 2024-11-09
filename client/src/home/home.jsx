import { useEffect, useRef } from "react";
import { FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import { SiVite } from "react-icons/si";

export default function Home() {
  // Initialize an array of refs for each card.
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

    // Ensure all refs are elements before observing
    cardsRef.current.forEach((card) => {
      if (card) {
        observer.observe(card);
      }
    });

    return () => {
      cardsRef.current.forEach((card) => {
        if (card) {
          observer.unobserve(card);
        }
      });
    };
  }, []); // Empty dependency array ensures it runs only once on mount.

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
      <section className="relative mt-36 flex flex-col items-center min-w-[400px]">
        <div className="w-[90%] max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Card 1 - Real-time Location Tracking */}
          <div
            ref={(el) => (cardsRef.current[0] = el)}
            className="relative flex flex-col items-center p-8 rounded-3xl shadow-lg bg-gradient-to-r from-[#F3F4F6] to-[#E5E7EB] self-start transform -translate-y-12 h-[540px] md:mt-[60px]"
          >
            <div className="w-full flex justify-center items-center mb-6">
              <img
                src="/location.svg"
                alt="Real-time Location Tracking"
                className="w-full max-w-[500px] h-auto object-cover rounded-md"
              />
            </div>
            <div className="w-full space-y-4 text-center">
              <h3 className="text-2xl font-semibold text-secondary">
                Real-time Location Tracking
              </h3>
              <p className="text-base text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                scelerisque aliquam odio et faucibus.
              </p>
            </div>
          </div>

          {/* Card 2 - Intrusion Monitoring */}
          <div
            ref={(el) => (cardsRef.current[1] = el)}
            className="relative flex flex-col items-center p-8 rounded-3xl shadow-lg bg-gradient-to-r from-[#F3F4F6] to-[#E5E7EB] self-end transform translate-y-12 h-[540px] md:mt-[240px]"
          >
            <div className="w-full flex justify-center items-center mb-6">
              <img
                src="/intrusion.svg"
                alt="Intrusion Monitoring"
                className="w-full max-w-[500px] h-auto object-cover rounded-md"
              />
            </div>
            <div className="w-full space-y-4 text-center">
              <h3 className="text-2xl font-semibold text-secondary">
                Intrusion Monitoring
              </h3>
              <p className="text-base text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                scelerisque aliquam odio et faucibus.
              </p>
            </div>
          </div>

          {/* Card 3 - Fall Detection */}
          <div
            ref={(el) => (cardsRef.current[2] = el)}
            className="relative flex flex-col items-center p-8 rounded-3xl shadow-lg bg-gradient-to-r from-[#F3F4F6] to-[#E5E7EB] self-start transform -translate-y-12 h-[540px] md:mt-[-180px]"
          >
            <div className="w-full flex justify-center items-center mb-6">
              <img
                src="/fall.svg"
                alt="Fall Detection"
                className="w-full max-w-[500px] h-auto object-cover rounded-md"
              />
            </div>
            <div className="w-full space-y-4 text-center">
              <h3 className="text-2xl font-semibold text-secondary">
                Fall Detection
              </h3>
              <p className="text-base text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                scelerisque aliquam odio et faucibus.
              </p>
            </div>
          </div>

          {/* Card 4 - Temperature Monitoring */}
          <div
            ref={(el) => (cardsRef.current[3] = el)}
            className="relative flex flex-col items-center p-8 rounded-3xl shadow-lg bg-gradient-to-r from-[#F3F4F6] to-[#E5E7EB] self-end transform translate-y-12 h-[540px] "
          >
            <div className="w-full flex justify-center items-center mb-6">
              <img
                src="/temp.svg"
                alt="Temperature Monitoring"
                className="w-full max-w-[500px] h-auto object-cover rounded-md"
              />
            </div>
            <div className="w-full space-y-4 text-center">
              <h3 className="text-2xl font-semibold text-secondary">
                Temperature Monitoring
              </h3>
              <p className="text-base text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                scelerisque aliquam odio et faucibus.
              </p>
            </div>
          </div>

          {/* Card 5 - Geofencing */}
          <div
            ref={(el) => (cardsRef.current[4] = el)}
            className="relative flex flex-col items-center p-8 rounded-3xl shadow-lg bg-gradient-to-r from-[#F3F4F6] to-[#E5E7EB] self-start transform -translate-y-12 h-[540px] md:mt-[-180px]"
          >
            <div className="w-full flex justify-center items-center mb-6">
              <img
                src="/geofence.svg"
                alt="Geofencing"
                className="w-full max-w-[500px] h-auto object-cover rounded-md"
              />
            </div>
            <div className="w-full space-y-4 text-center">
              <h3 className="text-2xl font-semibold text-secondary">
                Geofencing
              </h3>
              <p className="text-base text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                scelerisque aliquam odio et faucibus.
              </p>
            </div>
          </div>

          {/* Card 6 - Reporting Feature */}
          <div
            ref={(el) => (cardsRef.current[5] = el)}
            className="relative flex flex-col items-center p-8 rounded-3xl shadow-lg bg-gradient-to-r from-[#F3F4F6] to-[#E5E7EB] self-end transform translate-y-12 h-[540px]"
          >
            <div className="w-full flex justify-center items-center mb-6">
              <img
                src="/reporting.svg"
                alt="Reporting Feature"
                className="w-full max-w-[400px] h-auto object-cover rounded-md"
              />
            </div>
            <div className="w-full space-y-4 text-center">
              <h3 className="text-2xl font-semibold text-secondary">
                Reporting Feature
              </h3>
              <p className="text-base text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                scelerisque aliquam odio et faucibus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Other Sections */}
      <section className="h-[500px] min-w-[400px]"></section>

      <footer className="w-full min-w-[400px] py-8 text-center">
        <div className="pt-12 pb-4 flex flex-col gap-8">
          <div className="text-textMuted/70 text-sm md:text-base grid gap-2 place-items-center">
            <p>
              Built by{" "}
              <a href="https://www.instagram.com/__sstefano/">
                <span className="font-semibold"> Stefano San Esteban</span>
              </a>
            </p>
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
