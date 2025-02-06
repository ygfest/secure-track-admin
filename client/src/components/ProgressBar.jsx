import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

function ProgressBar() {
  useEffect(() => {
    NProgress.configure({
      showSpinner: false,

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
    const timer = setTimeout(done, 2000);
    return () => {
      clearTimeout(timer);
      done();
    };
  }, []);

  return null;
}

export default ProgressBar;
