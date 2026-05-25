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
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black">

      <img
        src={imageUrl}
        alt="preview"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: "0.3s",
          maxHeight: "90vh",
          maxWidth: "90vw",
        }}
      />

      <div className="mt-4 flex gap-3">
        <button
          onClick={() => setRotation((r) => r - 90)}
          className="px-4 py-2 bg-white rounded"
        >
          ⟲ Rotate Left
        </button>

        <button
          onClick={() => setRotation((r) => r + 90)}
          className="px-4 py-2 bg-white rounded"
        >
          ⟳ Rotate Right
        </button>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Close
        </button>
      </div>

    </div>
  );
};

export default ImageViewer;