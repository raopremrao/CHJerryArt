import { motion } from 'framer-motion';
import './About.css';

const About = () => {
    return (
        <section className="about section" id="about">
            <div className="container">
                <h2 className="section-title">About the Artist</h2>

                <div className="about-content">
                    <motion.div
                        className="about-image"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="image-wrapper">
                            <img
                                src="/images/Artist/DP.jpg"
                                alt="C.H. Divya - Artist"
                                className="artist-image"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        className="about-text"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                    >
                        <h3 className="about-heading">C.H. Divya</h3>
                        <p className="about-bio">
                            I'm a passionate artist specializing in intricate mehendi designs, cultural sketches,
                            and mandala art. My journey with art began as a childhood fascination and has blossomed
                            into a profession that brings joy to countless souls.
                        </p>
                        <p className="about-bio">
                            Every stroke of mehendi, every line in my sketches tells a story. I believe that art
                            is not just about aesthetics—it's about emotions, traditions, and creating memories
                            that last forever. My work has graced weddings, festivals, and special moments,
                            adding beauty and cultural richness to life's celebrations.
                        </p>

                        <div className="about-quote">
                            <svg className="quote-icon" width="30" height="24" viewBox="0 0 30 24" fill="none">
                                <path d="M13.5 12C13.5 18.627 8.627 24 2 24C1.732 23.982 1.464 23.973 1.197 23.955C4.032 21.906 6 18.735 6 15C6 10.029 2.25 6 -2.5 6V0C5.508 0 13.5 4.029 13.5 12ZM30 12C30 18.627 25.127 24 18.5 24C18.232 23.982 17.964 23.973 17.697 23.955C20.532 21.906 22.5 18.735 22.5 15C22.5 10.029 18.75 6 14 6V0C22.008 0 30 4.029 30 12Z" fill="currentColor" />
                            </svg>
                            <p className="quote-text">
                                "My art is for every soul – each design is created with love,
                                precision, and a deep respect for tradition."
                            </p>
                        </div>

                        <div className="about-stats">
                            <div className="stat-item">
                                <span className="stat-number">500+</span>
                                <span className="stat-label">Happy Clients</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">200+</span>
                                <span className="stat-label">Bridal Mehendi</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">5+</span>
                                <span className="stat-label">Years Experience</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
