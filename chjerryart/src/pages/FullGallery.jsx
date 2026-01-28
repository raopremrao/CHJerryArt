import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { fetchArtworks, fetchCategories } from '../services/galleryService';
import AdminPanel from '../components/AdminPanel';
import './FullGallery.css';

const FullGallery = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [artworks, setArtworks] = useState([]);
    const [categories, setCategories] = useState(['All', 'Mehendi', 'Bridal', 'Cultural', 'Sketch', 'Mandala']);
    const [filteredArtworks, setFilteredArtworks] = useState([]);
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { isAdmin } = useAdmin();

    const loadData = useCallback(async () => {
        setIsLoading(true);
        const [artworksResult, categoriesResult] = await Promise.all([
            fetchArtworks(),
            fetchCategories()
        ]);

        if (artworksResult.data) {
            setArtworks(artworksResult.data);
        }
        if (categoriesResult.data) {
            setCategories(categoriesResult.data);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (selectedCategory === 'All') {
            setFilteredArtworks(artworks);
        } else {
            setFilteredArtworks(artworks.filter(art => art.category === selectedCategory));
        }
    }, [selectedCategory, artworks]);

    useEffect(() => {
        // Scroll to top when page loads
        window.scrollTo(0, 0);
    }, []);

    const handleArtworksChange = () => {
        loadData();
    };

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

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="gallery-loading">
                            <div className="loading-spinner-large"></div>
                            <p>Loading gallery...</p>
                        </div>
                    ) : (
                        <>
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
                        </>
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

            {/* Admin Panel */}
            {isAdmin && <AdminPanel onArtworksChange={handleArtworksChange} />}
        </div>
    );
};

export default FullGallery;
