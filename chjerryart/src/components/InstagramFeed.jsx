import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './InstagramFeed.css';

gsap.registerPlugin(ScrollTrigger);

const InstagramFeed = () => {
    const sectionRef = useRef(null);
    const gridRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        const gridItems = gridRef.current?.children;

        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
        });

        if (gridItems) {
            gsap.from(gridItems, {
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: 'top 80%',
                },
                opacity: 0,
                scale: 0.8,
                duration: 0.6,
                stagger: 0.1,
                ease: 'back.out(1.7)',
            });
        }
    }, []);

    // Sample Instagram posts (placeholders)
    const instagramPosts = [
        { id: 1, type: 'Bridal Mehendi' },
        { id: 2, type: 'Sketch Art' },
        { id: 3, type: 'Mandala' },
        { id: 4, type: 'Cultural Art' },
        { id: 5, type: 'Mehendi Design' },
        { id: 6, type: 'Portrait' },
    ];

    return (
        <section className="instagram-feed section" id="instagram" ref={sectionRef}>
            <div className="container">
                <div className="instagram-header">
                    <svg className="instagram-icon" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <div>
                        <h2>Follow Our Journey</h2>
                        <p className="instagram-handle">@chjerryart</p>
                    </div>
                </div>

                <div className="instagram-grid" ref={gridRef}>
                    {instagramPosts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            className="instagram-post"
                            whileHover={{ scale: 1.05, zIndex: 10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="post-placeholder">
                                <span className="post-type">{post.type}</span>
                            </div>
                            <div className="post-overlay">
                                <div className="post-stats">
                                    <span>❤️ 1.2k</span>
                                    <span>💬 45</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="instagram-cta">
                    <a
                        href="https://instagram.com/chjerryart"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="instagram-follow-btn"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        <span>Follow @chjerryart</span>
                    </a>
                    <p className="follow-note">Join 500+ followers for daily art inspiration</p>
                </div>
            </div>
        </section>
    );
};

export default InstagramFeed;
