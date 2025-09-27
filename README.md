# SpaceX Mission Explorer

A comprehensive React application that allows users to explore SpaceX launches and missions through an intuitive, responsive interface. Built with modern web technologies to provide real-time data from SpaceX's public API.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.5-06B6D4) ![Vite](https://img.shields.io/badge/Vite-4.5.0-646CFF) ![Testing Library](https://img.shields.io/badge/Testing%20Library-13.4.0-E33332)

## 📋 Project Overview

SpaceX Mission Explorer is a web application designed to provide users with an engaging way to discover and explore SpaceX's launch history and upcoming missions. The application fetches real-time data from SpaceX's public API and presents it through an interactive, user-friendly interface that includes search functionality, filtering options, and detailed mission information.

Users can browse through SpaceX launches, search for specific missions, filter by various criteria, save their favorite launches, and view detailed information including mission patches, launch dates, success status, and related links.

## ✨ Features

### Core Functionality
- **🔍 Smart Search**: Real-time search with debounced input (300ms) across mission names and rocket types
- **📅 Year Filtering**: Dropdown filter to view launches from specific years
- **✅ Success Toggle**: Filter to show only successful launches
- **⭐ Favorites System**: Mark and unmark missions as favorites with persistent localStorage storage
- **📱 Responsive Design**: Mobile-first design that adapts to all screen sizes
- **♿ Accessibility**: Full keyboard navigation, ARIA labels, and screen reader support

### User Experience
- **🎯 Detail View Modal**: Click any launch card to view comprehensive mission details
- **🖼️ Mission Patches**: Display official SpaceX mission patches and images
- **⚡ Loading States**: Skeleton loaders and smooth loading animations
- **🔄 Error Handling**: User-friendly error messages with retry functionality
- **📊 Status Badges**: Clear visual indicators for launch success/failure status

### Technical Features
- **🏗️ Component Architecture**: Modular, reusable React components
- **🔄 State Management**: React Context API for global favorites state
- **💾 Data Persistence**: localStorage integration for favorites
- **🧪 Comprehensive Testing**: Unit tests with React Testing Library
- **📱 Mobile Optimization**: Touch-friendly interface with responsive breakpoints

## 🛠️ Tech Stack

### Frontend Technologies
- **React 18.2.0**: Modern React with hooks and functional components
- **TailwindCSS 3.3.5**: Utility-first CSS framework for rapid styling
- **Vite 4.5.0**: Fast build tool and development server
- **Context API**: Built-in React state management for favorites

### Development & Testing
- **React Testing Library**: Component testing and user interaction simulation
- **Vitest**: Fast unit testing framework
- **Jest DOM**: Custom matchers for DOM testing
- **ESLint**: Code quality and consistency enforcement

### Data & Storage
- **SpaceX API v4**: Real-time launch and rocket data
- **localStorage**: Browser-based data persistence
- **Fetch API**: Modern HTTP client for API requests

### Build & Deployment
- **Vite Build**: Optimized production builds
- **PostCSS**: CSS processing and optimization
- **Autoprefixer**: Automatic vendor prefixing

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <https://github.com/aryankuttarmare14/spacex-mission-explorer>
   cd spacex-mission-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm test             # Run all tests
npm run test:ui      # Run tests with UI
npm run coverage     # Run tests with coverage

# Code Quality
npm run lint         # Run ESLint
```

## 🧪 Testing

The project includes comprehensive test coverage using React Testing Library:

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run coverage

# Run tests in watch mode
npm run test:watch
```

### Test Coverage Areas
- **LaunchList Component**: Rendering, filtering, and user interactions
- **Favorites System**: Context provider, localStorage persistence, and toggle functionality  
- **LaunchModal Component**: Modal rendering, keyboard navigation, and external links
- **API Integration**: Mock API responses and error handling
- **Accessibility**: Keyboard navigation and ARIA attributes

## 🏗️ Project Structure

```
spacex-mission-explorer/
├── public/                    # Static assets
├── src/                       # Source code
│   ├── components/            # React components
│   │   ├── Header.jsx         # Application header with search
│   │   ├── Filters.jsx        # Filter controls (year, success, favorites)
│   │   ├── LaunchList.jsx     # Launch cards container
│   │   ├── LaunchCard.jsx     # Individual launch card component
│   │   ├── LaunchModal.jsx    # Detailed launch information modal
│   │   └── SkeletonCard.jsx   # Loading skeleton component
│   ├── context/               # React Context providers
│   │   └── FavoritesContext.jsx # Global favorites state management
│   ├── hooks/                 # Custom React hooks
│   │   └── useDebounce.js     # Debounce hook for search functionality
│   ├── styles/                # Global styles
│   │   └── index.css          # TailwindCSS imports and custom styles
│   ├── test/                  # Test configuration
│   │   └── setup.js           # Test environment setup
│   ├── api.js                 # SpaceX API service functions
│   ├── App.jsx                # Main application component
│   └── main.jsx               # Application entry point
├── tests/                     # Test files
│   ├── LaunchList.test.jsx    # Launch list component tests
│   ├── Favorites.test.jsx     # Favorites context tests
│   └── LaunchModal.test.jsx   # Modal component tests
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # TailwindCSS configuration
├── postcss.config.js          # PostCSS configuration
└── README.md                  # Project documentation
```

## 🔗 API References

This application integrates with SpaceX's public API v4:

### Endpoints Used
- **Launches API**: `https://api.spacexdata.com/v4/launches`
  - Returns comprehensive launch data including mission details, dates, success status, and links
- **Rockets API**: `https://api.spacexdata.com/v4/rockets`
  - Provides rocket information including names, types, and specifications

### Data Flow
1. **Parallel Fetching**: Both APIs are called simultaneously for optimal performance
2. **Data Merging**: Launch data is enriched with rocket names and types
3. **Client-side Processing**: Filtering and searching happen in the browser for fast interactions
4. **Error Handling**: Graceful fallbacks for API failures with retry functionality

### API Documentation
- [SpaceX API v4 Documentation](https://docs.spacexdata.com/)
- [Launches Endpoint](https://docs.spacexdata.com/?version=latest#fce450d6-e064-499a-b88d-182cc0332eae)
- [Rockets Endpoint](https://docs.spacexdata.com/?version=latest#fce450d6-e064-499a-b88d-182cc0332eae)

## 🚀 Deployment

### Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aryankuttarmare14/spacex-mission-explorer)


```


### Live Demo
🔗 **[View Live Demo](https://your-demo-url.vercel.app)** *(Update with your deployment URL)*


## 🏆 Conclusion

The SpaceX Mission Explorer successfully demonstrates modern React development practices while providing users with an engaging way to explore SpaceX's launch history. The application showcases proficiency in:

- **Frontend Development**: React, TailwindCSS, and modern JavaScript
- **API Integration**: Real-time data fetching and processing
- **User Interface Design**: Responsive, accessible, and intuitive design
- **Testing**: Comprehensive test coverage and quality assurance
- **Deployment**: Modern deployment pipelines and hosting solutions

This project serves as a portfolio piece that demonstrates technical competency in full-stack web development, attention to user experience, and commitment to code quality and best practices.

---

**Built with ❤️ for space enthusiasts and aspiring developers**

*This project was developed as part of a technical assignment to showcase modern React development skills, API integration, and professional software development practices.*
