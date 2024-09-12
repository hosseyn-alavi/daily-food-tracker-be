import express from "express";

const app = express();
const PORT = 80;

app.get("/home", (req, res) => {
    res.status(200).json("Welcome, your. app is working well");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// Export the Express API
module.exports = app;
