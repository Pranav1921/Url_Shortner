# URL Shortener App

## Project Information
* **Project Name**: URL Shortener System
* **Team Members**: Pranav K U and Adarsh
* **Short Description**: A full-stack URL shortening application that allows users to generate compact, easy-to-share links (including custom word-based short codes) and tracks click metrics using a backend API and persistent database.

---

## Technologies Used
* **Frontend**: React / Client Interface
* **Backend**: Node.js, Express, Nanoid
* **Database**: PostgreSQL
* **Containerization**: Docker & Docker Compose[cite: 1]

---

## Environment Variables
Create a `.env` file in the backend directory (or reference the `.env.example` template) using the following configuration[cite: 1]:

```env
PORT=5000
BASE_URL=http://localhost:5000
DATABASE_URL=postgresql://postgres:your_password@database:5432/url_shortener
DB_HOST=database
DB_PORT=5432
DB_NAME=url_shortener
DB_USER=postgres
DB_PASSWORD=your_password