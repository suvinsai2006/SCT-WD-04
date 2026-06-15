# TaskHub

TaskHub is a lightweight, responsive web application built to help you organize your daily tasks and life priorities without any sign-up hassles. It features a modern, premium dark-mode interface styled with glassmorphism and subtle animations, keeping your focus on what matters.

# Why TaskHub?
Most task managers force you to sign up, wait for server syncs, or navigate cluttered dashboards. I built TaskHub to be:
* **Privacy-First & Local:** Everything runs in your browser. Your data is stored directly in `localStorage` and never leaves your machine.
* **Aesthetic & Minimalist:** Features a dark glassmorphic design with ambient glowing orbs, CSS variables for colors, and smooth Framer Motion transitions.
* **Instant Setup:** No database, no backend APIs, no configuration. Install and run.

# Core Features
* **Dynamic Quick Filters:** Stay on top of your schedule with custom views for *Today*, *Upcoming*, *Important*, and *Completed* tasks.
* **Custom Categories/Lists:** Create, rename, or delete lists (like Work or Personal) to keep projects separated.
* **Smart Sorting & Priorities:** Filter tasks by High, Medium, or Low priority, and sort them by due date, importance, or creation time.
* **Visual Progress:** A neat circular progress indicator in the sidebar dynamically counts and displays your completion stats.
* **Secured Local Settings:** A built-in "Clear All History" feature to safely wipe all tasks, custom lists, and application settings if you want a clean slate.

# Tech Stack
* **Frontend Library:** React (v19) + Vite
* **Animations:** Framer Motion (for smooth landing page entry, modal overlays, and task check/delete actions)
* **Icons:** Lucide React
* **Styling:** Custom CSS with premium glassmorphism principles

# Getting Started

# Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

# Installation & Run
1. Install the project dependencies:
   npm install
2. Start the Vite local development server:
   npm run dev
3. Open the link displayed in your terminal to view TaskHub in your browser.

# Project Structure
A quick overview of where the key parts of the app live:
├── index.html
├── src
│   ├── App.css          
│   ├── App.jsx          
│   ├── index.css       
│   ├── main.jsx         # Entry point setting up React rendering
│   └── components
│       ├── CustomSelect.jsx  # Customized select dropdown for priority selection
│       ├── LandingPage.jsx   # Interactive intro screen showcasing features
│       ├── Sidebar.jsx       # Sidebar containing quick filters, custom lists, and task stats
│       ├── TaskCard.jsx      # Individual task card containing check actions, priority tags, and metadata
│       ├── TaskList.jsx      # Holds the active list and sorting/filtering controls
│       └── TaskModal.jsx     # Dialog modal to add or edit tasks





