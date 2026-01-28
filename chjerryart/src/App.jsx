import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AdminProvider } from './context/AdminContext';
import useLenis from './hooks/useLenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import GalleryPreview from './components/GalleryPreview';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FullGallery from './pages/FullGallery';
import AdminPanel from './components/AdminPanel';
import './index.css';

// Homepage Component
const HomePage = () => {
    return (
        <>
            <Hero />
            <About />
            <GalleryPreview />
            <Services />
            <Testimonials />
            <Contact />
        </>
    );
};

function App() {
    // Initialize Lenis smooth scrolling
    useLenis();

    useEffect(() => {
        // Disable default browser smooth scroll
        document.documentElement.style.scrollBehavior = 'auto';

        return () => {
            document.documentElement.style.scrollBehavior = '';
        };
    }, []);

    return (
        <AdminProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={
                            <main>
                                <HomePage />
                            </main>
                        } />
                        <Route path="/gallery" element={<FullGallery />} />
                    </Routes>
                    <Footer />
                    <AdminPanel />
                </div>
                <Analytics />
            </Router>
        </AdminProvider>
    );
}

export default App;
