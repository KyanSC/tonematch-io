# ToneMatch.io

A responsive web application that helps guitarists replicate the tones of their favorite songs using their own gear. Users input their guitar and amp models, search for songs, and receive optimized settings tailored to their specific equipment.

## 🎸 Features

- **Gear Selection**: Choose from 10 popular guitars and 10 amplifiers
- **Song Search**: Search through 20+ classic rock songs with debounced real-time search
- **Tone Matching**: Get personalized amp settings based on your specific gear
- **Visual Knob Interface**: Intuitive visual representation of amp controls
- **Confidence Scoring**: See how well the settings match your gear
- **Local Storage**: Save your gear preferences for quick access
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: Headless UI
- **Icons**: Heroicons
- **Deployment**: Vercel-ready

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tonematch-io
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your PostgreSQL database URL:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/tonematch"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed the database with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The application uses the following Prisma models:

- **Guitar**: Brand, model, pickup type, tone controls
- **Amp**: Brand, model, amp type, channels, controls
- **Song**: Title, artist, genre, year
- **Tone**: Name, description, difficulty, base settings
- **GearMatch**: Matches tones to specific gear combinations

## 🎛️ Core Pages

1. **Home** (`/`): Landing page with features and call-to-action
2. **Gear Selection** (`/gear`): Choose your guitar and amplifier
3. **Song Search** (`/search`): Search and filter songs
4. **Tone Results** (`/tone/[songId]`): View tone settings for a specific song

## 🔧 API Routes

- `GET /api/gear` - Fetch guitars and amps
- `GET /api/songs` - Search songs with filters
- `GET /api/tones` - Get tones and gear matches

## 🎯 Tone Matching Algorithm

The application includes a sophisticated tone matching algorithm that:

- Adjusts settings based on pickup type (single-coil vs humbucker)
- Considers amp characteristics (tube vs solid-state vs modeling)
- Calculates confidence scores for gear compatibility
- Provides pickup position recommendations

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `DATABASE_URL` environment variable
4. Deploy!

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 📈 Future Enhancements

- **Phase 2 Features**:
  - Advanced visual knob representations
  - Improved confidence scoring algorithm
  - Advanced filters (genre/decade)
  - Analytics dashboard
  - User accounts and favorites
  - More gear and songs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎵 Sample Data

The application comes pre-loaded with:

- **20 Songs**: Classic rock hits from the 1950s-1990s
- **10 Guitars**: Popular models from Fender, Gibson, PRS, etc.
- **10 Amps**: Iconic amplifiers from Marshall, Fender, Boss, etc.
- **50+ Tones**: Multiple tone settings per song (intro, verse, solo, etc.)

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include your environment details and error messages

---

**Happy tone hunting! 🎸**
