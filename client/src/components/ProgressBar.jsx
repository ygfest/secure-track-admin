import React, { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // Default nprogress styles (for spinner, etc.)

function ProgressBar() {
  useEffect(() => {
    // Custom template for progress bar using Tailwind CSS
    NProgress.configure({
      showSpinner: false,
      // Ensure proper structure: an outer 'nprogress' div and an inner 'bar' div
      template: `
        <div class="nprogress-bar fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
          <div class="bar h-full bg-green-500" role="bar"></div>
        </div>`,
    });

    const start = () => NProgress.start();
    const done = () => NProgress.done();

    // Start progress when the component mounts
    start();

    // Simulating an API call
    const timer = setTimeout(done, 2000); // Simulate loading for 2 seconds

    // Cleanup on component unmount
    return () => {
      clearTimeout(timer);
      done();
    };
  }, []);

  return null; // No visible renderable content
}

export default ProgressBar;
