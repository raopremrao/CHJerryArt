import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { artworks, categories } from '../data/artworks';
import GalleryItem from './GalleryItem';
import './Gallery.css';

gsap.registerPlugin(ScrollTrigger);

const Gallery = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filteredArtworks, setFilteredArtworks] = useState(artworks);
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const sectionRef = useRef(null);

    useEffect(() => {
        if (selectedCategory === 'All') {
            setFilteredArtworks(artworks);
        } else {
            setFilteredArtworks(artworks.filter(art => art.category === selectedCategory));
        }
    }, [selectedCategory]);

    useEffect(() => {
        const section = sectionRef.current;
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 70%',
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
        });
    }, []);

    return (
        <section className="gallery section" id="gallery" ref={sectionRef}>
            <div className="container">
                <h2 className="section-title">Art Gallery</h2>

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
                <motion.div
                    className="gallery-grid"
                    layout
                >
                    <AnimatePresence mode="popLayout">
                        {filteredArtworks.map((artwork) => (
                            <GalleryItem
                                key={artwork.id}
                                artwork={artwork}
                                onClick={() => setSelectedArtwork(artwork)}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

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
                                    <div className="lightbox-placeholder">
                                        <span>{selectedArtwork.title}</span>
                                    </div>
                                </div>
                                <div className="lightbox-info">
                                    <h3>{selectedArtwork.title}</h3>
                                    <p className="lightbox-category">{selectedArtwork.category}</p>
                                    <p className="lightbox-description">{selectedArtwork.description}</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Gallery;
