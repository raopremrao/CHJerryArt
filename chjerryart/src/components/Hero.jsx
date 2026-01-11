import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import './Hero.css';

const Hero = () => {
    const heroRef = useRef(null);
    const orb1Ref = useRef(null);
    const orb2Ref = useRef(null);

    useEffect(() => {
        // GSAP animation for floating orbs
        const tl = gsap.timeline({ repeat: -1 });

        tl.to(orb1Ref.current, {
            y: -30,
            x: 20,
            duration: 3,
            ease: 'power1.inOut',
        })
            .to(orb1Ref.current, {
                y: 0,
                x: 0,
                duration: 3,
                ease: 'power1.inOut',
            });

        gsap.to(orb2Ref.current, {
            y: -20,
            x: -15,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
        });

        // Parallax effect on scroll
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            const xPos = (clientX / innerWidth - 0.5) * 40;
            const yPos = (clientY / innerHeight - 0.5) * 40;

            gsap.to(orb1Ref.current, {
                x: xPos,
                y: yPos,
                duration: 1,
                ease: 'power2.out',
            });

            gsap.to(orb2Ref.current, {
                x: -xPos * 0.7,
                y: -yPos * 0.7,
                duration: 1,
                ease: 'power2.out',
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            tl.kill();
        };
    }, []);

    const scrollToGallery = () => {
        document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToContact = () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="hero" ref={heroRef} id="home">
            {/* Animated Background Orbs */}
            <div className="hero-background">
                <div className="orb orb-1" ref={orb1Ref}></div>
                <div className="orb orb-2" ref={orb2Ref}></div>
                <div className="mehendi-pattern"></div>
            </div>

            {/* Hero Content */}
            <div className="hero-content container">
                <motion.div
                    className="hero-text"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <motion.p
                        className="hero-subtitle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Welcome To
                    </motion.p>

                    <motion.h1
                        className="hero-title"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        CH Jerry Art
                    </motion.h1>

                    <motion.p
                        className="hero-tagline"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                    >
                        My Art Is For Every Soul
                    </motion.p>

                    <motion.p
                        className="hero-description"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.9 }}
                    >
                        Crafting intricate mehendi designs, breathtaking sketches, and cultural artwork
                        that tells stories and celebrates traditions.
                    </motion.p>

                    <motion.div
                        className="hero-buttons"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.1 }}
                    >
                        <button className="btn btn-primary" onClick={scrollToGallery}>
                            View Gallery
                        </button>
                        <button className="btn btn-secondary" onClick={scrollToContact}>
                            Book Mehendi
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
