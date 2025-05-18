import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ScreeningPage = () => {
  const { id } = useParams();
  const [screening, setScreening] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Get user ID from localStorage
  const user = JSON.parse(localStorage.getItem("userFlag"));
  const currentUserId = user?.id || user?._id;

  useEffect(() => {
    fetchScreening();
  }, [id]);

  const fetchScreening = () => {
    setLoading(true);
    fetch(`http://localhost:3000/screenings/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch screening");
        return res.json();
      })
      .then((data) => {
        setScreening(data);
        setLoading(false);
        setSelectedSeats([]);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

const seatColor = (seat) => {
  const user = JSON.parse(localStorage.getItem("userFlag"));
  const currentUserId = user?.id;

  if (seat.status === "available") return "green";
  if (seat.status === "reserved" && seat.user === currentUserId) return "orange"; 
  if (seat.status === "reserved" || seat.status === "taken") return "red";
  return "gray";
};

  const toggleSelectSeat = (seat) => {
    if (seat.status === "taken") return;

    if (selectedSeats.includes(seat.seatNumber)) {
      setSelectedSeats((prev) =>
        prev.filter((num) => num !== seat.seatNumber)
      );
    } else {
      if (selectedSeats.length < 4) {
        setSelectedSeats((prev) => [...prev, seat.seatNumber]);
      } else {
        alert("You can select up to 4 seats only.");
      }
    }
  };

  const reserveSeats = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat to reserve.");
      return;
    }

    if (!currentUserId) {
      alert("User not logged in.");
      return;
    }

    try {
      await Promise.all(
        selectedSeats.map((seatNumber) =>
          fetch(
            `http://localhost:3000/screenings/${id}/${seatNumber}/reserve`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: currentUserId }),
            }
          )
        )
      );
      alert("Seats reserved successfully!");
      fetchScreening();
    } catch (err) {
      alert("Failed to reserve seats.");
      console.error(err);
    }
  };

  const confirmSeats = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat to confirm.");
      return;
    }

    try {
      await Promise.all(
        selectedSeats.map((seatNumber) =>
          fetch(
            `http://localhost:3000/screenings/${id}/${seatNumber}/confirm`,
            { method: "POST" }
          )
        )
      );
      alert("Seats booked successfully!");
      fetchScreening();
    } catch (err) {
      alert("Failed to book seats.");
      console.error(err);
    }
  };

  if (loading) return <p>Loading screening...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!screening) return <p>No screening found</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{screening.movieTitle}</h2>
      <p>
        Start: {new Date(screening.startTime).toLocaleString()} <br />
        End: {new Date(screening.endTime).toLocaleString()}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 40px)",
          gap: "8px",
          marginTop: "20px",
          maxWidth: "440px",
        }}
      >
        {screening.seats.map((seat) => {
          const { seatNumber } = seat;
          const isSelected = selectedSeats.includes(seatNumber);
          return (
            <div
              key={seatNumber}
              onClick={() => toggleSelectSeat(seat)}
              style={{
                width: 40,
                height: 40,
                backgroundColor: isSelected ? "blue" : seatColor(seat),
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 4,
                userSelect: "none",
                fontWeight: "bold",
                cursor: seat.status === "taken" ? "not-allowed" : "pointer",
                border: isSelected ? "2px solid yellow" : "none",
              }}
              title={`Seat ${seatNumber} - ${seat.status}${
                seat.user?._id === currentUserId ? " (Yours)" : ""
              }`}
            >
              {seatNumber}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          type="button"
          onClick={reserveSeats}
          disabled={selectedSeats.length === 0}
          style={{ marginRight: "10px" }}
        >
          Reserve Selected Seats
        </button>
        <button
          type="button"
          onClick={confirmSeats}
          disabled={selectedSeats.length === 0}
        >
          Confirm Selected Seats
        </button>
      </div>
    </div>
  );
};

export default ScreeningPage;
