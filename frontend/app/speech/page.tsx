import Link from 'next/link';
import LiveTranslationPanel from '../../components/LiveTranslationPanel';
import { FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

export default function Speech() {
    return (
        <div className="container">
            <header className="header">
                <div className="logo">
                    <span className="logo-icon">✨</span> <span className="logo-text">HandSpeak</span>
                </div>
                <nav className="nav">
                    <Link href="/">Back to Home</Link>
                </nav>
            </header>

            <main style={{ flex: 1, padding: '40px 0', textAlign: 'center' }}>
                <h1 className="bg-lime" style={{ display: 'inline-block', padding: '10px 20px', borderRadius: '14px', marginBottom: '20px' }}>
                    Speech Translation Suite
                </h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '40px', maxWidth: '800px', margin: '0 auto 40px' }}>
                    Real-time interface monitoring raw ESP telemetry and instantly generating spoken audio feedback.
                </p>
                {/* Render the full Live Translation Panel here */}
                <LiveTranslationPanel />
            </main>

            {/* Footer */}
            <footer className="p-footer container">
                <div className="p-footer-box">
                    <div className="p-footer-top">
                        <div className="p-footer-logo">
                            <span className="logo-icon">✨</span> HandSpeak
                        </div>
                        <nav className="p-footer-nav">
                            <Link href="/#team">About us</Link>
                            <Link href="/#services">Services</Link>
                            <Link href="/speech">Speech Platform</Link>
                        </nav>
                        <div className="p-footer-socials">
                            <a href="https://linkedin.com/" target="_blank" rel="noreferrer" title="LinkedIn" className="p-footer-social-icon">
                                <FaLinkedinIn />
                            </a>
                            <a href="mailto:contact@handspeak.com" title="Gmail" className="p-footer-social-icon">
                                <SiGmail />
                            </a>
                            <a href="https://wa.me/" target="_blank" rel="noreferrer" title="WhatsApp" className="p-footer-social-icon">
                                <FaWhatsapp />
                            </a>
                        </div>
                    </div>
                    <div className="p-footer-middle">
                        <div className="p-footer-contact-info">
                            <h4>Contact us:</h4>
                            <p>Email: info@handspeak.com<br />Phone: 555-567-8901</p>
                            <p>Address: 1234 Main St<br />Moonstone City, Stardust State 12345</p>
                        </div>
                        <div className="p-footer-subscribe">
                            <input type="email" placeholder="Email" />
                            <button className="btn btn-lime">Subscribe to news</button>
                        </div>
                    </div>
                    <div className="p-footer-bottom">
                        <p>© 2026 HandSpeak. All Rights Reserved.</p>
                        <a href="#">Privacy Policy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
