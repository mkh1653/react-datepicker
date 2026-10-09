import { useState } from "react";
import { Datepicker } from "./components/Datepicker";
import "./styles.css";

function formatDate(date: Date | null): string {
  if (!date) {
    return "تاریخی انتخاب نشده";
  }

  return date.toLocaleDateString("fa-IR", {
    timeZone: "UTC",
  });
}

const inputStyle = {
  width: "260px",
  padding: "10px 12px",
  border: "1px solid #bbb",
  borderRadius: "6px",
  fontSize: "14px",
};

function App() {
  const [popupDate, setPopupDate] = useState<Date | null>(null);
  const [dropdownDate, setDropdownDate] = useState<Date | null>(null);
  const [bottomDate, setBottomDate] = useState<Date | null>(null);

  return (
    <main
      style={{
        padding: "32px",
        fontFamily: "sans-serif",
        minHeight: "180vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "48px",
      }}>
      <h1> Datepicker visual test </h1>

      <section>
        <h2>1. Popup — default</h2>

        <Datepicker
          value={popupDate}
          onChange={setPopupDate}
          calendar='jalali'
          locale='fa-IR'>
          <input
            type='text'
            readOnly
            placeholder='Open popup'
            style={inputStyle}
          />
        </Datepicker>

        <p>{formatDate(popupDate)}</p>
      </section>

      <section>
        <h2>2. Dropdown</h2>

        <Datepicker
          displayMode='dropdown'
          value={dropdownDate}
          onChange={setDropdownDate}>
          <input
            type='text'
            readOnly
            placeholder='Open dropdown'
            style={inputStyle}
          />
        </Datepicker>

        <p>{formatDate(dropdownDate)}</p>
      </section>

      <div style={{ height: "70vh" }} />

      <section>
        <h2>3. Dropdown near the bottom</h2>

        <p>این تقویم را باز کن و موقعیتش را نزدیک پایین صفحه بررسی کن.</p>

        <Datepicker
          displayMode='dropdown'
          value={bottomDate}
          onChange={setBottomDate}>
          <input
            type='text'
            readOnly
            placeholder='Test automatic positioning'
            style={inputStyle}
          />
        </Datepicker>

        <p>{formatDate(bottomDate)}</p>
      </section>
    </main>
  );
}

export default App;
