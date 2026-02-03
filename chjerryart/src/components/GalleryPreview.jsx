import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './GalleryPreview.css';

const GalleryPreview = () => {
    // Initial 4 images from public/images/initial/
    const previewImages = [
        { id: 1, src: '/images/initial/hand1.jpeg', title: 'Artistic Mehendi Design' },
        { id: 2, src: '/images/initial/hand2.jpg', title: 'Intricate Hand Art' },
        { id: 3, src: '/images/initial/hands1.jpg', title: 'Bridal Mehendi' },
        { id: 4, src: '/images/initial/Navratri.jpg', title: 'Navratri Special' },
    ];

    return (
        <section className="gallery-preview section" id="gallery">
            <div className="container">
                <h2 className="section-title">Featured Artwork</h2>
                <p className="section-subtitle">
                    A glimpse of our beautiful mehendi designs and artistic creations
                </p>

                <div className="preview-grid">
                    {previewImages.map((image, index) => (
                        <motion.div
                            key={image.id}
                            className="preview-item"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                        >
                            <div className="preview-image-wrapper">
                                <img
                                    src={image.src}
                                    alt={image.title}
                                    className="preview-image"
                                    loading="lazy"
                                />
                                <div className="preview-overlay">
                                    <h4>{image.title}</h4>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="explore-more-section">
                    <Link to="/gallery" className="btn btn-primary explore-btn">
                        Explore Full Gallery
                    </Link>
                    <p className="explore-note">View our complete collection of artwork</p>
                </div>
            </div>
        </section>
    );
};

export default GalleryPreview;
