# 🎵 TuneStream - A Decoupled Music Streaming Application

## ✨ Key Features

- **User Authentication:** Secure user registration and login with email/password (JWT-based) or Google OAuth 2.0.
- **Music Search & Playback:** Real-time song search using the YouTube Data API.
- **Persistent Global Player:** A global audio player that provides continuous playback across all pages of the application.
- **Dynamic Song Queue:** Users can add songs to a temporary queue, which plays sequentially after the current track.
- **Playlist Management:** Authenticated users can create, name, delete, and view multiple custom playlists.
- **Add/Remove from Playlists:** Seamlessly add songs from search results to any playlist, or remove them from the playlist view.
- **Shuffle Play:** Play any personal playlist in a random order.
- **Listening History:** Automatically tracks the user's listening history for the last 2 days.

## 🔧 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Back-End** | Python, Django, Django Ninja, dj-rest-auth, django-allauth |
| **Front-End** | React (Vite), JavaScript, Axios, React Router, `react-youtube` |
| **Database** | PostgreSQL |
| **DevOps** | Docker, Docker Compose, Nginx (as a reverse proxy) |
| **External APIs**| Google OAuth 2.0, YouTube Data API v3 |

## 🚀 Getting Started (Local Development)

To run this project locally, you will need to have **Docker Desktop** installed and running on your machine.

### 1. Clone the Repository
First, clone the project from GitHub to your local machine.
```bash
git clone <https://github.com/CusoCS/myPlayer.git>
cd myPlayer
```

### 2. Check .env file
It is your own responsibility to ensure API keys are valid.

### 3. Install Node modules
Enter myPlayer-frontend and install node modules
```bash
cd myPlayer-frontend
npm install
```

### 3. Run the Application
With Docker Desktop open and running on your machine, you can start the entire application stack (database, back-end, and front-end) with a single command from the project's root directory.
```bash
docker-compose up --build
```

### 4. Access the Application
Once the containers are built and running, you can access the application in your browser at the following addresses:

Front-End Application: http://localhost:5173

Back-End API Docs: http://localhost:8000/api/docs