'use client';

import { useState, useEffect, useRef } from 'react';

export default function LiveTranslationPanel() {
    const [words, setWords] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isPulsing, setIsPulsing] = useState(false);
    const [autoPlay, setAutoPlay] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const lastWordRef = useRef<string>("");

    // Calibration and Status States
    const [hardwareConnected, setHardwareConnected] = useState(false);
    const [isCalibrated, setIsCalibrated] = useState(false);
    const [isCalibrating, setIsCalibrating] = useState(false);

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    // Poll for status and translations
    useEffect(() => {
        const fetchStatusAndTranslation = async () => {
            try {
                // 1. Fetch live hardware connection and calibration states
                const statusRes = await fetch(`${BACKEND_URL}/api/status`);
                if (statusRes.ok) {
                    const statusData = await statusRes.json();
                    if (hardwareConnected !== statusData.hardware_connected) {
                        console.log(`[DEBUG] Hardware Connection State Changed: ${statusData.hardware_connected}`);
                    }
                    if (isCalibrated !== statusData.is_calibrated) {
                        console.log(`[DEBUG] Hardware Calibration State Changed: ${statusData.is_calibrated}`);
                    }
                    setHardwareConnected(statusData.hardware_connected);
                    setIsCalibrated(statusData.is_calibrated);
                }

                // 2. Fetch the latest predicted translation stream
                const transRes = await fetch(`${BACKEND_URL}/api/translation`);
                if (transRes.ok) {
                    const transData = await transRes.json();
                    const newWord = transData.text?.trim(); // use 'text' as returned from backend
                    if (newWord && newWord !== "Awaiting connection..." && newWord !== lastWordRef.current) {
                        console.log(`[DEBUG] New Valid Translation Received: Pushing '${newWord}' to UI state.`);
                        setWords(prev => [...prev, newWord]);
                        lastWordRef.current = newWord;
                        // Trigger pulse animation
                        setIsPulsing(true);
                        setTimeout(() => setIsPulsing(false), 800);
                    }
                }
            } catch (error) {
                console.error('Error fetching stream data:', error);
            }
        };

        const intervalId = setInterval(fetchStatusAndTranslation, 1000); // Poll fast
        return () => clearInterval(intervalId); // Cleanup
    }, []);

    const handleCalibrate = async () => {
        console.log('[DEBUG] User triggered Calibration Button. Setting Backend UI lock.');
        setIsCalibrating(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/calibrate`, {
                method: 'POST'
            });
            console.log(`[DEBUG] /api/calibrate Response Status: ${res.status}`);
            alert(`Ready to set hardware baseline. Please hold your hand completely flat and still in a resting state to calibrate the offsets.`);
        } catch (error) {
            console.error('[DEBUG] Calibration FETCH Error:', error);
        } finally {
            setIsCalibrating(false);
        }
    };

    const handleReset = async () => {
        console.log('[DEBUG] User triggered Reset Sequence.');
        try {
            const res = await fetch(`${BACKEND_URL}/api/reset`, { method: 'POST' });
            console.log(`[DEBUG] /api/reset Response Status: ${res.status}`);
            setWords([]);
        } catch (error) {
            console.error('[DEBUG] Reset Error:', error);
        }
    };

    // Auto-play local audio when a new word is added
    useEffect(() => {
        if (autoPlay && words.length > 0) {
            const latestWord = words[words.length - 1];
            const safeWord = latestWord.trim().toLowerCase().replace(/ /g, '_');
            const audioUrl = `/audio_files/${safeWord}.wav`;

            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.play().catch(e => console.error(`[DEBUG] Auto-play DOM Exception for ${latestWord}:`, e));
            }
        }
    }, [words, autoPlay]);

    const playFullSentence = async () => {
        if (words.length > 0) {
            console.log(`[DEBUG] Beginning sequential audio fetch for ${words.length} words:`, words);
            setIsLoading(true);
            try {
                for (const word of words) {
                    console.log(`[DEBUG] Fetching TTS audio for word: '${word}'`);
                    await new Promise<void>((resolve) => {
                        const safeWord = word.trim().toLowerCase().replace(/ /g, '_');
                        const audioUrl = `/audio_files/${safeWord}.wav`;
                        console.log(`[DEBUG] Playing local frontend audio for '${word}': ${audioUrl}`);

                        if (audioRef.current) {
                            audioRef.current.src = audioUrl;
                            audioRef.current.onended = () => resolve();
                            audioRef.current.onerror = () => {
                                console.error(`[DEBUG] Audio Element Error on playback for: ${word} (File not found at ${audioUrl})`);
                                resolve(); // Skip missing files safely
                            };
                            audioRef.current.play().catch((e) => {
                                console.error(`[DEBUG] DOM Exception preventing playback for ${word}:`, e);
                                resolve();
                            });
                        } else {
                            console.warn(`[DEBUG] No valid audio URL returned for '${word}'.`);
                            resolve();
                        }
                    });

                    // Add a tiny natural pause between local audio files
                    await new Promise(r => setTimeout(r, 300));
                }
                console.log("[DEBUG] Sequential Audio Playback Completed.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <section className="live-panel container">
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <span className="badge">Translation Stream</span>
                    {/* Status Indicator */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: isPulsing ? '#B9FF66' : (hardwareConnected ? '#4CAF50' : '#555'), transition: 'background-color 0.2s', boxShadow: isPulsing ? '0 0 10px #B9FF66' : 'none' }}></div>
                        <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'bold' }}>
                            {!hardwareConnected ? 'IDLE' : (isPulsing ? 'RECEIVING' : 'CONNECTED')}
                        </span>
                    </div>
                </div>

                {hardwareConnected && (
                    <button
                        onClick={handleReset}
                        style={{ fontSize: '0.8rem', background: 'transparent', color: '#ff6b6b', border: '1px solid #ff6b6b', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Disconnect & Reset
                    </button>
                )}
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

                {/* Calibration Section */}
                {hardwareConnected && !isCalibrated && (
                    <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '14px' }}>
                        <h4 style={{ color: 'var(--p-white)', marginBottom: '10px' }}>Calibrate Device Baseline</h4>
                        <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '15px', lineHeight: '1.4' }}>
                            Hardware successfully pinged! Before translating, hold your hand in a neutral, flat resting position and click below to establish the sensor offset baseline.
                        </p>
                        <button
                            onClick={handleCalibrate}
                            disabled={isCalibrating}
                            className="btn btn-lime"
                            style={{ padding: '8px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                        >
                            {isCalibrating ? 'Setting Baseline...' : 'Set Baseline Rest State'}
                        </button>
                    </div>
                )}

                {hardwareConnected && isCalibrated && (
                    <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            onClick={handleCalibrate}
                            disabled={isCalibrating}
                            style={{ background: 'transparent', color: '#888', border: '1px solid #555', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                            {isCalibrating ? '...' : 'Recalibrate Baseline'}
                        </button>
                    </div>
                )}

                <div className="translation-output" style={{ flex: 1, textAlign: 'left', padding: '10px' }}>
                    {!hardwareConnected ? (
                        <p style={{ color: 'var(--p-white)', opacity: 0.6, fontStyle: 'italic' }}>
                            Awaiting hardware connection...
                        </p>
                    ) : !isCalibrated ? (
                        <p style={{ color: 'var(--p-lime)', opacity: 0.8, fontStyle: 'italic' }}>
                            Awaiting baseline calibration...
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

                {hardwareConnected && isCalibrated && (
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
