import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ImageViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const imageUrl = location.state?.url;
  const [rotation, setRotation] = useState(0);

  if (!imageUrl) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>No image found</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex flex-col">

      {/* Image Area */}
      <div className="flex-1 flex items-center justify-center overflow-auto p-4">
        <img
          src={imageUrl}
          alt="preview"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: "0.3s ease",
            maxWidth: "85%",
            maxHeight: "85%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Bottom Controls */}
      <div className="sticky bottom-0 w-full bg-black/80 backdrop-blur p-4 flex justify-center gap-3">
        <button
          onClick={() => setRotation((r) => r - 90)}
          className="px-4 py-2 bg-white rounded-lg"
        >
          ⟲ Rotate Left
        </button>

        <button
          onClick={() => setRotation((r) => r + 90)}
          className="px-4 py-2 bg-white rounded-lg"
        >
          ⟳ Rotate Right
        </button>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Close
        </button>
      </div>

    </div>
  );
};

export default ImageViewer;