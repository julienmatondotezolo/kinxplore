# KinXplore

**Your Personalized Kinshasa Trip Planner**

KinXplore is the mobile-optimized web app that designs your perfect Kinshasa trip. Just tell us your trip style (Party, Relax, Family, etc.) and group size, and we'll instantly generate a personalized itinerary tailored precisely to your needs and preferences. Explore Kinshasa, your way!

## Features

- 🎯 **Personalized Itineraries** - Get custom trip plans based on your travel style and group size
- 📱 **Mobile-Optimized** - Designed to work seamlessly on all mobile devices
- 🌍 **Multi-Language Support** - Available in English, French, and Dutch
- 🎨 **Modern UI** - Beautiful, responsive interface with dark mode support
- ⚡ **Fast & Efficient** - Built with Next.js for optimal performance

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl
- **UI Components**: Radix UI
- **Theme**: next-themes (dark mode support)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kinxplore
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues
- `npm run export` - Build and export the app as static HTML

## Project Structure

```
kinxplore/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── [locale]/     # Internationalized routes
│   │   └── api/          # API routes and data
│   ├── components/       # React components
│   ├── assets/           # Static assets and styles
│   ├── lib/              # Utility functions
│   └── navigation.ts     # Navigation configuration
├── messages/             # Translation files (en, fr, nl)
└── public/               # Public static files
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Next.js Learn](https://nextjs.org/learn) - Interactive Next.js tutorial
- [next-intl Documentation](https://next-intl-docs.vercel.app/) - Internationalization for Next.js

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Julien Matondo
