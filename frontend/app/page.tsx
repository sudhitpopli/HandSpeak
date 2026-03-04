import Link from 'next/link';
import { FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

export default function Home() {
    return (
        <>
            {/* Header Navigation */}
            <header className="header container">
                <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="/images/handspeak_logo.png" alt="HandSpeak Logo" style={{ height: '40px', marginRight: '10px' }} className="dummy-img-logo" />
                    <span className="logo-icon">✨</span>
                    <span className="logo-text">HandSpeak</span>
                </div>
                <nav className="nav">
                    <Link href="#team">About us</Link>
                    <Link href="#services">Services</Link>
                    <Link href="/speech">Speech Platform</Link>
                </nav>
            </header>

            <main style={{ flex: 1 }}>
                {/* Hero Section */}
                <section className="hero container">
                    <div className="hero-content">
                        <h1>Translating sign language into speech for success</h1>
                        <p style={{ marginTop: '50px', marginBottom: '50px' }}>Instantly translating ESP sensor data into spoken text via advanced hardware telemetry directly to your browser.</p>
                        <Link href="/speech" className="btn btn-dark">Start Speaking Suite</Link>
                    </div>
                    <div className="hero-image">
                        <img src="/images/hero_placeholder.png" alt="Hero Illustration" className="dummy-img" />
                    </div>
                </section>

                {/* HandSpeak Specific Hardware Services Grid */}
                <section id="services" className="services container">
                    <div className="section-title">
                        <span className="badge">Services</span>
                        <p>Our core infrastructure enables seamless translation from physical gestures to digital communication.</p>
                    </div>

                    <div className="services-grid">
                        {/* Service 1 */}
                        <div className="card card-grey">
                            <div className="card-content">
                                <h3 className="bg-lime">Real-time Telemetry<br />Tracking</h3>
                                <a href="#" className="learn-more"><span className="arrow-dark">↗</span> Learn more</a>
                            </div>
                            <div className="card-image">
                                <img src="/images/service_1.png" alt="Telemetry" className="dummy-img-small" />
                            </div>
                        </div>
                        {/* Service 2 */}
                        <div className="card card-lime">
                            <div className="card-content">
                                <h3 className="bg-white">Sign Language<br />Syntax Parsing</h3>
                                <a href="#" className="learn-more"><span className="arrow-dark">↗</span> Learn more</a>
                            </div>
                            <div className="card-image">
                                <img src="/images/service_2.png" alt="Syntax Parsing" className="dummy-img-small" />
                            </div>
                        </div>
                        {/* Service 3 */}
                        <div className="card card-dark text-white">
                            <div className="card-content">
                                <h3 className="bg-white">Accessibility Device<br />Integration</h3>
                                <a href="#" className="learn-more text-white"><span className="arrow-white">↗</span> Learn more</a>
                            </div>
                            <div className="card-image">
                                <img src="/images/service_3.png" alt="Accessibility Integration" className="dummy-img-small" />
                            </div>
                        </div>
                        {/* Service 4 */}
                        <div className="card card-grey">
                            <div className="card-content">
                                <h3 className="bg-lime">Microcontroller<br />Optimization</h3>
                                <a href="#" className="learn-more"><span className="arrow-dark">↗</span> Learn more</a>
                            </div>
                            <div className="card-image">
                                <img src="/images/service_4.png" alt="Microcontroller Optimization" className="dummy-img-small" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Constraints (Max 2 Members) - Heavily Decorated */}
                <section id="team" className="team container">
                    <div className="section-title">
                        <span className="badge">Team</span>
                        <p>Meet the focused engineering team building HandSpeak</p>
                    </div>

                    <div className="team-grid">
                        <div className="team-card decorated">
                            <div className="team-top">
                                <div className="avatar-wrapper">
                                    <img src="/images/team_1.png" alt="Leader One" className="avatar-img" />
                                </div>
                                <div className="info">
                                    <h4>Leader One</h4>
                                    <p>Hardware Engineer</p>
                                </div>
                                <div className="linkedin-badge">in</div>
                            </div>
                            <div className="team-bottom">
                                <p>Specializes in ESP Wi-Fi sensor integration, battery optimization, and state management.</p>
                            </div>
                        </div>
                        <div className="team-card decorated">
                            <div className="team-top">
                                <div className="avatar-wrapper">
                                    <img src="/images/team_2.png" alt="Leader Two" className="avatar-img" />
                                </div>
                                <div className="info">
                                    <h4>Leader Two</h4>
                                    <p>Systems Integration</p>
                                </div>
                                <div className="linkedin-badge">in</div>
                            </div>
                            <div className="team-bottom">
                                <p>Expert in real-time embedded systems, C++ architecture, and peripheral interfacing.</p>
                            </div>
                        </div>
                    </div>
                </section>
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
        </>
    );
}
