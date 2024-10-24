//import Image from "next/image";
//import { Button } from "@nextui-org/react";
import { FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
Link;
import { SiVite } from "react-icons/si";

export default function Home() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative flex h-[80vh] w-full items-center justify-center">
        {/* pattern */}
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#5CC90C,transparent_1px),linear-gradient(to_bottom,#5CC90C,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_60%_0%,#000_80%,transparent_110%)]" />
        <nav
          className="fixed left-1/2 top-4 z-40 w-[90%] max-w-[1200px] -translate-x-1/2 
  rounded-3xl border-2 border-[#42393962] px-4 py-3 backdrop-blur-sm backdrop-saturate-150 
  bg-white md:px-8 md:py-4"
        >
          <header className="flex w-full items-center justify-between">
            <img src="/st-logo.png" alt="logo" width={120} height={35} />

            <div className="flex gap-2 md:gap-4 items-center">
              <Link to="/sign-in">
                <button className="font-medium min-w-[80px] text-sm md:min-w-[100px] md:text-base p-2 rounded-lg text-primary hover:bg-zinc-200">
                  Sign in
                </button>
              </Link>
              <Link to="/sign-up">
                <button className="p-2 text-sm md:text-base font-medium text-white bg-primary hover:bg-[#5bc90ce6] rounded-lg min-w-[85px] md:min-w-[120px]">
                  Create an account
                </button>
              </Link>
            </div>
          </header>
        </nav>

        {/* Hero Section Container */}
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
          {/* <p className="mt-4 text-center text-[#ECEDEE]/80">
            Tech tales to tell,{" "}
            <span className="font-semibold text-white">code diaries</span> to
            swell.{" "}
            <span className="font-semibold text-white">Blog your tech</span>,
            let your code story excel.
          </p> */}
        </div>
      </section>

      <section className="relative flex w-full justify-center py-[4rem]">
        <div className="absolute right-0 top-0 z-0 h-[350px] w-[300px] rounded-bl-[8rem] rounded-tl-[8rem] bg-white/10 backdrop-blur-lg border border-white/20 md:h-[500px] md:w-[450px]" />
        <div className="absolute -bottom-10 -left-[18rem] z-0 h-[500px] w-[500px] rounded-full bg-white/10 backdrop-blur-lg border border-white/20 md:h-[600px] md:w-[600px]" />

        {/* 2nd Section Container */}
        <div className=" w-[90%] max-w-[1200px]">
          {/* Cards Container */}
          <div className="flex w-full flex-wrap items-center justify-center gap-4">
            <div className="relative h-[140px] w-full overflow-hidden rounded-xl bg-[#F5F5F5] shadow-sm hover:shadow-md transition-shadow duration-200 md:h-[160px] md:w-[40%] lg:w-[30%]">
              <p className="absolute -bottom-2 -right-[1rem] z-0 -rotate-45 text-[5rem] text-[#D3D3D3]">
                <FiUser />
              </p>

              <div className="absolute left-5 top-5 z-20 h-full w-[90%] space-y-1 ">
                <p className="text-[1.1rem] font-bold text-[#3B3F3F]">
                  Estepano
                </p>
                <p className="text-sm leading-7 text-[#6D6D6D]">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum
                  non tempora vero! Aliquid soluta.
                </p>
              </div>
            </div>
            <div className="relative h-[140px] w-full overflow-hidden rounded-xl bg-[#F5F5F5] shadow-sm hover:shadow-md transition-shadow duration-200 md:h-[160px] md:w-[40%] lg:w-[30%]">
              <p className="absolute -bottom-2 -right-[1rem] z-0 -rotate-45 text-[5rem] text-[#D3D3D3]">
                <FiUser />
              </p>

              <div className="absolute left-5 top-5 z-20 h-full w-[90%] space-y-1 ">
                <p className="text-[1.1rem] font-bold text-[#3B3F3F]">
                  Estepano
                </p>
                <p className="text-sm leading-7 text-[#6D6D6D]">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum
                  non tempora vero! Aliquid soluta.
                </p>
              </div>
            </div>
            <div className="relative h-[140px] w-full overflow-hidden rounded-xl bg-[#F5F5F5] shadow-sm hover:shadow-md transition-shadow duration-200 md:h-[160px] md:w-[40%] lg:w-[30%]">
              <p className="absolute -bottom-2 -right-[1rem] z-0 -rotate-45 text-[5rem] text-[#D3D3D3]">
                <FiUser />
              </p>

              <div className="absolute left-5 top-5 z-20 h-full w-[90%] space-y-1 ">
                <p className="text-[1.1rem] font-bold text-[#3B3F3F]">
                  sunno_my_boi
                </p>
                <p className="text-sm leading-7 text-[#6D6D6D]">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum
                  non tempora vero! Aliquid soluta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="h-[500px]"></section>

      <footer className="w-full">
        <div className="pt-12 pb-4 flex flex-col gap-8">
          <div className="text-textMuted/70 text-sm md:text-base grid gap-2 place-items-center">
            <p> Design and Built by Stefano San Esteban</p>
            <p>Powered by</p>
            <SiVite className="size-8 text-primary" />
          </div>
          <p className="text-sm text-textMuted/60 md:text-left text-center">
            This wep app is still under testing
          </p>
        </div>
      </footer>
    </main>
  );
}
