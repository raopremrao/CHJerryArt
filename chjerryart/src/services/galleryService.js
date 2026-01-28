import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

// Fallback artwork data when Supabase is not configured
const fallbackArtworks = [
    { id: 1, src: '/images/AllArt/Navratri.jpg', title: 'Navratri Special', category: 'Cultural' },
    { id: 2, src: '/images/AllArt/hand2.jpg', title: 'Intricate Hand Art', category: 'Bridal' },
    { id: 3, src: '/images/AllArt/art.jpg', title: 'Artistic Mehendi Design', category: 'Sketch' },
    { id: 4, src: '/images/AllArt/hands1.jpg', title: 'Bridal Mehendi', category: 'Bridal' },
    { id: 5, src: '/images/AllArt/art2.jpg', title: 'Mandala Art', category: 'Mandala' },
    { id: 6, src: '/images/AllArt/hand4.jpg', title: 'Henna Aroma Design', category: 'Mehendi' },
    { id: 7, src: '/images/AllArt/art3.jpg', title: 'Traditional Mehendi Pattern', category: 'Sketch' },
    { id: 8, src: '/images/AllArt/hand3.jpg', title: 'Elegant Hand Design', category: 'Bridal' },
    { id: 9, src: '/images/AllArt/mahendi/mahendi6.jpeg', title: 'Mahendi Design', category: 'Bridal' },
    { id: 10, src: '/images/AllArt/mahendi/mahendi5.jpeg', title: 'Mahendi Design', category: 'Mehendi' },
    { id: 11, src: '/images/AllArt/mahendi/mahendi4.jpeg', title: 'Mahendi Design', category: 'Mehendi' },
    { id: 12, src: '/images/AllArt/mahendi/mahendi3.jpeg', title: 'Mahendi Design', category: 'Mehendi' },
    { id: 13, src: '/images/AllArt/mahendi/mahendi2.jpeg', title: 'Mahendi Design', category: 'Bridal' },
    { id: 14, src: '/images/AllArt/mahendi/mahendi1.jpeg', title: 'Mahendi Design', category: 'Mehendi' },
    { id: 15, src: '/images/AllArt/hand/hand1.jpeg', title: 'Mahendi Design', category: 'Bridal' },
    { id: 16, src: '/images/AllArt/hand/hand2.jpeg', title: 'Mahendi Design', category: 'Mehendi' },
    { id: 17, src: '/images/AllArt/hand/hand3.jpeg', title: 'Mahendi Design', category: 'Mehendi' },
    { id: 18, src: '/images/AllArt/hand/hand4.jpeg', title: 'Mahendi Design', category: 'Mehendi' },
    { id: 19, src: '/images/AllArt/hand/hand5.jpeg', title: 'Mahendi Design', category: 'Mehendi' },
];

// Default categories
const defaultCategories = ['All', 'Mehendi', 'Bridal', 'Cultural', 'Sketch', 'Mandala'];

/**
 * Fetch all artworks from Supabase, sorted by display_order
 */
export const fetchArtworks = async () => {
    if (!isSupabaseConfigured()) {
        return { data: fallbackArtworks, error: null };
    }

    try {
        const { data, error } = await supabase
            .from('artworks')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;

        // Transform database records to match component expectations
        const artworks = data.map(item => ({
            id: item.id,
            src: item.image_url,
            title: item.title,
            category: item.category,
            imagePath: item.image_path,
            displayOrder: item.display_order
        }));

        return { data: artworks, error: null };
    } catch (error) {
        console.error('Error fetching artworks:', error);
        return { data: fallbackArtworks, error };
    }
};

/**
 * Upload a new artwork image and create database record
 */
export const uploadArtwork = async (file, title, category) => {
    if (!isSupabaseConfigured()) {
        return { data: null, error: new Error('Supabase not configured') };
    }

    try {
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('artworks')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('artworks')
            .getPublicUrl(filePath);

        // Get current max display_order
        const { data: maxOrderData } = await supabase
            .from('artworks')
            .select('display_order')
            .order('display_order', { ascending: false })
            .limit(1);

        const newOrder = maxOrderData && maxOrderData.length > 0
            ? maxOrderData[0].display_order + 1
            : 0;

        // Create database record
        const { data, error: insertError } = await supabase
            .from('artworks')
            .insert({
                title: title,
                category: category,
                image_url: publicUrl,
                image_path: filePath,
                display_order: newOrder
            })
            .select()
            .single();

        if (insertError) throw insertError;

        return {
            data: {
                id: data.id,
                src: data.image_url,
                title: data.title,
                category: data.category,
                imagePath: data.image_path,
                displayOrder: data.display_order
            },
            error: null
        };
    } catch (error) {
        console.error('Error uploading artwork:', error);
        return { data: null, error };
    }
};

/**
 * Delete an artwork (image from storage + database record)
 */
export const deleteArtwork = async (id, imagePath) => {
    if (!isSupabaseConfigured()) {
        return { error: new Error('Supabase not configured') };
    }

    try {
        // Delete from storage
        if (imagePath) {
            const { error: storageError } = await supabase.storage
                .from('artworks')
                .remove([imagePath]);

            if (storageError) console.warn('Storage delete warning:', storageError);
        }

        // Delete database record
        const { error: deleteError } = await supabase
            .from('artworks')
            .delete()
            .eq('id', id);

        if (deleteError) throw deleteError;

        return { error: null };
    } catch (error) {
        console.error('Error deleting artwork:', error);
        return { error };
    }
};

/**
 * Update artwork details (title or category)
 */
export const updateArtwork = async (id, updates) => {
    if (!isSupabaseConfigured()) {
        return { data: null, error: new Error('Supabase not configured') };
    }

    try {
        const { data, error } = await supabase
            .from('artworks')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return {
            data: {
                id: data.id,
                src: data.image_url,
                title: data.title,
                category: data.category,
                imagePath: data.image_path,
                displayOrder: data.display_order
            },
            error: null
        };
    } catch (error) {
        console.error('Error updating artwork:', error);
        return { data: null, error };
    }
};

/**
 * Reorder artworks by updating display_order
 */
export const reorderArtworks = async (artworks) => {
    if (!isSupabaseConfigured()) {
        return { error: new Error('Supabase not configured') };
    }

    try {
        // Update each artwork's display_order
        const updates = artworks.map((artwork, index) =>
            supabase
                .from('artworks')
                .update({ display_order: index })
                .eq('id', artwork.id)
        );

        await Promise.all(updates);
        return { error: null };
    } catch (error) {
        console.error('Error reordering artworks:', error);
        return { error };
    }
};

/**
 * Fetch categories from Supabase or return defaults
 */
export const fetchCategories = async () => {
    if (!isSupabaseConfigured()) {
        return { data: defaultCategories, error: null };
    }

    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;

        // Return 'All' + database categories
        const categories = ['All', ...data.map(c => c.name)];
        return { data: categories, error: null };
    } catch (error) {
        console.error('Error fetching categories:', error);
        return { data: defaultCategories, error };
    }
};

/**
 * Add a new category
 */
export const addCategory = async (name) => {
    if (!isSupabaseConfigured()) {
        return { data: null, error: new Error('Supabase not configured') };
    }

    try {
        // Get max order
        const { data: maxOrderData } = await supabase
            .from('categories')
            .select('display_order')
            .order('display_order', { ascending: false })
            .limit(1);

        const newOrder = maxOrderData && maxOrderData.length > 0
            ? maxOrderData[0].display_order + 1
            : 0;

        const { data, error } = await supabase
            .from('categories')
            .insert({ name, display_order: newOrder })
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error adding category:', error);
        return { data: null, error };
    }
};

/**
 * Remove a category (images are NOT deleted, just their category becomes uncategorized)
 */
export const removeCategory = async (name) => {
    if (!isSupabaseConfigured()) {
        return { error: new Error('Supabase not configured') };
    }

    try {
        // Update artworks in this category to 'Uncategorized'
        await supabase
            .from('artworks')
            .update({ category: 'Uncategorized' })
            .eq('category', name);

        // Delete the category
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('name', name);

        if (error) throw error;
        return { error: null };
    } catch (error) {
        console.error('Error removing category:', error);
        return { error };
    }
};

export { isSupabaseConfigured };
