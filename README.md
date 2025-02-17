# Habit Tracker App

A modern habit tracking application built with React and Redux, featuring a clean UI and efficient state management.

## Tech Stack

### Core Technologies
- **React 18** - A JavaScript library for building user interfaces
- **Vite** - Next Generation Frontend Tooling
- **Redux Toolkit** - The official, opinionated toolset for efficient Redux development
- **React Redux** - Official React bindings for Redux

### Styling and UI
- **Tailwind CSS** - A utility-first CSS framework
- **Material-UI (MUI)** - A comprehensive library of React UI components
- **@emotion/react & styled** - CSS-in-JS styling solution
- **Lucide React** - Beautiful & consistent icon set

### Development Tools
- **ESLint** - JavaScript linting utility
  - eslint-plugin-react
  - eslint-plugin-react-hooks
  - eslint-plugin-react-refresh
- **PostCSS** - A tool for transforming CSS with JavaScript
- **Autoprefixer** - PostCSS plugin to parse CSS and add vendor prefixes
- **@tailwindcss/forms** - Form styles plugin for Tailwind CSS

## Project Structure

```
src/
├── components/     # Reusable UI components
├── store/         # Redux store configuration and slices
│   ├── habitSlice.jsx
│   └── store.jsx
├── styles/        # Global styles and Tailwind utilities
├── App.jsx        # Main application component
└── main.jsx       # Application entry point
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Dependencies

### Production Dependencies
- @emotion/react: ^11.11.3
- @emotion/styled: ^11.11.0
- @mui/material: ^5.15.11
- @reduxjs/toolkit: ^2.2.1
- lucide-react: ^0.340.0
- react: ^18.2.0
- react-dom: ^18.2.0
- react-redux: ^9.1.0

### Development Dependencies
- @tailwindcss/forms: ^0.5.7
- @vitejs/plugin-react: ^4.2.1
- autoprefixer: ^10.4.17
- eslint and related plugins
- postcss: ^8.4.35
- tailwindcss: ^3.4.1
- vite: ^5.1.3

## Features

- Modern and responsive UI built with Material-UI and Tailwind CSS
- Efficient state management with Redux Toolkit
- Type-safe development environment
- Optimized build process with Vite
- Consistent code quality with ESLint
- Beautiful icons from Lucide React
- Custom form styling with @tailwindcss/forms