import { useRef, useEffect } from "react";

function FlowOfCards() {
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
          <div className="w-full space-y-4 text-start">
            <h3 className="text-2xl font-semibold text-secondary">
              Real-time Location Tracking
            </h3>
            <p className="text-base text-gray-600">
              Never lose sight of your belongings. SecureTrack’s advanced GPS
              tracking keeps you updated on your luggage’s exact location,
              whether it’s en route to your destination or waiting at the
              terminal.
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
          <div className="w-full space-y-4 text-start">
            <h3 className="text-2xl font-semibold text-secondary">
              Intrusion Monitoring
            </h3>
            <p className="text-base text-gray-600">
              Protect your valuables from unauthorized access. SecureTrack’s
              smart sensors instantly alert you if tampering or forced entry is
              detected, ensuring your peace of mind.
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
          <div className="w-full space-y-4 text-start">
            <h3 className="text-2xl font-semibold text-secondary">
              Fall Detection
            </h3>
            <p className="text-base text-gray-600">
              Shield your belongings from unexpected impacts. SecureTrack
              detects sudden drops or rough handling, notifying you in real-time
              about potential damage risks.
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
          <div className="w-full space-y-4 text-start">
            <h3 className="text-2xl font-semibold text-secondary">
              Temperature Monitoring
            </h3>
            <p className="text-base text-gray-600">
              Keep delicate items safe. From perishable goods to sensitive
              electronics, SecureTrack monitors temperature changes, so you can
              act swiftly if conditions become unsuitable.
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
          <div className="w-full space-y-4 text-start">
            <h3 className="text-2xl font-semibold text-secondary">
              Geofencing
            </h3>
            <p className="text-base text-gray-600">
              Define safety zones for your luggage. Receive instant alerts if
              your belongings move outside your designated boundaries—perfect
              for crowded terminals or layovers.
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
          <div className="w-full space-y-4 text-start">
            <h3 className="text-2xl font-semibold text-secondary">
              Reporting Feature
            </h3>
            <p className="text-base text-gray-600">
              Easily report device or software issues to developers and
              administrators for swift resolutions, ensuring reliable luggage
              monitoring.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FlowOfCards;
