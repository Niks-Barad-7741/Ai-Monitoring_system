# AI Monitoring System (Face Mask Detection)

## 📌 Project Overview
This project is a real-time AI monitoring system designed to detect face masks using Deep Learning. It consists of a custom-trained CNN model, a Python backend for processing, and a React-based frontend dashboard for monitoring.

## 🚀 Timeline & Development
The project was built in distinct phases:
* **Data Analysis and Data Engineering (Feb 2):** Initial data exploration and model prototyping in Jupyter Notebooks.
* **Backend & Core Logic (Feb 10):** Developed the API, data pipeline, and integrated the custom CNN model.
* **Frontend (Feb 11):** Built the user interface using React and Tailwind CSS.

## 🛠️ Tech Stack
* **AI/ML:** Python, PyTorch/TensorFlow, OpenCV, Custom CNN Architecture.
* **Backend:** Python (FastAPI/Uvicorn), MongoDB (`mongo_log.py`).
* **Frontend:** React.js (Vite), Tailwind CSS.
* **Tools:** VS Code, Git.

## 📂 Folder Structure
* **`Notebooks/`**: Contains Jupyter notebooks used for data analysis and initial model training.
* **`backend/`**: Server-side logic and API endpoints.
* **`frontend/`**: The React application source code.
* **`Models/`**: Stores the trained model weights.
* **`src/`**: additional source scripts for data pipelines.
* **`logs_images/`**: Stores captured images/logs from the detection system.

## ⚙️ Setup & Installation
1.  **Backend:** Navigate to the backend folder and install requirements.
2.  **Frontend:** Navigate to `frontend/`, run `npm install`, then `npm run dev`.
3.  **Database:** Ensure MongoDB is running locally or connected via URI.
