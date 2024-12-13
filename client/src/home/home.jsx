import { useEffect, useRef, useState } from "react";
import { FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import { SiVite } from "react-icons/si";
import { FiHelpCircle } from "react-icons/fi";
import { MdNavigateNext } from "react-icons/md";

export default function Home() {
  // Initialize an array of refs for each card.
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const toggleHelpModal = () => setShowHelpModal(!showHelpModal);

  return (
    <main className="bg-white font-poppins">
      {/* Hero Section */}
      <section className="relative flex h-[80vh] w-full items-center justify-center min-w-[400px]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#8f00ff,transparent_1px),linear-gradient(to_bottom,#8f00ff,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_60%_0%,#000_80%,transparent_110%)]" />
        <nav className="fixed left-1/2 top-4 z-40 w-[90%] max-w-[1200px] -translate-x-1/2 rounded-3xl border-2 border-[#42393962] px-4 py-3 backdrop-blur-sm backdrop-saturate-150 bg-white md:px-8 md:py-4">
          <header className="flex w-full items-center justify-between">
            <img src="/OP.svg" alt="logo" width={80} height={10} />
            <div className="flex gap-1 md:gap-4 items-center">
              <a href="https://miaa-1-wayfinder.web.app/index.html">
                <button className="hidden md:inline p-2 text-sm md:text-base font-medium text-white bg-primary hover:bg-zinc-600 rounded-lg min-w-[150px] md:min-w-[120px] flex-nowrap">
                  Try the Map
                </button>
                <button className="md:hidden p-2 text-sm md:text-base font-medium text-white bg-primary hover:bg-zinc-600 rounded-lg min-w-[120px] md:min-w-[120px] flex-nowrap">
                  Try the Map
                </button>
              </a>
            </div>
          </header>
        </nav>
        <div className="z-30 w-[90%] max-w-[1200px] pt-4">
          <h1 className="text-center text-[2.3rem] font-bold leading-tight md:text-[3.2rem] md:leading-none lg:text-[4rem] 2xl:text-[4.5rem]">
            <span className="text-black">
              Your Ultimate Guide to Navigating
            </span>
            <br />
            <span
              className="bg-gradient-to-b from-[#8f00ff] to-[#6a0dad]
 bg-clip-text text-transparent"
            >
              NAIA Terminal 1, Effortlessly.
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
                src="/op1.svg"
                alt="Real-time Location Tracking"
                className="w-full max-w-[500px] h-auto object-cover rounded-md"
              />
            </div>
            <div className="w-full space-y-4 text-start">
              <h3 className="text-2xl font-semibold text-secondary">
                Facilities Locator
              </h3>
              <p className="text-base text-gray-600">
                Easily find airport amenities like lounges, restrooms, and ATMs.
                OnePath ensures you never miss essential services within NAIA
                Terminal 1.
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
                src="/op2.svg"
                alt="Intrusion Monitoring"
                className="w-full max-w-[500px] h-auto object-cover rounded-md"
              />
            </div>
            <div className="w-full space-y-4 text-start">
              <h3 className="text-2xl font-semibold text-secondary">
                Restaurants and Shops Guide
              </h3>
              <p className="text-base text-gray-600">
                Explore dining options and retail stores. OnePath helps you
                locate the best restaurants and shops tailored to your
                preferences.
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
                src="/op3.svg"
                alt="Fall Detection"
                className="w-full max-w-[500px] h-auto object-cover rounded-md"
              />
            </div>
            <div className="w-full space-y-4 text-start">
              <h3 className="text-2xl font-semibold text-secondary">
                Interactive Navigation
              </h3>
              <p className="text-base text-gray-600">
                Navigate Terminal 1 with ease. OnePath's interactive map guides
                you to your destination, saving time and avoiding confusion.
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
                src="/op4.svg"
                alt="Temperature Monitoring"
                className="w-full max-w-[500px] h-auto object-cover rounded-md"
              />
            </div>
            <div className="w-full space-y-4 text-start">
              <h3 className="text-2xl font-semibold text-secondary">
                Essential Services Finder
              </h3>
              <p className="text-base text-gray-600">
                Locate important services such as information desks, baggage
                counters, and medical stations to make your airport experience
                smooth and stress-free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Other Sections */}
      <section className="h-[500px] min-w-[400px]"></section>

      <footer className="w-full min-w-[400px] py-8 text-left bg-secondary text-white">
        <div className="flex flex-wrap justify-between gap-8 h-auto px-4">
          {/* Logos Section */}
          <div className="flex flex-row justify-center w-full md:w-auto  gap-6">
            <div className="flex flex-wrap items-center justify-start gap-6">
              <a
                href="https://www.philsca.edu.ph/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/PhilSCA-Official-Logo.png"
                  className="h-24 w-24 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                  alt="PhilSCA Logo"
                />
              </a>
              <a
                href="https://www.philsca.edu.ph/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/ics.svg"
                  className="h-24 w-24 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                  alt="ICS Logo"
                />
              </a>
              <a
                href="https://secure-track-est.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/OP.svg"
                  className="h-24 w-24 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                  alt="SecureTrack Logo"
                />
              </a>
            </div>
          </div>

          {/* Researchers Section */}
          <div className="text-sm md:text-base flex flex-col items-start gap-4">
            <p className="font-normal">
              Group Members <br />
              <a className="text-gray-400 font-light hover:text-primary transition-colors">
                Diacosta, Andrie
              </a>
              <br />
              <a
                href="https://www.instagram.com/__sstefano/"
                className="text-gray-400 font-light hover:text-primary transition-colors"
              >
                San Esteban, Stefano
              </a>
              <br />
              <a className="text-gray-400 font-light hover:text-primary transition-colors">
                Casil, Joemar
              </a>
              <br />
              <a className="text-gray-400 font-light hover:text-primary transition-colors">
                Penaredondo, Justin R.
              </a>
              <br />
              <a className="text-gray-400 font-light hover:text-primary transition-colors">
                Soriano, Joshua
              </a>
              <br />
              <a className="text-gray-400 font-light hover:text-primary transition-colors">
                Monteverde, Regie Keano
              </a>
              <br />
              <br />
            </p>
          </div>

          {/* Research Coordinator and Panel Section */}
          <div className="text-sm md:text-base flex flex-col items-start gap-4">
            <p className="font-normal">
              COURSE INSTRUCTOR <br />
              <a
                href="https://www.instagram.com/__sstefano/"
                className="text-gray-400 font-light hover:text-primary transition-colors"
              >
                Ms. Ruth Cacho
              </a>
            </p>
          </div>

          {/* Built By and Powered By Section */}
          <div className="text-sm md:text-base flex flex-col items-start gap-4">
            <p className="font-normal">
              BUILT BY <br />
              <a
                href="https://www.instagram.com/__sstefano/"
                className="text-gray-400 font-light hover:text-primary transition-colors flex items-center"
              >
                Stefano San Esteban
              </a>
            </p>
            <div className="flex items-center gap-2">
              <p>POWERED BY</p>
              <SiVite className="text-primary hover:text-primary text-3xl transition-colors" />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
