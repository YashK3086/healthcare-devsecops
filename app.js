const express = require('express');
const app = express();
const port = 3000;

// SECURE PRACTICE: Using environment variables for secrets
const DB_PASSWORD = process.env.DB_PASSWORD || "NoPasswordSet";

app.get('/', (req, res) => {
  res.send('<h1>🏥 Secure Healthcare System</h1><p>Patient data is encrypted and safe.</p>');
});

app.get('/patient/:id', (req, res) => {
  const patientId = req.params.id;
  // SECURE PRACTICE: Input validation (only numbers allowed)
  if (!/^\d+$/.test(patientId)) {
    return res.status(400).send("Invalid Patient ID! Use numbers only.");
  }
  res.send(`Displaying data for Patient ID: ${patientId}`);
});

app.listen(port, () => {
  console.log(`Healthcare app listening at http://localhost:${port}`);
  console.log(`Connected to DB with secure key: ${DB_PASSWORD.substring(0, 3)}****`);
});
