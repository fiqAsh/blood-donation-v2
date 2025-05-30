import React, { useEffect, useState } from "react";

const InfoPanel = ({ title, subtitle, slides, mode = "signup" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideKey, setSlideKey] = useState(0);

  useEffect(() => {
    if (mode !== "signup") return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setSlideKey((prev) => prev + 1);
    }, 2500);

    return () => clearInterval(interval);
  }, [slides, mode]);

  return (
    <div className="text-center text-primary-content transition-all duration-1000">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-lg mb-4">{subtitle}</p>

      {mode === "signup" ? (
        <div className="h-16 overflow-hidden relative">
          <div
            key={slideKey}
            className="text-lg animate-slide-in-out bg-accent rounded-lg h-full text-center flex items-center justify-center"
          >
            {slides[currentIndex]}
          </div>
        </div>
      ) : (
        <ul className="text-left mt-4 space-y-2 text-lg">
          {slides.map((text, idx) => (
            <li key={idx} className="bg-accent px-3 py-2 rounded">
              {text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InfoPanel;
