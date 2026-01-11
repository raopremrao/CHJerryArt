// Artwork data for C.H. Divya's portfolio
// Categories: Mehendi, Bridal, Sketch, Cultural, Mandala

export const artworks = [
    // MEHENDI DESIGNS
    {
        id: 1,
        title: 'Intricate Bridal Mehendi',
        category: 'Bridal',
        image: '/images/bridal-mehendi-1.jpg',
        description: 'Detailed bridal mehendi design with traditional motifs',
    },
    {
        id: 2,
        title: 'Arabic Mehendi Pattern',
        category: 'Mehendi',
        image: '/images/arabic-mehendi-1.jpg',
        description: 'Bold Arabic-style mehendi with flowing patterns',
    },
    {
        id: 3,
        title: 'Full Hand Bridal Design',
        category: 'Bridal',
        image: '/images/bridal-mehendi-2.jpg',
        description: 'Complete bridal mehendi covering hands and arms',
    },
    {
        id: 4,
        title: 'Floral Mehendi Art',
        category: 'Mehendi',
        image: '/images/floral-mehendi-1.jpg',
        description: 'Delicate floral patterns with peacock motifs',
    },
    {
        id: 5,
        title: 'Mandala Palm Design',
        category: 'Mandala',
        image: '/images/mandala-palm-1.jpg',
        description: 'Symmetrical mandala design centered on palm',
    },

    // SKETCHES
    {
        id: 6,
        title: 'Radha Krishna Portrait',
        category: 'Sketch',
        image: '/images/radha-krishna-sketch.jpg',
        description: 'Detailed pencil sketch of Radha and Krishna',
    },
    {
        id: 7,
        title: 'Shiva Portrait',
        category: 'Cultural',
        image: '/images/shiva-sketch.jpg',
        description: 'Artistic rendering of Lord Shiva with vibrant colors',
    },
    {
        id: 8,
        title: 'Classical Dancer',
        category: 'Sketch',
        image: '/images/dancer-sketch.jpg',
        description: 'Graceful Indian classical dancer in motion',
    },
    {
        id: 9,
        title: 'Peacock Mandala',
        category: 'Mandala',
        image: '/images/peacock-mandala.jpg',
        description: 'Intricate peacock-themed mandala art',
    },

    // CULTURAL ART
    {
        id: 10,
        title: 'Traditional Bridal Setup',
        category: 'Cultural',
        image: '/images/cultural-bridal.jpg',
        description: 'Complete bridal mehendi and accessories',
    },
    {
        id: 11,
        title: 'Mehendi Close-up',
        category: 'Mehendi',
        image: '/images/mehendi-closeup-1.jpg',
        description: 'Detailed view of intricate mehendi work',
    },
    {
        id: 12,
        title: 'Geometric Mandala',
        category: 'Mandala',
        image: '/images/geometric-mandala.jpg',
        description: 'Precise geometric patterns in circular form',
    },
];

// Filter categories for gallery
export const categories = [
    'All',
    'Mehendi',
    'Bridal',
    'Sketch',
    'Cultural',
    'Mandala',
];

// Featured artworks for carousel
export const featuredArtworks = artworks.filter(
    (art) => art.category === 'Bridal' || art.category === 'Cultural'
).slice(0, 4);

// Testimonials data
export const testimonials = [
    {
        id: 1,
        name: 'Priya Sharma',
        rating: 5,
        text: 'Divya created the most beautiful bridal mehendi for my wedding. Her attention to detail is incredible! The design lasted for weeks and everyone at my wedding was asking about her.',
        event: 'Wedding Mehendi',
    },
    {
        id: 2,
        name: 'Ananya Patel',
        rating: 5,
        text: 'The sketch portrait she made of my family is now our most treasured possession. Truly talented artist! She captured every emotion perfectly.',
        event: 'Family Portrait',
    },
    {
        id: 3,
        name: 'Kavya Reddy',
        rating: 4,
        text: 'Amazing mandala designs! Divya brought my vision to life with such precision and artistry. Very professional and creative.',
        event: 'Custom Mandala',
    },
    {
        id: 4,
        name: 'Meera Iyer',
        rating: 5,
        text: 'Professional, creative, and incredibly skilled. The mehendi lasted beautifully and looked stunning! Highly recommend for any special occasion.',
        event: 'Sangeet Ceremony',
    },
    {
        id: 5,
        name: 'Riya Desai',
        rating: 5,
        text: 'Absolutely loved my bridal mehendi! Divya is so patient and her designs are unique. She made my special day even more memorable.',
        event: 'Bridal Mehendi',
    },
    {
        id: 6,
        name: 'Sneha Kapoor',
        rating: 4,
        text: 'Beautiful work and very reasonable pricing. The mehendi color came out dark and rich. Will definitely book again for future events!',
        event: 'Festival Mehendi',
    },
];

// Services offered
export const services = [
    {
        id: 1,
        title: 'Bridal Mehendi',
        description: 'Exquisite bridal mehendi designs for your special day with intricate patterns and traditional motifs.',
        price: 'Starting from ₹2,000',
        icon: '💐',
    },
    {
        id: 2,
        title: 'Party & Event Mehendi',
        description: 'Beautiful mehendi designs for parties, festivals, and special occasions.',
        price: 'Starting from ₹1,000',
        icon: '🎉',
    },
    {
        id: 3,
        title: 'Custom Sketches',
        description: 'Hand-drawn portraits and custom artwork capturing your precious moments.',
        price: 'Starting from ₹500',
        icon: '✏️',
    },
    {
        id: 4,
        title: 'Mandala Art',
        description: 'Intricate mandala designs for meditation, decoration, or spiritual purposes.',
        price: 'Starting from ₹1,500',
        icon: '🎨',
    },
];

export default artworks;
