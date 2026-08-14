# 🔗 URL Shortener System

A full-stack **URL Shortener application** that converts long URLs into compact, easy-to-share links. The system supports automatically generated short codes as well as **custom word-based short URLs**, while tracking click metrics through a persistent PostgreSQL database.

---

## 📌 Project Information

| | Details |
|---|---|
| **Project Name** | URL Shortener System |
| **Team Members** | Pranav K U, Adarsh |
| **Frontend** | React |
| **Backend** | Node.js, Express |
| **Database** | PostgreSQL |
| **Short Code Generation** | Nanoid |
| **Containerization** | Docker, Docker Compose |

---

## ✨ Features

- 🔗 Convert long URLs into short links
- ✏️ Create custom word-based short codes
- ⚡ Fast URL redirection
- 📊 Track URL click metrics
- 💾 Persistent PostgreSQL database
- 🌐 RESTful backend API
- 🖥️ React-based client interface
- 🐳 Docker and Docker Compose support
- 🔐 Environment-based configuration

---

## 🏗️ System Architecture

```text
                 ┌─────────────────────┐
                 │     React Client    │
                 │      Frontend       │
                 └──────────┬──────────┘
                            │
                            │ REST API
                            ▼
                 ┌─────────────────────┐
                 │   Node.js + Express │
                 │      Backend        │
                 └──────────┬──────────┘
                            │
                            │ SQL
                            ▼
                 ┌─────────────────────┐
                 │     PostgreSQL      │
                 │      Database       │
                 └─────────────────────┘

                 Nanoid → Short Code
```

---

# 🛠️ Prerequisites

Before running the project, make sure the following software is installed.

## 1. Node.js & npm

Node.js is required when running the frontend and backend locally.

Download the **LTS version** from:

[Node.js Official Website](https://nodejs.org/?utm_source=chatgpt.com)

Verify the installation:

```bash
node -v
npm -v
```

---

## 2. Docker Desktop

Docker is recommended because it allows the complete application stack to run without manually configuring PostgreSQL.

Download Docker Desktop:

[Docker Desktop](https://www.docker.com/products/docker-desktop/?utm_source=chatgpt.com)

On Windows, make sure **WSL 2 integration** is enabled.

Verify Docker:

```bash
docker --version
docker compose version
```

---

## 3. PostgreSQL

PostgreSQL is only required when running the application locally without Docker.

Download PostgreSQL:

[PostgreSQL Downloads](https://www.postgresql.org/download/?utm_source=chatgpt.com)

During installation, configure the password for the `postgres` user.

---

# ⚙️ Environment Variables

The application uses environment variables for configuration.

## Backend

Create a `.env` file inside the `backend` directory:

```env
PORT=5000

BASE_URL=http://localhost:5000

DATABASE_URL=postgresql://postgres:your_password@database:5432/url_shortener

DB_HOST=database
DB_PORT=5432
DB_NAME=url_shortener
DB_USER=postgres
DB_PASSWORD=your_password
```

> **Note:** When running with Docker Compose, the database host should normally be the PostgreSQL service name defined in `docker-compose.yml`, such as `database`.

---

## Frontend

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
```

---

# 🚀 Running the Application

There are two ways to run the project.

### Method A — Docker Compose

**Recommended**

### Method B — Run Locally

For development without Docker.

---

# 🐳 Method A: Running with Docker Compose

Docker Compose automatically starts the application services and PostgreSQL database.

## 1. Clone the Repository

```bash
git clone https://github.com/Pranav1921/Url_Shortner.git
```

Navigate into the project:

```bash
cd Url_Shortner
```

---

## 2. Start the Application

Run:

```bash
docker compose up --build
```

This will build and start the required services.

Depending on the Docker configuration, the stack will contain:

```text
React Frontend
      ↓
Node.js / Express Backend
      ↓
PostgreSQL Database
```

---

## 3. Access the Application

### Frontend

```text
http://localhost:5173
```

or, depending on the Docker configuration:

```text
http://localhost:80
```

### Backend API

```text
http://localhost:5000
```

---

## 4. Stop the Application

Press:

```text
Ctrl + C
```

or run:

```bash
docker compose down
```

To remove containers and associated volumes:

```bash
docker compose down -v
```

> Use `-v` carefully because it may remove the PostgreSQL data volume.

---

# 🛠️ Method B: Running Locally Without Docker

If you don't want to use Docker, PostgreSQL, Node.js, and npm must be configured manually.

---

## 1. Create the PostgreSQL Database

Open **pgAdmin** or use the PostgreSQL terminal:

```bash
psql -U postgres
```

Create the database:

```sql
CREATE DATABASE url_shortener;
```

Verify the database:

```sql
\l
```

---

# ⚙️ 2. Configure the Backend

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create the backend `.env` file with the appropriate PostgreSQL configuration.

For a local PostgreSQL installation, the database host will typically be:

```env
DB_HOST=localhost
```

and the connection string can be configured accordingly:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/url_shortener
```

Start the backend:

```bash
npm run dev
```

The backend should be available at:

```text
http://localhost:5000
```

---

# 💻 3. Configure the Frontend

Open a **new terminal**.

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

The frontend should be available at:

```text
http://localhost:5173
```

---

# 🔄 Application Flow

The basic URL shortening process works as follows:

```text
User enters long URL
        │
        ▼
React Frontend
        │
        │ POST Request
        ▼
Express Backend
        │
        ├── Validate URL
        │
        ├── Generate short code
        │      │
        │      └── Nanoid
        │
        └── Store URL
               │
               ▼
          PostgreSQL
               │
               ▼
        Return Short URL
```

When a user accesses the generated short URL:

```text
Short URL
    │
    ▼
Express Backend
    │
    ├── Find short code
    │
    ├── Increment click count
    │
    └── Redirect to original URL
              │
              ▼
        Original Website
```

---

# 📊 Click Tracking

The system maintains click information for shortened URLs.

A typical URL record can contain information such as:

```text
Original URL
Short Code
Custom Code
Click Count
Created At
Updated At
```

Whenever a short URL is accessed, the corresponding click count can be incremented in PostgreSQL.

---

# 🔗 Short URL Examples

### Automatically Generated

```text
http://localhost:5000/aB7xK2
```

### Custom Short Code

If the user chooses:

```text
github
```

the resulting URL can be:

```text
http://localhost:5000/github
```

This makes URLs easier to remember and share.

---

# 📁 Project Structure

```text
Url_Shortner/
│
├── backend/
│   ├── src/
│   ├── package.json
│   ├── .env
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── .env
│   └── ...
│
├── docker-compose.yml
├── Dockerfile
├── .gitignore
└── README.md
```

> The exact structure may vary depending on the current implementation.

---

# 🐳 Docker Services

The Docker Compose configuration is designed to run the application as multiple services.

```text
┌──────────────────────────┐
│        Frontend           │
│       React / Vite        │
│        Port 5173          │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│         Backend           │
│    Node.js + Express      │
│        Port 5000          │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│       PostgreSQL          │
│        Port 5432          │
└──────────────────────────┘
```

---

# 🔧 Useful Commands

## Docker

Start containers:

```bash
docker compose up
```

Build and start:

```bash
docker compose up --build
```

Run in background:

```bash
docker compose up -d
```

Stop containers:

```bash
docker compose down
```

View running containers:

```bash
docker ps
```

View logs:

```bash
docker compose logs
```

View backend logs:

```bash
docker compose logs backend
```

---

## Backend

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

---

## Frontend

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

---

# 🔐 Security Notes

Do not commit sensitive credentials to GitHub.

The following files should generally be added to `.gitignore`:

```text
.env
node_modules/
dist/
```

Never expose production database passwords, API keys, or other secrets in source code.

---

# 🚧 Future Improvements

Potential improvements for the project include:

- 👤 User authentication and account management
- 📊 Advanced analytics dashboard
- 🌍 Geographic click tracking
- 📱 Device and browser analytics
- ⏳ URL expiration
- 🔒 Password-protected URLs
- 🗑️ URL deletion and management
- 📈 Click analytics over time
- ⚡ Redis caching for frequently accessed URLs
- 🛡️ Rate limiting and abuse prevention
- ☁️ Cloud deployment
- 🔄 Automatic database migrations
- 🧪 Automated unit and integration testing

---

# 👨‍💻 Team

### Pranav K U
Full-Stack Development, Backend, Database & Docker

### Adarsh
Frontend / Full-Stack Development

---

# 📄 License

This project is developed for educational and project-development purposes.

---

## ⭐ Repository

GitHub Repository:

[Url_Shortner — GitHub Repository](https://github.com/Pranav1921/Url_Shortner?utm_source=chatgpt.com)
