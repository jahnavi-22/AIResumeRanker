
# AI Resume Ranker

## Overview

This project contains two main components:

- **Backend:** Java Spring Boot REST API service
- **ML Service:** Python FastAPI service for resume scoring and ranking resumes

These two services run separately and communicate via REST APIs.

---

## Prerequisites

- Java 17 installed and configured
- Python 3.11 installed
- Python `venv` module available (usually included with Python)
- Gradle wrapper included in backend (`./gradlew`)

---

## Backend Setup

1. Open a terminal and navigate to the backend directory: cd backend
2. Build the backend: ./gradlew clean build
3. Run the backend service: ./gradlew bootRun


The backend service will start (default port 8080).

---

## ML Service Setup

1. Open a terminal and navigate to the ml-service directory: cd ml-service
2. Create a Python virtual environment: python3 -m venv venv
3. Activate the virtual environment: source venv/bin/activate
4. Install the required Python packages: pip install -r requirements.txt
5. Start the ML service: uvicorn app.main:app --reload

The ML service will start at `http://127.0.0.1:8000`.

---


