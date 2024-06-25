import useGetMedia from "../../hooks/useGetMedia";
import ReactPlayer from "react-player";
export default function Media() {
  const { loading, medias } = useGetMedia();
  return (
    <div className="container mx-auto">
      {!loading && medias.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {medias.map((item, index) => (
            <div key={index} className="relative sm:h-32">
              {item.type === "image" ? (
                <img
                  src={item.file}
                  alt="image"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="w-full">
                  <ReactPlayer
                    url={item.file}
                    controls
                    width="100%"
                    height="100%"
                    className="h-full w-full shadow-lg"
                    playing={false}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center">No medias yet.</div>
      )}
    </div>
  );
}
