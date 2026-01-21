import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import './FullGallery.css';

const FullGallery = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filteredArtworks, setFilteredArtworks] = useState([]);
    const [selectedArtwork, setSelectedArtwork] = useState(null);

    // All images from public/images/AllArt/
    const allArtworks = [
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
    ];

    const categories = ['All', 'Mehendi', 'Bridal', 'Cultural', 'Sketch', 'Mandala'];

    useEffect(() => {
        if (selectedCategory === 'All') {
            setFilteredArtworks(allArtworks);
        } else {
            setFilteredArtworks(allArtworks.filter(art => art.category === selectedCategory));
        }
    }, [selectedCategory]);

    useEffect(() => {
        // Scroll to top when page loads
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="full-gallery-page">
            {/* Header */}
            <div className="gallery-header">
                <div className="container">
                    <Link to="/" className="back-link">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Back to Home</span>
                    </Link>
                    <h1 className="gallery-page-title">Complete Art Gallery</h1>
                    <p className="gallery-page-subtitle">
                        Explore our full collection of mehendi designs, sketches, and cultural artwork
                    </p>
                </div>
            </div>

            {/* Gallery Content */}
            <section className="gallery-content section">
                <div className="container">
                    {/* Category Filters */}
                    <div className="gallery-filters">
                        {categories.map((category) => (
                            <motion.button
                                key={category}
                                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {category}
                            </motion.button>
                        ))}
                    </div>

                    {/* Gallery Grid */}
                    <motion.div className="gallery-grid" layout>
                        <AnimatePresence mode="popLayout">
                            {filteredArtworks.map((artwork) => (
                                <motion.div
                                    key={artwork.id}
                                    className="gallery-item"
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.4 }}
                                    whileHover={{ y: -8 }}
                                    onClick={() => setSelectedArtwork(artwork)}
                                >
                                    <div className="gallery-item-image">
                                        <img
                                            src={artwork.src}
                                            alt={artwork.title}
                                            loading="lazy"
                                        />
                                        <div className="category-badge">{artwork.category}</div>
                                        <div className="gallery-item-overlay">
                                            <h4>{artwork.title}</h4>
                                            <p>Click to view</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredArtworks.length === 0 && (
                        <div className="no-results">
                            <p>No artwork found in this category</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedArtwork && (
                    <motion.div
                        className="lightbox-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedArtwork(null)}
                    >
                        <motion.div
                            className="lightbox-content"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="lightbox-close" onClick={() => setSelectedArtwork(null)}>
                                ✕
                            </button>
                            <div className="lightbox-image-wrapper">
                                <img
                                    src={selectedArtwork.src}
                                    alt={selectedArtwork.title}
                                />
                            </div>
                            <div className="lightbox-info">
                                <h3>{selectedArtwork.title}</h3>
                                <p className="lightbox-category">{selectedArtwork.category}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FullGallery;
