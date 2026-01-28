import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';
import {
    fetchArtworks,
    uploadArtwork,
    deleteArtwork,
    updateArtwork,
    reorderArtworks,
    fetchCategories,
    addCategory,
    removeCategory,
    isSupabaseConfigured
} from '../services/galleryService';
import './AdminPanel.css';

const AdminPanel = ({ onArtworksChange }) => {
    const { isAdmin, logout, adminName } = useAdmin();
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState('upload');
    const [artworks, setArtworks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Upload form state
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadPreview, setUploadPreview] = useState('');
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadCategory, setUploadCategory] = useState('Mehendi');

    // Edit state
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editCategory, setEditCategory] = useState('');

    // New category state
    const [newCategoryName, setNewCategoryName] = useState('');

    const fileInputRef = useRef(null);

    // Lock body scroll when panel is open
    useEffect(() => {
        if (isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isExpanded]);

    useEffect(() => {
        if (isAdmin) {
            loadData();
        }
    }, [isAdmin]);

    const loadData = async () => {
        const [artworksResult, categoriesResult] = await Promise.all([
            fetchArtworks(),
            fetchCategories()
        ]);

        if (artworksResult.data) {
            setArtworks(artworksResult.data);
        }
        if (categoriesResult.data) {
            setCategories(categoriesResult.data.filter(c => c !== 'All'));
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadFile || !uploadTitle || !uploadCategory) {
            showMessage('error', 'Please fill all fields');
            return;
        }

        if (!isSupabaseConfigured()) {
            showMessage('error', 'Supabase not configured. Please set up environment variables.');
            return;
        }

        setIsLoading(true);
        const { data, error } = await uploadArtwork(uploadFile, uploadTitle, uploadCategory);

        if (error) {
            showMessage('error', 'Upload failed: ' + error.message);
        } else {
            showMessage('success', 'Image uploaded successfully!');
            setArtworks(prev => [...prev, data]);
            onArtworksChange?.();

            // Reset form
            setUploadFile(null);
            setUploadPreview('');
            setUploadTitle('');
            setUploadCategory('Mehendi');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
        setIsLoading(false);
    };

    const handleDelete = async (artwork) => {
        if (!window.confirm(`Delete "${artwork.title}"? This cannot be undone.`)) {
            return;
        }

        setIsLoading(true);
        const { error } = await deleteArtwork(artwork.id, artwork.imagePath);

        if (error) {
            showMessage('error', 'Delete failed: ' + error.message);
        } else {
            showMessage('success', 'Image deleted successfully!');
            setArtworks(prev => prev.filter(a => a.id !== artwork.id));
            onArtworksChange?.();
        }
        setIsLoading(false);
    };

    const handleEdit = (artwork) => {
        setEditingId(artwork.id);
        setEditTitle(artwork.title);
        setEditCategory(artwork.category);
    };

    const handleSaveEdit = async (id) => {
        setIsLoading(true);
        const { data, error } = await updateArtwork(id, {
            title: editTitle,
            category: editCategory
        });

        if (error) {
            showMessage('error', 'Update failed: ' + error.message);
        } else {
            showMessage('success', 'Image updated successfully!');
            setArtworks(prev => prev.map(a => a.id === id ? data : a));
            onArtworksChange?.();
            setEditingId(null);
        }
        setIsLoading(false);
    };

    const handleReorder = async (newOrder) => {
        setArtworks(newOrder);
    };

    const handleSaveOrder = async () => {
        setIsLoading(true);
        const { error } = await reorderArtworks(artworks);

        if (error) {
            showMessage('error', 'Reorder failed: ' + error.message);
        } else {
            showMessage('success', 'Order saved successfully!');
            onArtworksChange?.();
        }
        setIsLoading(false);
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        setIsLoading(true);
        const { error } = await addCategory(newCategoryName.trim());

        if (error) {
            showMessage('error', 'Failed to add category: ' + error.message);
        } else {
            showMessage('success', 'Category added!');
            setCategories(prev => [...prev, newCategoryName.trim()]);
            setNewCategoryName('');
        }
        setIsLoading(false);
    };

    const handleRemoveCategory = async (name) => {
        if (!window.confirm(`Remove category "${name}"? Images will be moved to "Uncategorized".`)) {
            return;
        }

        setIsLoading(true);
        const { error } = await removeCategory(name);

        if (error) {
            showMessage('error', 'Failed to remove category: ' + error.message);
        } else {
            showMessage('success', 'Category removed! Images moved to Uncategorized.');
            setCategories(prev => prev.filter(c => c !== name));
            // Update local artworks
            setArtworks(prev => prev.map(a =>
                a.category === name ? { ...a, category: 'Uncategorized' } : a
            ));
            onArtworksChange?.();
        }
        setIsLoading(false);
    };

    if (!isAdmin) return null;

    return (
        <>
            {/* Floating toggle button */}
            <motion.button
                className="admin-toggle-btn"
                onClick={() => setIsExpanded(!isExpanded)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" strokeWidth="2" />
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" strokeWidth="2" />
                </svg>
                Admin
            </motion.button>

            {/* Admin Panel */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        className="admin-panel"
                        data-lenis-prevent
                        initial={{ opacity: 0, x: 400 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 400 }}
                        transition={{ type: 'spring', damping: 25 }}
                    >
                        <div className="admin-panel-header">
                            <div className="admin-info">
                                <span className="admin-badge">Admin</span>
                                <span className="admin-name">{adminName}</span>
                            </div>
                            <div className="admin-header-actions">
                                <button className="logout-btn" onClick={logout}>
                                    Logout
                                </button>
                                <button className="close-panel-btn" onClick={() => setIsExpanded(false)}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Message notification */}
                        <AnimatePresence>
                            {message.text && (
                                <motion.div
                                    className={`admin-message ${message.type}`}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    {message.text}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Supabase warning */}
                        {!isSupabaseConfigured() && (
                            <div className="supabase-warning">
                                ⚠️ Supabase not configured. Add environment variables to enable uploads.
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="admin-tabs">
                            <button
                                className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
                                onClick={() => setActiveTab('upload')}
                            >
                                Upload
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
                                onClick={() => setActiveTab('manage')}
                            >
                                Manage
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
                                onClick={() => setActiveTab('categories')}
                            >
                                Categories
                            </button>
                        </div>

                        <div className="admin-panel-content">
                            {/* Upload Tab */}
                            {activeTab === 'upload' && (
                                <form className="upload-form" onSubmit={handleUpload}>
                                    <div
                                        className={`upload-dropzone ${uploadPreview ? 'has-preview' : ''}`}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {uploadPreview ? (
                                            <img src={uploadPreview} alt="Preview" className="upload-preview" />
                                        ) : (
                                            <div className="dropzone-content">
                                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p>Click to select image</p>
                                                <span>or drag and drop</span>
                                            </div>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            hidden
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Title</label>
                                        <input
                                            type="text"
                                            value={uploadTitle}
                                            onChange={(e) => setUploadTitle(e.target.value)}
                                            placeholder="Enter image title"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Category</label>
                                        <select
                                            value={uploadCategory}
                                            onChange={(e) => setUploadCategory(e.target.value)}
                                        >
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="upload-btn"
                                        disabled={isLoading || !uploadFile}
                                    >
                                        {isLoading ? 'Uploading...' : 'Upload Image'}
                                    </button>
                                </form>
                            )}

                            {/* Manage Tab */}
                            {activeTab === 'manage' && (
                                <div className="manage-section">
                                    <div className="manage-header">
                                        <span>{artworks.length} images</span>
                                        <button
                                            className="save-order-btn"
                                            onClick={handleSaveOrder}
                                            disabled={isLoading}
                                        >
                                            Save Order
                                        </button>
                                    </div>

                                    <Reorder.Group
                                        axis="y"
                                        values={artworks}
                                        onReorder={handleReorder}
                                        className="artwork-list"
                                    >
                                        {artworks.map((artwork) => (
                                            <Reorder.Item
                                                key={artwork.id}
                                                value={artwork}
                                                className="artwork-item"
                                            >
                                                <div className="drag-handle">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                        <circle cx="9" cy="6" r="2" />
                                                        <circle cx="15" cy="6" r="2" />
                                                        <circle cx="9" cy="12" r="2" />
                                                        <circle cx="15" cy="12" r="2" />
                                                        <circle cx="9" cy="18" r="2" />
                                                        <circle cx="15" cy="18" r="2" />
                                                    </svg>
                                                </div>

                                                <img src={artwork.src} alt={artwork.title} className="artwork-thumb" />

                                                {editingId === artwork.id ? (
                                                    <div className="edit-fields">
                                                        <input
                                                            type="text"
                                                            value={editTitle}
                                                            onChange={(e) => setEditTitle(e.target.value)}
                                                            placeholder="Title"
                                                        />
                                                        <select
                                                            value={editCategory}
                                                            onChange={(e) => setEditCategory(e.target.value)}
                                                        >
                                                            {categories.map(cat => (
                                                                <option key={cat} value={cat}>{cat}</option>
                                                            ))}
                                                            <option value="Uncategorized">Uncategorized</option>
                                                        </select>
                                                        <button
                                                            className="save-btn"
                                                            onClick={() => handleSaveEdit(artwork.id)}
                                                        >
                                                            ✓
                                                        </button>
                                                        <button
                                                            className="cancel-btn"
                                                            onClick={() => setEditingId(null)}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="artwork-info">
                                                        <span className="artwork-title">{artwork.title}</span>
                                                        <span className="artwork-category">{artwork.category}</span>
                                                    </div>
                                                )}

                                                {editingId !== artwork.id && (
                                                    <div className="artwork-actions">
                                                        <button
                                                            className="edit-btn"
                                                            onClick={() => handleEdit(artwork)}
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeWidth="2" />
                                                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            className="delete-btn"
                                                            onClick={() => handleDelete(artwork)}
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeWidth="2" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </Reorder.Item>
                                        ))}
                                    </Reorder.Group>
                                </div>
                            )}

                            {/* Categories Tab */}
                            {activeTab === 'categories' && (
                                <div className="categories-section">
                                    <form className="add-category-form" onSubmit={handleAddCategory}>
                                        <input
                                            type="text"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            placeholder="New category name"
                                        />
                                        <button type="submit" disabled={isLoading || !newCategoryName.trim()}>
                                            Add
                                        </button>
                                    </form>

                                    <div className="categories-list">
                                        {categories.map(category => (
                                            <div key={category} className="category-item">
                                                <span>{category}</span>
                                                <button
                                                    className="remove-category-btn"
                                                    onClick={() => handleRemoveCategory(category)}
                                                    title="Remove category"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <p className="categories-note">
                                        Note: Removing a category moves its images to "Uncategorized"
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminPanel;
