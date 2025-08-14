# Setup Guide

## Environment Configuration

1. Create a `.env.local` file in the root directory with the following content:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/tonematch"

# Next.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

2. Replace the database URL with your actual PostgreSQL connection string.

## Database Setup

1. Make sure you have PostgreSQL installed and running
2. Create a new database named `tonematch`
3. Run the following commands:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database with sample data
npm run db:seed
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at http://localhost:3000 