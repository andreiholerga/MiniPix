export default function DonateButton() {
  return (
    <form
      action="https://www.paypal.com/donate"
      method="post"
      target="_blank"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <input
        type="hidden"
        name="hosted_button_id"
        value="PC59QRDDGWREY"
      />

      <button className="donate-btn">
        ☕ Support this project
      </button>
    </form>
  );
}