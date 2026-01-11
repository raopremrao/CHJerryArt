import { motion } from 'framer-motion';
import { services } from '../data/artworks';
import './Services.css';

const Services = () => {
    const scrollToContact = () => {
        const contact = document.getElementById('contact');
        if (contact) {
            contact.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="services section" id="services">
            <div className="container">
                <motion.div
                    className="services-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <h2 className="section-title">Our Services</h2>
                    <p className="section-subtitle">
                        Premium mehendi designs and artistic creations tailored for your special moments
                    </p>
                </motion.div>

                <div className="services-grid">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            className="service-card"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                                ease: 'easeOut'
                            }}
                        >
                            <div className="service-card-inner">
                                <div className="service-icon-wrapper">
                                    <span className="service-icon">{service.icon}</span>
                                </div>

                                <div className="service-content">
                                    <h3 className="service-title">{service.title}</h3>
                                    <p className="service-description">{service.description}</p>

                                    <div className="service-footer">
                                        <span className="service-price">{service.price}</span>
                                        <button
                                            className="service-btn"
                                            onClick={scrollToContact}
                                        >
                                            Book Now
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M1 8h14M8 1l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="service-number">0{service.id}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="services-note"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <p>
                        💫 Custom designs available • Book in advance for weddings and events • Follow us on{' '}
                        <a href="https://instagram.com/chjerryart" target="_blank" rel="noopener noreferrer">
                            @chjerryart
                        </a>{' '}
                        for latest work
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default Services;
