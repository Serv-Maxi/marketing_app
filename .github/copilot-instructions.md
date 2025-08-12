# Marketing Workflow - AI Video Editor

This is a Next.js 15 based repository with React 19 for building a professional AI-powered marketing video editor. It features advanced video editing capabilities, real-time preview, timeline management, and AI chat integration. Please follow these guidelines when contributing:

## Code Standards

### Required Before Each Commit

- Run `npm run lint` before committing any changes to ensure proper code formatting and catch TypeScript errors
- Run `npm run build` to verify the production build works correctly
- Ensure all TypeScript types are properly defined and no `any` types are used

### Development Flow

- Development: `npm run dev` (starts Next.js development server on port 3000)
- Build: `npm run build` (creates production build)
- Start: `npm run start` (starts production server)
- Lint: `npm run lint` (runs ESLint with Next.js and TypeScript rules)

## Repository Structure

### Core Application (`app/`)

- `app/`: Next.js 15 App Router pages and layouts using React Server Components
- `app/layout.tsx`: Root layout with theme provider and global styles
- `app/page.tsx`: Landing page
- `app/editor/`: Video editor application pages
- `app/chat/`: NOT USED. WILL BE REMOVED IN FUTURE
- `app/home/`: Home AI chat interface pages
- `app/globals.css`: Global styles with Tailwind CSS v4 and CSS custom properties

### Components (`components/`)

- `components/ui/`: Shadcn/ui components (buttons, dialogs, dropdowns, etc.)
- `components/video-editor/`: Core video editing components (Timeline, VideoPreview, ClipBlock, AudioBlock)
- `components/chat/`: AI chat interface components
- `components/layout/`: Layout components (header, sidebar, theme provider)

### Business Logic (`hooks/`, `lib/`, `services/`)

- `hooks/`: Custom React hooks, especially `hooks/video-editor/` for timeline and video processing
- `lib/`: Utility functions and core logic
- `lib/video-editor/`: Video editor types, utilities, and core logic
- `services/`: API service layers for external integrations
- `types/`: TypeScript type definitions

### Configuration & Assets

- `public/`: Static assets (videos, icons, sample media files)
- `components.json`: Shadcn/ui configuration
- `tsconfig.json`: TypeScript configuration with strict mode enabled
- `next.config.ts`: Next.js configuration
- `tailwind.config.js`: Tailwind CSS v4 configuration

## Key Technologies & Patterns

### Frontend Stack

- **Next.js 15**: App Router, React Server Components, TypeScript
- **React 19**: Latest React features with concurrent rendering
- **Tailwind CSS v4**: Utility-first CSS with CSS custom properties
- **Shadcn/ui**: Pre-built accessible UI components
- **Zustand**: Lightweight state management for video editor state

### Video Editing Stack

- **@dnd-kit**: Drag and drop functionality for timeline management
- **ReactPlayer**: Video playback and control
- **FFmpeg**: Video processing and export (WebAssembly)
- **Web Audio API**: Audio waveform generation and analysis
- **Canvas API**: Video thumbnail generation and visual effects

### Development Patterns

- **TypeScript First**: All code must be properly typed
- **Component-Based Architecture**: Reusable, composable components and always use shadcn/ui components
- **Custom Hooks**: Business logic extracted into reusable hooks
- **Server Components**: Use RSC where appropriate for better performance
- **Forms**: Use `react-hook-form` for form shadecn components

## Key Guidelines

### 1. TypeScript Best Practices

- Use strict TypeScript configuration with no `any` types
- Define proper interfaces for all props and state
- Use generic types for reusable components and hooks
- Leverage TypeScript's utility types (Partial, Pick, Omit, etc.)

### 2. Component Architecture

- Follow the component structure: `components/[feature]/ComponentName.tsx`
- Use React Server Components for static content, Client Components for interactivity
- Implement proper error boundaries for video processing components
- Use `"use client"` directive only when necessary for client-side features

### 3. State Management Patterns

- Use Zustand for complex state (video editor timeline, clips, audio tracks)
- Use React state for local component state
- Implement proper state persistence for video editing sessions
- Use refs for DOM manipulation and avoiding closure issues in event listeners

### 4. Video Editor Specific Guidelines

- **Timeline Management**: All timeline operations must maintain clip ordering and timing integrity
- **Performance**: Optimize video processing with Web Workers and streaming
- **Real-time Updates**: Ensure timeline and preview stay synchronized
- **Undo/Redo**: Implement state history for user actions
- **Export Quality**: Maintain video quality during processing and export

### 5. Styling Guidelines

- Use Tailwind CSS classes with semantic naming
- Leverage CSS custom properties for theme consistency
- Implement responsive design for all video editing interfaces
- Use Framer Motion for professional animations and transitions
- Follow the design system defined in `globals.css`
- Always remove or dont use the default shadow in tailwind components

### 6. Testing & Quality

- Write unit tests for complex video processing logic
- Test video editor functionality across different browsers
- Ensure accessibility compliance for all UI components
- Validate video file handling and error states
- Test performance with large video files

### 7. Performance Optimization

- Implement lazy loading for video components
- Use Next.js Image optimization for thumbnails
- Optimize bundle size with dynamic imports
- Implement proper memoization for expensive calculations
- Use Web Workers for video processing tasks

## Core Features

### Video Editor

- **Timeline**: Drag-and-drop video clips with trimming and cutting
- **Audio Support**: Waveform visualization, volume control, audio tracks
- **Real-time Preview**: Synchronized playbook with timeline
- **Export**: FFmpeg-based video export with custom settings
- **Professional Tools**: Cut, trim, duplicate, context menus

### AI Integration

- **Chat Interface**: AI-powered assistance for video editing
- **Smart Suggestions**: AI recommendations for editing improvements
- **Automated Processing**: AI-driven video enhancement

### User Experience

- **Light/Dark Themes**: Comprehensive theme system
- **Responsive Design**: Works on desktop and tablet devices
- **Professional UI**: Clean, modern interface inspired by industry tools
- **Keyboard Shortcuts**: Efficient workflow with keyboard navigation

## Response Rules

- Ask one clarifying question at a time, only when needed
- Use concise bullet points or tables
- Avoid overwhelming users
- Always confirm before moving to the next step or ending
- Use tools only if data is sufficient; otherwise, ask for missing info

## Development Notes

- The project uses pnpm as the package manager
- Video files are stored in `public/` for development testing
- The design system uses purple (#9E2AB2) as primary and orange (#F79E6E) as secondary colors
- All video editor components support both light and dark themes
- The application is optimized for modern browsers with WebAssembly support

## Contributing

When adding new features:

1. Follow the established folder structure and naming conventions
2. Add proper TypeScript types for new functionality
3. Implement error handling for video processing operations
4. Test across different video formats and sizes
5. Update documentation for new components or APIs
6. Ensure compatibility with the existing theme system
7. Add appropriate loading states and user feedback
