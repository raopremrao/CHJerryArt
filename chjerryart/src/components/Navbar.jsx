import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        // If not on homepage, navigate to homepage first
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        setMobileMenuOpen(false);
    };

    const navLinks = [
        { name: 'About', id: 'about', type: 'scroll' },
        { name: 'Gallery', id: 'gallery', type: 'scroll' },
        { name: 'Services', id: 'services', type: 'scroll' },
        { name: 'Contact', id: 'contact', type: 'scroll' },
    ];

    return (
        <motion.nav
            className={`navbar ${scrolled ? 'scrolled' : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <span className="logo-text">CH Jerry Art</span>
                    <span className="logo-subtitle">Art Portfolio</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="navbar-links desktop-only">
                    {navLinks.map((link, index) => (
                        link.type === 'link' ? (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="nav-link"
                            >
                                {link.name}
                            </Link>
                        ) : (
                            <motion.a
                                key={link.id}
                                onClick={() => scrollToSection(link.id)}
                                className="nav-link"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index, duration: 0.4 }}
                            >
                                {link.name}
                            </motion.a>
                        )
                    ))}
                    <motion.a
                        href="https://instagram.com/chjerryart"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-instagram"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                    </motion.a>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-menu-toggle mobile-only"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>
            </div>

            {/* Mobile Menu */}
            <motion.div
                className="mobile-menu"
                initial={{ height: 0, opacity: 0 }}
                animate={{
                    height: mobileMenuOpen ? 'auto' : 0,
                    opacity: mobileMenuOpen ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
            >
                {navLinks.map((link) => (
                    link.type === 'link' ? (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="mobile-nav-link"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ) : (
                        <a
                            key={link.id}
                            onClick={() => scrollToSection(link.id)}
                            className="mobile-nav-link"
                        >
                            {link.name}
                        </a>
                    )
                ))}
                <a
                    href="https://instagram.com/chjerryart"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mobile-nav-link"
                >
                    Instagram
                </a>
            </motion.div>
        </motion.nav>
    );
};

export default Navbar;
