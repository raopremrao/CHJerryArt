import { motion } from 'framer-motion';
import './GalleryItem.css';

const GalleryItem = ({ artwork, onClick }) => {
    return (
        <motion.div
            className="gallery-item"
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -8 }}
            onClick={onClick}
        >
            <div className="gallery-item-image">
                <div className="image-placeholder">
                    <span className="category-badge">{artwork.category}</span>
                </div>
                <div className="gallery-item-overlay">
                    <h4>{artwork.title}</h4>
                    <p>{artwork.description}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default GalleryItem;
