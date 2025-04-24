# Habit Tracker App with Firebase

## Project Overview

A modern, full-featured habit tracking application built with React, Redux Toolkit, and Firebase. This app helps users build and maintain habits by tracking daily activities and providing visual feedback on progress and streaks.

![Habit Tracker Screenshot](screenshot.png)

## Table of Contents

- [Live Demo](#live-demo)
- [Key Features](#key-features)
- [Technical Architecture](#technical-architecture)
- [Core Components](#core-components)
- [State Management](#state-management)
- [Authentication System](#authentication-system)
- [Database Integration](#database-integration)
- [UI/UX Design Principles](#uiux-design-principles)
- [Project Setup](#project-setup)
- [Deployment Instructions](#deployment-instructions)
- [Future Enhancements](#future-enhancements)

## Live Demo

(Add your deployment URL once deployed)

## Key Features

### User Authentication
- Email and password-based authentication
- User registration with profile creation
- Login/logout functionality
- Persistent sessions using Firebase Auth

### Habit Management
- Create and track personal habits
- Mark habits as complete for each day
- Delete habits that are no longer needed
- Automated streak calculation and tracking

### Progress Tracking
- Visual representations of daily and weekly progress
- Statistical analysis of habit completion rates
- Streak tracking with current and best streak visibility
- Achievement tracking with user level system

### User Interface
- Responsive design for both mobile and desktop
- Modern UI with animations and transitions
- Dark theme with gradient accents
- Interactive components with immediate feedback

### Data Persistence
- All habits stored securely in Firebase Firestore
- User-specific data separation
- Real-time data updates

## Technical Architecture

The application follows a modern React architecture with the following key technologies:

- **React 18**: For building the user interface
- **Redux Toolkit**: For state management
- **Firebase**: For authentication and database
- **React Router**: For navigation and routing
- **TailwindCSS**: For styling and responsive design

### Project Structure

```
src/
├── components/         # UI components
├── firebase.js         # Firebase configuration
├── pages/              # Page components
├── store/              # Redux store and slices
└── App.jsx             # Main application component
```

## Core Components

### Authentication System

The auth system uses Firebase Authentication to handle user registration, login, and session management:

- `Login.jsx`: Handles user login with email and password
- `Register.jsx`: Manages user registration and profile creation
- `Auth.jsx`: Switches between login and registration forms
- `authSlice.jsx`: Redux slice for auth state management

### Habit Management

The habit system allows users to create, track, and manage their habits:

- `HabitForm.jsx`: For adding new habits
- `HabitList.jsx`: Displays all habits with completion status
- `habitSlice.jsx`: Redux slice for habit state with Firebase integration

### Navigation and Routing

The app uses React Router for navigation between different views:

- `Navbar.jsx`: Bottom navigation bar on mobile, top bar on desktop
- `App.jsx`: Contains route definitions and protected routes
- `HomePage.jsx`, `ProgressPage.jsx`, `ProfilePage.jsx`: Main page components

### Progress Visualization

The progress tracking system provides visual feedback on habit completion:

- `ProgressPage.jsx`: Shows charts, statistics, and achievement tracking
- Custom SVG-based progress indicators for completion rates
- Weekly progress visualization with bar charts

## State Management

### Redux Store Structure

The application uses Redux Toolkit for state management with the following slices:

1. **Auth Slice (`authSlice.jsx`)**
   - Manages user authentication state
   - Handles login, logout, and registration
   - Tracks loading and error states

2. **Habit Slice (`habitSlice.jsx`)**
   - Manages habit data and operations
   - Handles CRUD operations with Firebase integration
   - Calculates streaks and tracks habit completion

### Async Operations

Redux Toolkit's `createAsyncThunk` is used for asynchronous operations with Firebase:

- `fetchHabits`: Retrieves user habits from Firestore
- `addHabitToFirebase`: Creates new habits in the database
- `updateHabitInFirebase`: Updates habit status and streaks
- `deleteHabitFromFirebase`: Removes habits from the database

## Authentication System

The application uses Firebase Authentication with the following features:

### User Registration Flow

1. User provides name, email, and password
2. Firebase creates account and returns user credential
3. Profile is updated with display name
4. User is logged in automatically

### Login Flow

1. User provides email and password
2. Firebase validates credentials
3. On success, user data is stored in Redux
4. User's habits are fetched from Firestore

### Session Management

- Firebase `onAuthStateChanged` listener keeps track of authentication state
- Protected routes ensure only authenticated users access the app
- User's authentication state persists across browser sessions

## Database Integration

### Firebase Firestore Structure

The application uses Firebase Firestore to store user data with the following structure:

```
/habits/
  - [habitId]/
    - name: string
    - userId: string (foreign key to user)
    - streak: number
    - bestStreak: number
    - completedDates: array of dates
    - createdAt: timestamp
    - lastIncrementTime: timestamp
```

### Data Operations

- Habits are filtered by `userId` to ensure users only see their own data
- Streak calculations happen both client-side and are stored server-side
- Completed dates are stored as ISO strings for easy filtering and calculation

## UI/UX Design Principles

### Visual Design

- **Color Scheme**: Dark theme with green accents for a modern, clean look
- **Typography**: Clear hierarchy with different font weights and sizes
- **Spacing**: Consistent spacing system for harmonious layouts
- **Cards & Containers**: Subtle shadows and borders for depth

### Interaction Design

- Smooth animations for state changes
- Immediate visual feedback for user actions
- Loading indicators for async operations
- Error states with clear messaging

### Responsive Design

- Mobile-first approach with bottom navigation
- Desktop layout with top navigation
- Responsive grid layouts that adjust to screen size
- Touch-friendly elements for mobile users

## Project Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd habit-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project in the Firebase console
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Copy your Firebase config to `src/firebase.js`

4. Start the development server:
   ```bash
   npm run dev
   ```

## How to Explain in an Interview

### The Project Overview

"This is a full-stack habit tracking application built with React, Redux Toolkit, and Firebase. The app allows users to create accounts, track daily habits, visualize their progress, and maintain streaks for consistent behavior. I implemented user authentication, real-time database integration, and responsive design to create a complete, production-ready application."

### Technical Highlights

1. **State Management**: "I used Redux Toolkit for state management, with separate slices for authentication and habits. This allowed for clean separation of concerns and made async operations with Firebase straightforward using `createAsyncThunk`."

2. **Firebase Integration**: "The app uses Firebase for both authentication and data storage. I implemented custom hooks and Redux middleware to handle the Firebase operations, ensuring that database operations are wrapped in appropriate loading and error states."

3. **UI/UX Design**: "I focused on creating a responsive, intuitive UI with immediate feedback. The app works well on both mobile and desktop with different navigation layouts, and includes animations and transitions for a polished user experience."

4. **Component Architecture**: "The app is organized into reusable components with clear responsibilities, following React best practices. Core components like the HabitList and ProgressPage are designed to be both functional and performant."

### Code Architecture Decisions

"One key architectural decision was how to handle streak calculations. I implemented this logic in the Redux slice, calculating streaks based on completed dates to ensure consistency. The streaks are calculated both client-side for immediate feedback and stored server-side for persistence."

"Another important decision was implementing protected routes to ensure users can only access their own data. I created a ProtectedRoute component that wraps each route requiring authentication and redirects unauthenticated users to the login page."

## Future Enhancements

- Habit categories and tagging system
- Notifications and reminders
- Social features for accountability
- Data export and analytics
- Dark/light theme toggle

## Contributing

(Add contribution guidelines if open-source)

## License

(Add license information if applicable)