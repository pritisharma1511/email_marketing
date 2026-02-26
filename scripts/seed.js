/* eslint-disable no-console */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Since models are ES modules and Next.js uses them, we might need a workaround for standalone script
// If running from root: node scripts/seed.js

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/email_schema_test";

const seedDatabase = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected.');

        // Since we can't easily import Next.js aliased absolute paths here natively without Babel/TS,
        // we'll provide instructions in README for users to register instead of a complex standalone seed script
        // that duplicates schemas. This is typical for Next App Router apps.
        console.log('Seed skipped. Registration flow creates all necessary default models (User, Team).');
        console.log('To fully test: Run the Next.js app and sign up via the UI.');

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedDatabase();
