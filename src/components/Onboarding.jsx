import { useEffect, useState } from "react";

export default function Onboarding() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("seen_onboarding");

    if (!seen) {
      setVisible(true);
    }
  }, []);

  const close = () => {
    localStorage.setItem("seen_onboarding", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="onboarding">
      <div className="onboarding-content">

        <div>
          <div className="onboarding-title">
            👋 Welcome to Web Image Optimizer
          </div>

          <div className="onboarding-text">
            Drop images or folders, adjust quality, and download optimized results.
            Everything runs locally in your browser — nothing is uploaded.
          </div>
        </div>

        <button className="onboarding-btn" onClick={close}>
          Got it
        </button>

      </div>
    </div>
  );
}