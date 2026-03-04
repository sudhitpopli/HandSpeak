import Link from 'next/link';
import Image from 'next/image';
import { FaLinkedinIn, FaWhatsapp, FaSignLanguage, FaRobot, FaHeartbeat, FaVrCardboard } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

export default function Home() {
    return (
        <>
            {/* Header Navigation */}
            <header className="header container">
                <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
                    <Image src="/images/handspeak_logo.png" alt="HandSpeak Logo" width={200} height={200} style={{ height: '40px', width: 'auto', marginRight: '10px' }} className="dummy-img-logo" unoptimized={true} />
                    <span className="logo-text">HandSpeak</span>
                </div>
                <nav className="nav">
                    <Link href="#team">About us</Link>
                    <Link href="#use-cases">Use Cases</Link>
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
                        <Image src="/images/hero_placeholder.png" alt="Hero Illustration" width={1000} height={800} style={{ width: '100%', height: 'auto', display: 'block' }} className="dummy-img" quality={process.env.NODE_ENV === 'development' ? 100 : 50} priority />
                    </div>
                </section>

                {/* HandSpeak Specific Hardware Use Cases Grid */}
                <section id="use-cases" className="services container">
                    <div className="section-title">
                        <span className="badge">Use Cases</span>
                        <p>Discover how HandSpeak's raw telemetry translation enables real-world applications across completely different industries.</p>
                    </div>

                    <div className="services-grid">
                        {/* Use Case 1 */}
                        <div className="card card-grey">
                            <div className="card-content">
                                <h3 className="bg-lime" style={{ fontSize: '1.5rem', lineHeight: '1.3' }}>Speech Impairment<br />Aid</h3>
                                <p style={{ marginTop: '15px', fontSize: '1rem', lineHeight: '1.5', maxWidth: '300px' }}>Translating sign language or custom hand gestures into instant natural audio for non-verbal individuals.</p>
                            </div>
                            <div className="card-image" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '200px' }}>
                                <FaSignLanguage style={{ fontSize: '140px', color: 'var(--p-dark)', opacity: 0.9 }} />
                            </div>
                        </div>
                        {/* Use Case 2 */}
                        <div className="card card-lime">
                            <div className="card-content">
                                <h3 className="bg-white" style={{ fontSize: '1.5rem', lineHeight: '1.3' }}>Industrial<br />Teleoperation</h3>
                                <p style={{ marginTop: '15px', fontSize: '1rem', lineHeight: '1.5', maxWidth: '300px' }}>Hands-free control of heavy machinery or drones in environments where voice commands fail.</p>
                            </div>
                            <div className="card-image" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '200px' }}>
                                <FaRobot style={{ fontSize: '140px', color: 'var(--p-dark)', opacity: 0.9 }} />
                            </div>
                        </div>
                        {/* Use Case 3 */}
                        <div className="card card-dark text-white">
                            <div className="card-content">
                                <h3 className="bg-white" style={{ fontSize: '1.5rem', lineHeight: '1.3', color: 'var(--p-dark)' }}>Physical Therapy<br />Monitoring</h3>
                                <p style={{ marginTop: '15px', fontSize: '1rem', lineHeight: '1.5', color: 'var(--p-white)', maxWidth: '300px' }}>Providing doctors with precise kinematic data to track finger mobility and tremor reduction.</p>
                            </div>
                            <div className="card-image" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '200px' }}>
                                <FaHeartbeat style={{ fontSize: '140px', color: 'var(--p-lime)', opacity: 0.9 }} />
                            </div>
                        </div>
                        {/* Use Case 4 */}
                        <div className="card card-grey">
                            <div className="card-content">
                                <h3 className="bg-lime" style={{ fontSize: '1.5rem', lineHeight: '1.3' }}>Immersive VR/AR<br />Interaction</h3>
                                <p style={{ marginTop: '15px', fontSize: '1rem', lineHeight: '1.5', maxWidth: '300px' }}>Replacing clunky controllers with natural finger/wrist movements for seamless spatial navigation.</p>
                            </div>
                            <div className="card-image" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '200px' }}>
                                <FaVrCardboard style={{ fontSize: '140px', color: 'var(--p-dark)', opacity: 0.9 }} />
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
                                    <h4>Sudhit Popli</h4>
                                    <p>Hardware Engineer</p>
                                </div>
                                <a href="https://www.linkedin.com/in/sudhit-popli-a2a9731ab?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BBdhKNeT%2BQMiGbFQpStx5pQ%3D%3D" target="_blank" rel="noreferrer" title="LinkedIn">
                                    <div className="linkedin-badge">in</div>
                                </a>
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
                                    <h4>Aaryan Rathore</h4>
                                    <p>Systems Integration</p>
                                </div>
                                <a href="https://www.linkedin.com/in/aaryan-rathore-1845b631b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noreferrer" title="LinkedIn">
                                    <div className="linkedin-badge">in</div>
                                </a>
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
                            HandSpeak
                        </div>
                        <nav className="p-footer-nav">
                            <Link href="/#team">About us</Link>
                            <Link href="/#use-cases">Use Cases</Link>
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
