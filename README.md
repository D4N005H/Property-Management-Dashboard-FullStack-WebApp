# Property Management Dashboard (Full-Stack)

A robust, full-stack application designed for the efficient management of real estate properties (WEG and MV). This project features an AI-powered creation wizard that extracts data from legal PDF documents ("Teilungserklärung") and provides a high-performance interface for managing complex property structures with dozens of units.

---

## Table of Contents

1.  [Prerequisites](#-prerequisites)
2.  [Project Architecture](#-project-architecture)
3.  [Installation & Setup](#-installation--setup)
4.  [Database Management (Docker)](#-database-management-docker)
5.  [User Manual & Features](#-user-manual--features)
6.  [Running Tests](#-running-tests)
7.  [Technical Deep Dive](#-technical-deep-dive)

---

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

*   **Node.js** (v18 or higher recommended)
*   **Docker Desktop** (Required for the PostgreSQL database)
*   **Git** (or manually download the Zipped project directly)
*   **OpenAI API Key** (Required for the PDF extraction feature)

---

## Project Architecture

The project follows a monorepo-style structure:

```text
property-manager/
├── backend/            # NestJS API (Business Logic, DB Access, AI Service)
├── frontend/           # Next.js App Router (UI, Client/Server Components)
├── docker-compose.yml  # Orchestration for the PostgreSQL Database
└── README.md           # Documentation
```

---

## Installation & Setup

Follow these steps to run the application.

### 1. Clone the Repository

```bash
git clone https://github.com/D4N005H/Property-Management-Dashboard-Full-Stack-.git
cd property-manager
```

### 2. Start the Database (Docker)

Docker is used to spin up a PostgreSQL instance without needing a local installation.

1.  Open your terminal in the root `property-manager` folder.
2.  Run the following command:

```bash
docker compose up -d
```
(Use Docker Compose if the older version is used, use compose down --volumes to reset the db - more information down below)

*   **What this does:** Downloads the Postgres image and starts it in the background on port `5432`.
*   **Verification:** Run `docker ps` to ensure the container `property_db` is running.

### 3. Backend Setup

1.  Open a new terminal and navigate to the backend:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    *   Create a file named `.env` in the `backend` folder.
    *   Add the following content (replace `YOUR_OPENAI_KEY` with your actual key):

    ```env
    # Database Connection (Pre-configured for Docker)
    DATABASE_URL="postgresql://admin:password123@localhost:5432/property_management?schema=public"

    # OpenAI API Key (Required for PDF Upload)
    OPENAI_API_KEY="sk-YOUR_OPENAI_KEY_HERE"
    ```

4.  **Initialize the Database Schema:**
    This step creates the tables in your empty Docker database.
    ```bash
    npx prisma migrate dev
    ```
5.  **Start the Backend Server:**
    ```bash
    npm run start:dev
    ```
    *The backend is now running at `http://localhost:3000`.*

### 4. Frontend Setup

1.  Open a **new** terminal window and navigate to the frontend:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Frontend Server:
    ```bash
    npm run dev
    ```
    *The frontend is now running at `http://localhost:3000` (Next.js proxies the backend port automatically or runs on 3001 if 3000 is taken).*

---

## Database Management (Docker)

Managing the database is done via Docker Compose and Prisma.

### How to Stop the Database
To pause the database without losing data:
```bash
# From the root folder
docker-compose stop
```

### How to Completely Reset the Database (Wipe Data)
If you want to delete all data and start fresh (useful for testing):

1.  **Destroy containers and volumes:**
    ```bash
    # From the root folder
    docker-compose down --volumes
    ```
    *Warning: This permanently deletes all data.*

2.  **Restart the database:**
    ```bash
    docker-compose up -d
    ```

3.  **Re-apply the schema:**
    ```bash
    cd backend
    npx prisma migrate dev
    ```

---

## User Manual & Features

### 1. Dashboard
*   **View:** Lists all properties with their ID, Name, Type, and Manager.
*   **Action:** Click "View" to see details or "+ Create New Property" to start the wizard.

### 2. Creating a Property (The Wizard)
*   **Step 1: General Info:**
    *   **AI Upload:** Click "Upload Declaration of Division". Select a PDF. The system will auto-fill the form. IMPORTANT: Please use a valid API key for OpenAI in the `.env` file.
    *   **Manual Entry:** You can also type details manually.
*   **Step 2: Buildings:**
    *   Review the buildings extracted from the PDF.
    *   Add new buildings or remove existing ones.
*   **Step 3: Units (The Efficiency Engine):**
    *   A dense, spreadsheet-like table for managing units.
    *   **Edit:** Click any cell to edit Unit #, Size, Rooms, etc.
    *   **Assign:** Use the dropdown to link a unit to a specific Building.
    *   **Save:** Clicking "Finish" sends a single bulk payload to the backend.

### 3. Editing & Deleting
*   **Edit:** From the Property Detail page, click "Edit Property". This re-opens the wizard with all data pre-filled. You can modify buildings and units just as you would in the creation flow.
*   **Delete:** Click "Delete" on the detail page. A confirmation prompt ensures safety. This performs a **Cascade Delete**, removing the property and all associated buildings and units instantly.

---

## Running Tests

The backend includes a comprehensive End-to-End (E2E) test suite that verifies the entire CRUD flow.

1.  Ensure the backend server is **stopped** (to free up the port).
2.  Ensure Docker is **running**.
3.  Run the tests:
    ```bash
    cd backend
    npm run test:e2e
    ```

---

## Technical Deep Dive

### Why is this application "Efficient" for large units?
Handling large datasets in web forms often causes lag. This application solves that via:
1.  **Local State Management:** The "Units" table in the frontend manages state locally in memory. We do not make API calls for every single cell edit. Of course, one can serialize and use pagination, which is not within the context of this demo concept.
2.  **Bulk Payload:** When the user clicks "Save", the frontend constructs a massive, nested JSON object containing the Property, all Buildings, and all Units.
3.  **Transactional Writes:** The backend receives this payload and uses **Prisma's Nested Writes**. It opens a single database transaction to create the Property, create all Buildings, and create all Units simultaneously. If any part fails, the whole operation rolls back, ensuring data integrity.

### Database Schema & Logic
*   **IDs:** We use `cuid()` (Collision-Resistant Unique Identifiers) instead of integers. This is more secure and scalable for distributed systems.
*   **Cascade Deletes:** The schema defines `onDelete: Cascade` for relations.
    *   `Property` -> `Building` -> `Unit`
    *   This means we don't need complex recursive delete logic in our code. Deleting a property automatically cleans up every related record in the database.

### The AI Integration
*   **Service:** `PdfService` (Backend).
*   **Logic:** It streams the PDF buffer to OpenAI, creates a temporary Assistant, and uses a specific prompt to enforce a strict JSON schema output. This guarantees that the AI's response can be directly consumed by our frontend state.

### Styling
*   **Tailwind CSS v4:** We use the latest "CSS-first" configuration of Tailwind that is (at this time) the most recent stable version.
*   **Globals:** Base styles are defined in `globals.css` using `@apply` to ensure that all form inputs (text, file, select) share a consistent, accessible, and professional look without cluttering the HTML with repetitive classes.
