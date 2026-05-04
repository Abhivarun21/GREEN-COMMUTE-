require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3001;

/* Middleware */
app.use(cors());
app.use(express.json());

/* Root route */
app.get("/", (req, res) => {
  res.send("API WORKING");
});

/* VERIFY TOKEN MIDDLEWARE */
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains email
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
}

/*  REGISTER */
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const existing = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    res.json({ message: "User registered successfully" });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


/*  LOGIN */
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/*  EMISSION */
app.post("/api/emission", async (req, res) => {
  try {
    const distance = req.body.distance;

    if (!distance) {
      return res.status(400).json({ error: "Distance required" });
    }

    const result = await pool.query("SELECT * FROM transport_modes");

    const carRow = result.rows.find(r => r.mode_name === "Car");
    const carEmission = distance * carRow.carbon_per_km;

    const emissions = result.rows.map(row => {
      const emission = distance * row.carbon_per_km;

      return {
        mode: row.mode_name,
        carbon: emission.toFixed(2),
        carbon_saved: (carEmission - emission).toFixed(2)
      };
    });

    res.json(emissions);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/*  COST */
app.post("/api/cost", async (req, res) => {
  try {
    const distance = req.body.distance;

    const result = await pool.query("SELECT * FROM transport_modes");

    const costs = result.rows.map(row => ({
      mode: row.mode_name,
      cost: (distance * row.cost_per_km).toFixed(2)
    }));

    res.json(costs);

  } catch (err) {
    res.status(500).json({ error: "DB error" });
  }
});

/* ROUTE API  */
app.post("/api/route", async (req, res) => {
  try {
    const { start, end } = req.body;

    const response = await fetch(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": process.env.ORS_API_KEY
        },
        body: JSON.stringify({
          coordinates: [start, end]
        })
      }
    );

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Route error" });
  }
});

/*  SAVE TRIP (SECURE) */
app.post("/api/save-trip", verifyToken, async (req, res) => {
  try {
    const email = req.user.email; // secure
    const { from, to, mode, co2, cost } = req.body;

    await pool.query(
      `INSERT INTO trips 
      (user_email, from_location, to_location, mode, co2_saved, cost) 
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [email, from, to, mode, co2, cost]
    );

    res.json({ message: "Trip saved" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Save failed" });
  }
});

/*  GET TRIPS (SECURE) */
app.get("/api/trips", verifyToken, async (req, res) => {
  try {
    const email = req.user.email; //  secure

    const result = await pool.query(
      "SELECT * FROM trips WHERE user_email=$1 ORDER BY date DESC",
      [email]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fetch failed" });
  }
});

/* DB CHECK */
pool.query("SELECT current_database()", (err, res) => {
  if (err) console.error(err);
  else console.log("Connected to DB:", res.rows[0].current_database);
});

/* Start */
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});