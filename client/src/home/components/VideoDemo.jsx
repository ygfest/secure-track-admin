import YouTube from "react-youtube";

function VideoDemo() {
  const videoId = "UYUnvbqa2ag";

  const opts = {
    height: "560",
    width: "318",
    playerVars: {
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <section className="flex flex-col items-center justify-center space-y-4 max-w-sm mx-auto my-24 p-8">
      <h2 className="text-2xl font-semibold text-gray-900">SecureTrack Demo</h2>
      <p className="text-sm text-gray-600 text-center">
        See how SecureTrack keeps your luggage safe in real time.
      </p>
      <div className="w-full max-w-xs">
        <YouTube
          videoId={videoId}
          opts={opts}
          className="rounded-lg overflow-hidden"
        />
      </div>
    </section>
  );
}

export default VideoDemo;
