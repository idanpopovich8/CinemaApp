import React, { useEffect, useState } from "react";
import { useNavigate , Link } from "react-router-dom";


const Home = () => {
  const [screenings, setScreenings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/screenings")
      .then((res) => res.json())
      .then((data) => setScreenings(data))
      .catch((err) => console.error(err));
  }, []);

  const handleClick = (id) => {
    navigate(`/screening-page/${id}`);
  };
const handleLogout = () => {
    localStorage.removeItem("userFlag")
    alert("logout successfully")
}

  return (
    <div>
        <span>
    <Link to="/login">Login    </Link>
    </span>
    <span>
    <Link to="/register">Register </Link>
    </span>
    <button onClick={handleLogout}>Logout</button>


      <h1>Screenings</h1>
      <ul>
        {screenings.map((screening) => (
          <li
            key={screening._id}
            style={{ cursor: "pointer", marginBottom: "10px" }}
            onClick={() => handleClick(screening._id)}
          >
            <strong>{screening.movieTitle}</strong> -{" "}
            {new Date(screening.startTime).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
