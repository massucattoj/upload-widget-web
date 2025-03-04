# Upload Widget Web

A modern web application for file uploads and management, built with Vite and React, featuring a beautiful, responsive user interface.

![Vite](https://img.shields.io/badge/Vite-6.0.5-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0.0-38B2AC?logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5.0.3-1a1a1a?logo=react&logoColor=white)
![Immer](https://img.shields.io/badge/Immer-10.1.1-00C4B6?logo=react&logoColor=white)
![Biome](https://img.shields.io/badge/Biome-1.9.4-1a1a1a?logo=biome&logoColor=white)

## 🚀 Features

- **File Upload System**: Drag-and-drop interface for easy file uploads
- **Image Compression**: Built-in image compression before upload
- **Progress Tracking**: Real-time upload progress indicators
- **Responsive Design**: Mobile-first approach with modern UI components
- **Minimizable Widget**: Can be minimized to a button for better UX
- **File Size Formatting**: Human-readable file size display
- **Accessible Components**: Built with Radix UI primitives
- **Smooth Animations**: Powered by Motion library

## 🛠️ Tech Stack

- **Build Tool**: Vite
- **Framework**: React
- **Styling**: 
  - Tailwind CSS
  - Tailwind Variants for component variants
- **UI Components**: 
  - Radix UI primitives (Collapsible, Progress, Scroll Area, Slot)
  - Lucide React for icons
- **State Management**: 
  - Zustand for global state management
  - Immer for immutable state updates
- **File Handling**:
  - React Dropzone for drag-and-drop functionality
  - Axios for HTTP requests
- **Code Quality**: 
  - Biome for code formatting and linting
  - ESLint for additional linting
- **Type Safety**: TypeScript

## 📦 Project Structure

```
├── src/                         # Source code
│   ├── components/              # React components
│   │   ├── ui/                  # Reusable UI components
│   │   └── upload-widget-*.tsx  # Upload widget components
│   ├── http/                    # API and HTTP utilities
│   ├── store/                   # Zustand store configurations
│   └── utils/                   # Utility functions
├── public/                      # Static assets
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── vite.config.ts               # Vite configuration
```

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/massucattoj/upload-widget-web
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# Add your environment variables here
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vite team for the amazing build tool
- React team for the powerful framework
- All contributors who have helped shape this project 