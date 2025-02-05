import React from "react";
import { SiVite } from "react-icons/si";

function Footer() {
  return (
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
                src="/ST-with-name.svg"
                className="h-24 w-24 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                alt="SecureTrack Logo"
              />
            </a>
          </div>
        </div>

        {/* Researchers Section */}
        <div className="text-sm md:text-base flex flex-col items-start gap-4">
          <p className="font-normal">
            RESEARCHERS <br />
            <a className="text-gray-400 font-light hover:text-primary transition-colors">
              Blanquisco, John Christopher
            </a>
            <br />
            <a className="text-gray-400 font-light hover:text-primary transition-colors">
              dela Pena, Scavenger
            </a>
            <br />
            <a
              href="https://www.instagram.com/__sstefano/"
              className="text-gray-400 font-light hover:text-primary transition-colors"
            >
              San Esteban, Stefano
            </a>
          </p>
          <div>
            <p>ADVISER</p>
            <p className="text-gray-400 font-light hover:text-primary transition-colors">
              Dr. Glenn Arwin Bristol
            </p>
          </div>
        </div>

        {/* Research Coordinator and Panel Section */}
        <div className="text-sm md:text-base flex flex-col items-start gap-4">
          <p className="font-normal">
            RESEARCH COORDINATOR <br />
            <a
              href="https://www.instagram.com/__sstefano/"
              className="text-gray-400 font-light hover:text-primary transition-colors"
            >
              Asst. Prof. Mary Ann Aballiar-Vista
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
              <img src="/ST.svg" alt="ST logo" className="h-6 opacity-69" />
              efano San Esteban
            </a>
          </p>
          <div className="flex items-center gap-2">
            <p>POWERED BY</p>
            <SiVite className="text-primary hover:text-primary text-3xl transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
