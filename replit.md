# MUBU Frontend

A React + TypeScript frontend application for price comparison, built with Vite.

## Overview

This is a Korean language price comparison web application that allows users to compare prices of products found overseas with Korean prices.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Routing**: React Router DOM

## Project Structure

```
src/
├── api/          # API client functions and types
├── components/   # React components
├── hooks/        # Custom React hooks
├── pages/        # Page components
├── store/        # Zustand state stores
└── utils/        # Utility functions
```

## Development

Run the development server:
```bash
npm run dev
```

The app runs on port 5000 and is accessible via the Replit webview.

## Build

Build for production:
```bash
npm run build
```

## Deployment

The project is configured for static deployment. The build output is in the `dist` directory.
