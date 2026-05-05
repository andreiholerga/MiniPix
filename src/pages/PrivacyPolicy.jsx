import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
   <div style={{ padding: 40, fontFamily: "sans-serif", maxWidth: 800, textAlign:"center", alignSelf:"center" }}>
      
      <Link
        to="/"
        style={{
          display: "inline-block",
          marginBottom: 20,
          color: "blue",
          textDecoration: "underline",
          fontSize: 14,
        }}
      >
        ← Back to main page
      </Link>
    
        
      <h1>Privacy Policy</h1>

      <p><strong>Effective date:</strong> 2026-05-06</p>

      <h2>1. Data collection</h2>
      <p>
        We do not store or upload your images. All processing happens locally in your browser.
      </p>

      <h2>2. Google AdSense</h2>
      <p>
        We use Google AdSense for ads. Google may use cookies and collect anonymized data.
      </p>

      <h2>3. Cookies</h2>
      <p>
        Cookies may be used for ads personalization and analytics.
      </p>

      <h2>4. Contact</h2>
      <p>andreiholerga@gmail.com</p>
    </div>
  );
}