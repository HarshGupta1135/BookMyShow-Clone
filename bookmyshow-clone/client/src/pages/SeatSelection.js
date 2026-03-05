import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";


const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .bms-seat-page {
    min-height: 100vh;
    background: #f4f4f4;
    font-family: 'DM Sans', sans-serif;
    color: #1a1a1a;
  }

  /* ── NAV BAR ── */
  .bms-nav {
    background: #fff;
    padding: 0 48px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .bms-logo {
    font-family: 'DM Sans', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #1a1a1a;
    letter-spacing: -0.5px;
  }
  .bms-logo span { color: #e51937; }

  /* ── HERO BANNER ── */
  .bms-hero {
    background: linear-gradient(135deg, #2d0e0e 0%, #4a1515 40%, #2d0e0e 100%);
    padding: 48px 48px 40px;
    position: relative;
    overflow: hidden;
  }
  .bms-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 60% 50%, rgba(229,25,55,0.12) 0%, transparent 70%);
  }
  .bms-hero-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(229,25,55,0.18);
    border: 1px solid rgba(229,25,55,0.4);
    border-radius: 20px;
    padding: 6px 16px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    color: #ff6b7a;
    text-transform: uppercase;
    margin-bottom: 20px;
    position: relative;
  }
  .bms-hero-label::before {
    content: '🎬';
    font-size: 13px;
  }
  .bms-hero-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(36px, 5vw, 58px);
    letter-spacing: 1px;
    line-height: 1;
    color: #f5f0eb;
    position: relative;
    margin-bottom: 10px;
  }
  .bms-hero-title .accent { color: #e51937; }
  .bms-hero-sub {
    font-size: 14px;
    color: #babcbf;
    font-weight: 400;
    position: relative;
  }

  /* ── MAIN LAYOUT ── */
  .bms-layout {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 32px;
    max-width: 1100px;
    margin: 40px auto;
    padding: 0 32px 64px;
  }

  /* ── SEAT MAP CARD ── */
  .seat-map-card {
    background: #fff;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  }

  /* ── SCREEN INDICATOR ── */
  .screen-wrap {
    margin-bottom: 40px;
    text-align: center;
  }
  .screen-bar {
    height: 5px;
    background: linear-gradient(90deg, transparent, rgba(229,25,55,0.5), rgba(229,25,55,0.85), rgba(229,25,55,0.5), transparent);
    border-radius: 3px;
    margin-bottom: 8px;
    box-shadow: 0 0 16px rgba(229,25,55,0.25);
  }
  .screen-label {
    font-size: 10px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #aaa;
    font-weight: 500;
  }

  /* ── SEAT GRID ── */
  .seat-section-title {
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #999;
    font-weight: 600;
    margin-bottom: 16px;
    padding-left: 4px;
  }

  .seat-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }
  .row-label {
    width: 20px;
    font-size: 12px;
    font-weight: 600;
    color: #bbb;
    text-align: center;
    flex-shrink: 0;
  }
  .seat-btn {
    width: 36px;
    height: 34px;
    border-radius: 6px 6px 4px 4px;
    border: none;
    font-size: 10px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.15s ease;
    position: relative;
  }
  .seat-btn::after {
    content: '';
    position: absolute;
    bottom: 0; left: 4px; right: 4px;
    height: 3px;
    border-radius: 0 0 3px 3px;
    background: rgba(0,0,0,0.1);
  }
  .seat-btn.available {
    background: #f0f0f0;
    color: #888;
    border: 1px solid #e0e0e0;
  }
  .seat-btn.available:hover {
    background: #ffe8eb;
    color: #e51937;
    border-color: rgba(229,25,55,0.35);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(229,25,55,0.15);
  }
  .seat-btn.selected {
    background: linear-gradient(135deg, #e51937, #c0122d);
    color: #fff;
    border: 1px solid #e51937;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(229,25,55,0.35);
  }
  .seat-btn.selected:hover {
    background: linear-gradient(135deg, #ff2040, #e51937);
  }

  /* ── LEGEND ── */
  .legend {
    display: flex;
    gap: 20px;
    margin-top: 28px;
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #888;
  }
  .legend-dot {
    width: 18px;
    height: 16px;
    border-radius: 4px 4px 2px 2px;
  }
  .legend-dot.avail { background: #f0f0f0; border: 1px solid #e0e0e0; }
  .legend-dot.sel { background: linear-gradient(135deg, #e51937, #c0122d); }

  /* ── BOOKING CARD ── */
  .booking-card {
    background: #fff;
    border: 1px solid #ececec;
    border-radius: 16px;
    padding: 28px;
    position: sticky;
    top: 80px;
    height: fit-content;
    box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  }
  .booking-card-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 1px;
    margin-bottom: 24px;
    color: #1a1a1a;
  }

  .show-info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f2f2f2;
    font-size: 13px;
  }
  .show-info-row:last-of-type { border-bottom: none; }
  .info-label { color: #999; font-weight: 400; }
  .info-value { color: #1a1a1a; font-weight: 600; }

  .divider {
    height: 1px;
    background: #f2f2f2;
    margin: 20px 0;
  }

  .selected-seats-wrap {
    margin-bottom: 20px;
  }
  .selected-seats-label {
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #aaa;
    margin-bottom: 10px;
  }
  .selected-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    min-height: 32px;
  }
  .seat-tag {
    background: #fff0f2;
    border: 1px solid rgba(229,25,55,0.25);
    color: #e51937;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }
  .no-seats-msg {
    font-size: 12px;
    color: #ccc;
    font-style: italic;
  }

  .price-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 20px;
  }
  .price-label { font-size: 13px; color: #999; }
  .price-value {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 32px;
    color: #e51937;
    letter-spacing: 1px;
  }

  .book-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #e51937 0%, #c0122d 100%);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 16px rgba(229,25,55,0.3);
    position: relative;
    overflow: hidden;
  }
  .book-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
  }
  .book-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(229,25,55,0.4);
  }
  .book-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  .book-btn:active:not(:disabled) { transform: translateY(0); }

  /* ── LOADING ── */
  .bms-loading {
    min-height: 100vh;
    background: #f4f4f4;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }
  .loading-spinner {
    width: 44px; height: 44px;
    border: 3px solid rgba(229,25,55,0.15);
    border-top-color: #e51937;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text { color: #aaa; font-size: 14px; font-family: 'DM Sans', sans-serif; }

  @media (max-width: 768px) {
    .bms-layout { grid-template-columns: 1fr; padding: 0 16px 48px; }
    .booking-card { position: static; }
    .bms-hero { padding: 32px 20px 28px; }
    .bms-nav { padding: 0 20px; }
    .seat-btn { width: 30px; height: 28px; font-size: 9px; }
  }
`;

function SeatSelection() {
  const { showId } = useParams();
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();

  // ── unchanged backend calls ──
  useEffect(() => {
    const fetchShow = async () => {
      try {
  const { data } = await axios.get(`${API_URL}/api/shows/${showId}`);
  setShow(data);
} catch (error) {
  console.log(error);
}
    };
    fetchShow();
  }, [showId]);

  const handleBooking = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) { alert("Please login first"); return; }
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post(
  `${API_URL}/api/bookings`,
  { showId, seats: selectedSeats, totalPrice },
  config
);
      alert("Booking successful 🎉");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const rows = ["A", "B", "C", "D", "E"];
  const seatsPerRow = 10;

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  if (!show) {
    return (
      <>
        <style>{styles}</style>
        <div className="bms-loading">
          <div className="loading-spinner" />
          <p className="loading-text">Fetching show details…</p>
        </div>
      </>
    );
  }

  const totalPrice = selectedSeats.length * show.price;

  return (
    <>
      <style>{styles}</style>
      <div className="bms-seat-page">

        {/* NAV */}
        <nav className="bms-nav">
          <div className="bms-logo">Book<span>My</span>Show</div>
        </nav>

        {/* HERO */}
        <div className="bms-hero">
          <div className="bms-hero-label">Now Showing</div>
          <h1 className="bms-hero-title">
            Select Your <span className="accent">Seats</span>
          </h1>
          <p className="bms-hero-sub">
            {show.movie?.title || "Movie"} &nbsp;·&nbsp; ₹{show.price} per seat
          </p>
        </div>

        {/* CONTENT */}
        <div className="bms-layout">

          {/* LEFT — SEAT MAP */}
          <div className="seat-map-card">
            <div className="screen-wrap">
              <div className="screen-bar" />
              <p className="screen-label">Screen this way</p>
            </div>

            <p className="seat-section-title">Economy — ₹{show.price}</p>

            {rows.map((row) => (
              <div key={row} className="seat-row">
                <span className="row-label">{row}</span>
                {Array.from({ length: seatsPerRow }, (_, i) => {
                  const seat = `${row}${i + 1}`;
                  const isSelected = selectedSeats.includes(seat);
                  return (
                    <button
                      key={seat}
                      className={`seat-btn ${isSelected ? "selected" : "available"}`}
                      onClick={() => toggleSeat(seat)}
                      title={seat}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            ))}

            <div className="legend">
              <div className="legend-item">
                <div className="legend-dot avail" />
                Available
              </div>
              <div className="legend-item">
                <div className="legend-dot sel" />
                Selected
              </div>
            </div>
          </div>

          {/* RIGHT — BOOKING CARD */}
          <div className="booking-card">
            <h2 className="booking-card-title">Booking Summary</h2>

            <div className="show-info-row">
              <span className="info-label">Movie</span>
              <span className="info-value">{show.movie?.title || "—"}</span>
            </div>
            <div className="show-info-row">
              <span className="info-label">Price / seat</span>
              <span className="info-value">₹{show.price}</span>
            </div>
            <div className="show-info-row">
              <span className="info-label">Seats chosen</span>
              <span className="info-value">{selectedSeats.length}</span>
            </div>

            <div className="divider" />

            <div className="selected-seats-wrap">
              <p className="selected-seats-label">Selected Seats</p>
              <div className="selected-tags">
                {selectedSeats.length === 0 ? (
                  <span className="no-seats-msg">No seats selected yet</span>
                ) : (
                  selectedSeats.map((s) => (
                    <span key={s} className="seat-tag">{s}</span>
                  ))
                )}
              </div>
            </div>

            <div className="divider" />

            <div className="price-row">
              <span className="price-label">Total Amount</span>
              <span className="price-value">₹{totalPrice}</span>
            </div>

            <button
              className="book-btn"
              onClick={handleBooking}
              disabled={selectedSeats.length === 0}
            >
              🎟 Proceed to Book
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

export default SeatSelection;