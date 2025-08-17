# 🚀 Marketing Workflow - AI Video Editor

> A professional AI-powered marketing video editor built with Next.js 15, React 19, and cutting-edge web technologies.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## ✨ Features

### 🎬 Advanced Video Editor

- **Timeline Management**: Drag-and-drop video clips with trimming and cutting
- **Audio Support**: Waveform visualization, volume control, and audio tracks
- **Real-time Preview**: Synchronized playback with timeline
- **Professional Tools**: Cut, trim, duplicate with context menus
- **Export**: FFmpeg-based video export with custom settings

### 🤖 AI-Powered Content Creation

- **Multi-Format Support**: TEXT, IMAGE, and VIDEO content generation
- **Platform Optimization**: Tailored content for YouTube, Instagram, TikTok, Facebook, LinkedIn
- **Smart Suggestions**: AI recommendations for editing improvements
- **Automated Processing**: AI-driven video enhancement

### 📊 Content Management

- **Folder Organization**: Custom folders with color coding and creation tracking
- **Recent Creations**: Quick access to latest generated content
- **Results Display**: Accordion-based results with pagination and variations
- **Export Options**: Multiple format support with platform-specific optimization

### 🎨 Professional UI/UX

- **Light/Dark Themes**: Comprehensive theme system with custom colors
- **Responsive Design**: Works seamlessly on desktop and tablet devices
- **Professional Interface**: Clean, modern design inspired by industry tools
- **Keyboard Shortcuts**: Efficient workflow with keyboard navigation

## 🏗️ Tech Stack

### Frontend Framework

- **Next.js 15**: App Router with React Server Components
- **React 19**: Latest React features with concurrent rendering
- **TypeScript**: Strict type checking for enhanced development experience

### Styling & UI

- **Tailwind CSS v4**: Utility-first CSS with CSS custom properties
- **Shadcn/ui**: Pre-built accessible UI components
- **Radix UI**: Unstyled, accessible component primitives
- **Framer Motion**: Professional animations and transitions

### Video Processing

- **@dnd-kit**: Drag and drop functionality for timeline management
- **ReactPlayer**: Video playback and control
- **FFmpeg**: Video processing and export (WebAssembly)
- **Web Audio API**: Audio waveform generation and analysis
- **Canvas API**: Video thumbnail generation and visual effects

### State Management & Forms

- **Zustand**: Lightweight state management for video editor
- **React Hook Form**: Efficient form handling with validation
- **React**: Built-in state management for local component state

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Modern browser with WebAssembly support

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/RianKhanafi/omnisenti-marketing-fe.git
   cd marketing-workflow
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Create production build
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Recommended workflow
pnpm lint && pnpm build    # Validate before deployment
```

## 📁 Project Structure

```
marketing-workflow/
├── app/                          # Next.js 15 App Router
│   ├── creation/                 # Content creation pages
│   │   ├── new/                  # New content creation form
│   │   │   └── _components/      # Modular form components
│   │   ├── detail/               # Content result pages
│   │   └── folder/               # Folder management
│   ├── editor/                   # Video editor application
│   ├── home/                     # Home dashboard
│   └── layout.tsx                # Root layout with theme provider
├── components/
│   ├── ui/                       # Shadcn/ui components
│   ├── video-editor/             # Video editing components
│   ├── shared/                   # Shared business components
│   └── layout/                   # Layout components
├── hooks/
│   └── video-editor/             # Custom video editing hooks
├── lib/
│   ├── video-editor/             # Video editor utilities and types
│   └── utils.ts                  # General utilities
├── services/                     # API service layers
├── types/                        # TypeScript type definitions
└── public/                       # Static assets and sample media
```

## 🎯 Core Features Guide

### Content Creation Workflow

1. **Select Content Type**: Choose between TEXT, IMAGE, or VIDEO
2. **Configure Settings**: Set platform-specific options and ratios
3. **Fill Form Sections**:
   - **Main Prompt**: Describe your content idea
   - **Basics**: Platform selection, audience targeting, campaign goals
   - **Marketing Focus**: Value proposition, USP, features, CTA
   - **Style & Optimization**: Tone, language, emoji preferences
   - **Folders**: Organize content in custom folders
4. **Generate Content**: AI processes your inputs and creates optimized content
5. **Review Results**: View generated content with variations and editing options

### Video Editor Features

- **Timeline**: Multi-track timeline with video and audio support
- **Clips**: Drag, drop, trim, cut, and arrange video clips
- **Audio**: Waveform visualization with volume controls
- **Preview**: Real-time video preview with playback controls
- **Export**: Professional video export with quality settings

### Folder Management

- **Create Folders**: Custom folders with color coding
- **Organization**: Track creation counts and dates
- **Preview**: Visual folder previews with customizable colors
- **Management**: Edit, delete, and organize content efficiently

## 🎨 Design System

### Color Palette

- **Primary**: `#9E2AB2` (Purple) - Brand color for CTAs and highlights
- **Secondary**: `#F79E6E` (Orange) - Accent color for secondary actions
- **Background**: `#F6F8FA` (Light Gray) - Main background color
- **Surface**: `#FFFFFF` (White) - Card and component backgrounds

### Typography

- **Font Family**: DM Sans (Google Fonts)
- **Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

### Component Patterns

- **Rounded Corners**: 12px, 16px, 20px, 24px radius scale
- **Shadows**: Minimal shadow usage for depth
- **Spacing**: 4px, 8px, 12px, 16px, 24px, 32px, 48px scale
- **Interactive States**: Hover, focus, and active states for all components

## 🔧 Development Guidelines

### Code Standards

- **TypeScript First**: Strict mode enabled, no `any` types
- **Component-Based**: Reusable, composable components
- **Custom Hooks**: Extract business logic into reusable hooks
- **Server Components**: Use RSC where appropriate for better performance

### Performance Optimization

- **Lazy Loading**: Dynamic imports for video components
- **Image Optimization**: Next.js Image component for thumbnails
- **Bundle Optimization**: Tree shaking and code splitting
- **Web Workers**: Video processing in background threads

### Testing & Quality

- **ESLint**: Comprehensive linting with Next.js and TypeScript rules
- **TypeScript**: Strict type checking prevents runtime errors
- **Performance**: Optimized for large video files and real-time editing

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow the coding standards
4. **Run tests**: `pnpm lint && pnpm build`
5. **Commit changes**: Use conventional commit messages
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Commit Convention

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting, missing semicolons, etc.
refactor: code restructuring
test: adding or updating tests
chore: maintenance tasks
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Shadcn** for the beautiful UI components
- **Radix UI** for accessible primitives
- **Tailwind CSS** for the utility-first approach
- **FFmpeg** for video processing capabilities

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/RianKhanafi/omnisenti-marketing-fe/issues)
- **Discussions**: [GitHub Discussions](https://github.com/RianKhanafi/omnisenti-marketing-fe/discussions)
- **Email**: [Contact](mailto:your-email@example.com)

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/RianKhanafi">Rian Khanafi</a></p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>
