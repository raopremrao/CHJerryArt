/**
 * Migration Script: Upload existing images from public/images/AllArt to Supabase
 * 
 * SETUP INSTRUCTIONS:
 * 1. First, create a Supabase project at https://supabase.com
 * 2. Create the required tables (see SQL below)
 * 3. Create a storage bucket named 'artworks'
 * 4. Copy .env.example to .env and fill in your Supabase credentials
 * 5. Run: node scripts/migrate-to-supabase.js
 * 
 * REQUIRED SQL (run in Supabase SQL Editor):
 * 
 * -- Create artworks table
 * CREATE TABLE artworks (
 *   id SERIAL PRIMARY KEY,
 *   title TEXT NOT NULL,
 *   category TEXT NOT NULL,
 *   image_url TEXT NOT NULL,
 *   image_path TEXT NOT NULL,
 *   display_order INT NOT NULL DEFAULT 0,
 *   created_at TIMESTAMP DEFAULT NOW()
 * );
 * 
 * -- Create categories table
 * CREATE TABLE categories (
 *   id SERIAL PRIMARY KEY,
 *   name TEXT NOT NULL UNIQUE,
 *   display_order INT NOT NULL DEFAULT 0,
 *   created_at TIMESTAMP DEFAULT NOW()
 * );
 * 
 * -- Insert default categories
 * INSERT INTO categories (name, display_order) VALUES 
 *   ('Mehendi', 0),
 *   ('Bridal', 1),
 *   ('Cultural', 2),
 *   ('Sketch', 3),
 *   ('Mandala', 4),
 *   ('Uncategorized', 5);
 * 
 * -- Enable Row Level Security
 * ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
 * 
 * -- Allow public read access
 * CREATE POLICY "Allow public read on artworks" ON artworks FOR SELECT USING (true);
 * CREATE POLICY "Allow public read on categories" ON categories FOR SELECT USING (true);
 * 
 * -- Allow all operations (for admin - in production, use proper auth)
 * CREATE POLICY "Allow all on artworks" ON artworks FOR ALL USING (true);
 * CREATE POLICY "Allow all on categories" ON categories FOR ALL USING (true);
 * 
 * -- Create storage bucket (run in Storage section or via SQL)
 * INSERT INTO storage.buckets (id, name, public) VALUES ('artworks', 'artworks', true);
 * 
 * -- Allow public access to storage
 * CREATE POLICY "Allow public read on artworks bucket" ON storage.objects
 *   FOR SELECT USING (bucket_id = 'artworks');
 * 
 * CREATE POLICY "Allow public insert on artworks bucket" ON storage.objects
 *   FOR INSERT WITH CHECK (bucket_id = 'artworks');
 * 
 * CREATE POLICY "Allow public delete on artworks bucket" ON storage.objects
 *   FOR DELETE USING (bucket_id = 'artworks');
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...values] = line.split('=');
    if (key && values.length) {
        env[key.trim()] = values.join('=').trim();
    }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseServiceKey = env.VITE_SUPABASE_ANON_KEY; // Use service role key for migration if possible

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env file');
    console.log('Please copy .env.example to .env and fill in your credentials.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Existing artwork data to migrate
const existingArtworks = [
    { src: '/images/AllArt/Navratri.jpg', title: 'Navratri Special', category: 'Cultural' },
    { src: '/images/AllArt/hand2.jpg', title: 'Intricate Hand Art', category: 'Bridal' },
    { src: '/images/AllArt/art.jpg', title: 'Artistic Mehendi Design', category: 'Sketch' },
    { src: '/images/AllArt/hands1.jpg', title: 'Bridal Mehendi', category: 'Bridal' },
    { src: '/images/AllArt/art2.jpg', title: 'Mandala Art', category: 'Mandala' },
    { src: '/images/AllArt/hand4.jpg', title: 'Henna Aroma Design', category: 'Mehendi' },
    { src: '/images/AllArt/art3.jpg', title: 'Traditional Mehendi Pattern', category: 'Sketch' },
    { src: '/images/AllArt/hand3.jpg', title: 'Elegant Hand Design', category: 'Bridal' },
    { src: '/images/AllArt/mahendi/mahendi6.jpeg', title: 'Mahendi Design 6', category: 'Bridal' },
    { src: '/images/AllArt/mahendi/mahendi5.jpeg', title: 'Mahendi Design 5', category: 'Mehendi' },
    { src: '/images/AllArt/mahendi/mahendi4.jpeg', title: 'Mahendi Design 4', category: 'Mehendi' },
    { src: '/images/AllArt/mahendi/mahendi3.jpeg', title: 'Mahendi Design 3', category: 'Mehendi' },
    { src: '/images/AllArt/mahendi/mahendi2.jpeg', title: 'Mahendi Design 2', category: 'Bridal' },
    { src: '/images/AllArt/mahendi/mahendi1.jpeg', title: 'Mahendi Design 1', category: 'Mehendi' },
    { src: '/images/AllArt/hand/hand1.jpeg', title: 'Hand Design 1', category: 'Bridal' },
    { src: '/images/AllArt/hand/hand2.jpeg', title: 'Hand Design 2', category: 'Mehendi' },
    { src: '/images/AllArt/hand/hand3.jpeg', title: 'Hand Design 3', category: 'Mehendi' },
    { src: '/images/AllArt/hand/hand4.jpeg', title: 'Hand Design 4', category: 'Mehendi' },
    { src: '/images/AllArt/hand/hand5.jpeg', title: 'Hand Design 5', category: 'Mehendi' },
];

async function uploadImage(localPath, title, category, order) {
    const publicDir = path.join(__dirname, '..', 'public');
    const fullPath = path.join(publicDir, localPath);

    if (!fs.existsSync(fullPath)) {
        console.log(`⚠️ File not found: ${fullPath}`);
        return null;
    }

    const fileBuffer = fs.readFileSync(fullPath);
    const fileName = path.basename(fullPath);
    const ext = path.extname(fileName);
    const uniqueName = `gallery/${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`;

    console.log(`📤 Uploading: ${title}...`);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(uniqueName, fileBuffer, {
            contentType: ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png',
            upsert: true
        });

    if (uploadError) {
        console.error(`❌ Upload failed for ${title}:`, uploadError.message);
        return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('artworks')
        .getPublicUrl(uniqueName);

    // Insert database record
    const { data, error: insertError } = await supabase
        .from('artworks')
        .insert({
            title: title,
            category: category,
            image_url: publicUrl,
            image_path: uniqueName,
            display_order: order
        })
        .select()
        .single();

    if (insertError) {
        console.error(`❌ Database insert failed for ${title}:`, insertError.message);
        return null;
    }

    console.log(`✅ Uploaded: ${title}`);
    return data;
}

async function migrate() {
    console.log('\n🚀 Starting migration to Supabase...\n');
    console.log(`📊 Total images to migrate: ${existingArtworks.length}\n`);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < existingArtworks.length; i++) {
        const artwork = existingArtworks[i];
        const result = await uploadImage(artwork.src, artwork.title, artwork.category, i);

        if (result) {
            successCount++;
        } else {
            failCount++;
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Migration Complete!');
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log('='.repeat(50) + '\n');
}

migrate().catch(console.error);
