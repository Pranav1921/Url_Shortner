# URL Shortener - Docker Essentials Project

A full-stack URL Shortener application containerized using Docker, Docker Compose, Nginx, and Node.js.

## Project Information
* **Frontend:** React (Vite) served via Nginx (Port 3000)
* **Backend:** Node.js + Express (Port 5000)
* **Database:** MongoDB (Port 27017) with persistent volume storage
* **Containerization:** Docker & Docker Compose

## How to Run
Ensure Docker and Docker Compose are installed, then run[cite: 1]:
```bash
docker compose up --build