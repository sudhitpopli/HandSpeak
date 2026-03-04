'use client';

import { useState, useEffect, useRef } from 'react';

export default function LiveTranslationPanel() {
    const [words, setWords] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isPulsing, setIsPulsing] = useState(false);
    const [autoPlay, setAutoPlay] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const lastWordRef = useRef<string>("");

    const BACKEND_URL = 'http://localhost:8000';
    const isConnected = words.length > 0;

    // Poll for translations
    useEffect(() => {
        const fetchTranslation = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/translation`);
                if (res.ok) {
                    const data = await res.json();
                    const newWord = data.translation?.trim();
                    if (newWord && newWord !== "Awaiting connection..." && newWord !== lastWordRef.current) {
                        setWords(prev => [...prev, newWord]);
                        lastWordRef.current = newWord;
                        // Trigger pulse animation
                        setIsPulsing(true);
                        setTimeout(() => setIsPulsing(false), 800);
                    }
                }
            } catch (error) {
                console.error('Error fetching translation:', error);
            }
        };

        const intervalId = setInterval(fetchTranslation, 1000); // Poll faster for seamless word-by-word
        return () => clearInterval(intervalId); // Cleanup
    }, []);

    // Auto-play TTS when a new word is added
    useEffect(() => {
        if (autoPlay && words.length > 0) {
            const latestWord = words[words.length - 1];
            playTTS(latestWord);
        }
    }, [words, autoPlay]);

    const playTTS = async (textToSpeak: string) => {
        if (!textToSpeak) return;

        setIsLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/tts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textToSpeak }),
            });

            if (!res.ok) {
                throw new Error('Failed to fetch TTS audio');
            }

            const data = await res.json();
            if (data.audio_url && audioRef.current) {
                audioRef.current.src = data.audio_url;
                await audioRef.current.play();
            }
        } catch (error) {
            console.error('TTS Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const playFullSentence = () => {
        if (words.length > 0) {
            playTTS(words.join(" "));
        }
    };

    return (
        <section className="live-panel container">
            <div className="panel-header">
                <span className="badge">Translation Stream</span>
                {/* Status Indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: isPulsing ? '#B9FF66' : '#555', transition: 'background-color 0.2s', boxShadow: isPulsing ? '0 0 10px #B9FF66' : 'none' }}></div>
                    <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'bold' }}>{isPulsing ? 'RECEIVING' : 'IDLE'}</span>
                </div>
            </div>

            <div className="panel-box" style={{
                transition: 'all 0.3s ease',
                borderColor: isPulsing ? 'var(--p-lime)' : 'var(--p-dark)',
                boxShadow: isPulsing ? '0px 5px 20px rgba(185, 255, 102, 0.4)' : '0px 5px 0px 0px var(--p-black)',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                <div className="translation-output" style={{ flex: 1, textAlign: 'left', padding: '10px' }}>
                    {!isConnected ? (
                        <p style={{ color: 'var(--p-white)', opacity: 0.6, fontStyle: 'italic' }}>
                            Awaiting hardware connection...
                        </p>
                    ) : (
                        <p style={{
                            color: isPulsing ? 'var(--p-lime)' : 'var(--p-white)',
                            transition: 'color 0.4s ease',
                            fontSize: '1.5rem',
                            lineHeight: '1.6'
                        }}>
                            {words.join(" ")}
                        </p>
                    )}
                </div>

                {isConnected && (
                    <div className="translation-controls" style={{
                        marginTop: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        paddingTop: '20px'
                    }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--p-white)', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={autoPlay}
                                onChange={(e) => setAutoPlay(e.target.checked)}
                                style={{ width: '18px', height: '18px', accentColor: 'var(--p-lime)' }}
                            />
                            Auto-play TS Model
                        </label>

                        <button
                            onClick={playFullSentence}
                            disabled={isLoading}
                            className="btn btn-lime"
                            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                        >
                            {isLoading ? (
                                <><div className="loader"></div> Processing...</>
                            ) : (
                                <>🔊 Read Full Output</>
                            )}
                        </button>
                    </div>
                )}
            </div>
            <audio ref={audioRef} style={{ display: 'none' }} />
        </section>
    );
}
