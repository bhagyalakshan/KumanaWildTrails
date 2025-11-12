// GoogleReviewWidget.jsx
import React, { useEffect, useRef } from 'react';

const GoogleReviewWidget = () => {
  const widgetRef = useRef(null);

  useEffect(() => {
    if (!widgetRef.current) return;

    const script = document.createElement("script");
    script.src = "https://apps.elfsight.com/p/platform.js"; // Example: Elfsight
    script.defer = true;
    widgetRef.current.appendChild(script);

    // Cleanup to prevent memory leaks
    return () => {
      widgetRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div ref={widgetRef}>
      <div className="elfsight-app-61dc1235-0cd9-40d7-80cf-551cc2985d6d"></div>
    </div>
  );
};

export default GoogleReviewWidget;
