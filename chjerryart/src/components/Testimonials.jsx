import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonials } from '../data/artworks';
import './Testimonials.css';

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <motion.section
            className="testimonials section"
            id="testimonials"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            <div className="container">
                <h2 className="section-title">Client Testimonials</h2>
                <p className="section-subtitle">
                    What our happy clients say about their experience
                </p>

                <div className="testimonials-container">
                    <button className="testimonial-nav prev" onClick={prevTestimonial} aria-label="Previous testimonial">
                        ‹
                    </button>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            className="testimonial-card"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                        >
                            <div className="stars">
                                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                    <span key={i} className="star">★</span>
                                ))}
                            </div>
                            <p className="testimonial-text">"{testimonials[currentIndex].text}"</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">
                                    {testimonials[currentIndex].name.charAt(0)}
                                </div>
                                <div className="author-info">
                                    <h4>{testimonials[currentIndex].name}</h4>
                                    <p>{testimonials[currentIndex].event}</p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <button className="testimonial-nav next" onClick={nextTestimonial} aria-label="Next testimonial">
                        ›
                    </button>
                </div>

                <div className="testimonial-dots">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default Testimonials;
