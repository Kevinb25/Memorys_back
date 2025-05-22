// Config .env (colocar al principio antes de cargar cualquier otro módulo)
require("dotenv").config();

const express = require('express');
// Server creation and configuration
const http = require("node:http");
const app = require("./src/app");

app.use(express.json());
// Server creation
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT);

// Listeners
server.on("listening", () => {
    console.log(`Server listening on port ${PORT}`);
});

server.on("error", (error) => {
    console.log(error);
});


