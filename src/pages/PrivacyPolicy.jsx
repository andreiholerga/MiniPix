import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="app">
      <div className="container privacy">

        <Link to="/" className="privacy-back">
          ← Back to main page
        </Link>

        <div className="panel privacy-panel">
          <h1 className="privacy-title">Privacy Policy</h1>

          <p className="privacy-date">
            <strong>Effective date:</strong> 2026-05-06
          </p>

          <div className="privacy-section">
            <h2>1. Data collection</h2>
            <p>
              We do not store or upload your images. All processing happens locally in your browser.
            </p>
          </div>

          <div className="privacy-section">
            <h2>2. Google AdSense</h2>
            <p>
              We use Google AdSense for ads. Google may use cookies and collect anonymized data.
            </p>
          </div>

          <div className="privacy-section">
            <h2>3. Cookies</h2>
            <p>
              Cookies may be used for ads personalization and analytics.
            </p>
          </div>

          <div className="privacy-section">
            <h2>4. Contact</h2>
            <p className="privacy-contact">
              andreiholerga@gmail.com
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}