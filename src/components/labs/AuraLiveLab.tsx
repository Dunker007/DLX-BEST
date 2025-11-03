import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob } from '@google/genai';
import { ChronicleLogType, TranscriptLine } from '../../types';

// Audio Encoding & Decoding functions as per Gemini docs
function encode(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}


export const AuraLiveLab = React.memo(({ logEvent }: { logEvent: (type: ChronicleLogType, message: string) => void }) => {
    type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
    const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
    const [audioLevel, setAudioLevel] = useState(0);
    const [apiKeyExists, setApiKeyExists] = useState(false);

    const aiRef = useRef<GoogleGenAI | null>(null);
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);
    const transcriptEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setApiKeyExists(!!process.env.API_KEY);
    }, []);
    
    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript]);

    const addTranscript = useCallback((speaker: 'user' | 'aura', text: string, isPartial: boolean) => {
        setTranscript(prev => {
            const lastLine = prev[prev.length - 1];
            if (lastLine?.speaker === speaker && lastLine.isPartial) {
                return [...prev.slice(0, -1), { speaker, text, isPartial }];
            } else {
                return [...prev, { speaker, text, isPartial }];
            }
        });
    }, []);
    
    const visualize = useCallback(() => {
        if (analyserRef.current) {
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteTimeDomainData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) { sum += Math.abs(dataArray[i] - 128); }
            setAudioLevel(sum / dataArray.length / 10);
            animationFrameRef.current = requestAnimationFrame(visualize);
        }
    }, []);

    const cleanup = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        scriptProcessorRef.current?.disconnect();
        mediaStreamSourceRef.current?.disconnect();
        if (inputAudioContextRef.current?.state !== 'closed') inputAudioContextRef.current?.close();
        if (outputAudioContextRef.current?.state !== 'closed') outputAudioContextRef.current?.close();

        sourcesRef.current.forEach(source => source.stop());
        sourcesRef.current.clear();
        
        mediaStreamRef.current = null;
        scriptProcessorRef.current = null;
        mediaStreamSourceRef.current = null;
        inputAudioContextRef.current = null;
        outputAudioContextRef.current = null;
        nextStartTimeRef.current = 0;
        setAudioLevel(0);
    }, []);

    const handleDisconnect = useCallback(async () => {
        if (sessionPromiseRef.current) {
            try {
                const session = await sessionPromiseRef.current;
                session.close();
            } catch (e) { console.error("Error closing session:", e); }
            sessionPromiseRef.current = null;
        }
        cleanup();
        setConnectionStatus('disconnected');
        addTranscript('aura', 'Connection terminated.', false);
        logEvent(ChronicleLogType.SYSTEM, 'Aura Live connection terminated by operator.');
    }, [addTranscript, logEvent, cleanup]);

    const handleConnect = useCallback(async () => {
        if (!apiKeyExists) {
            setConnectionStatus('error');
            addTranscript('aura', 'API key not found. Please ensure it is configured.', false);
            return;
        }
        setTranscript([]);
        setConnectionStatus('connecting');
        addTranscript('aura', 'Initializing live connection...', false);
        logEvent(ChronicleLogType.SYSTEM, 'Aura Live connection initiated.');
        
        try {
            aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            
            sessionPromiseRef.current = aiRef.current.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: async () => {
                        setConnectionStatus('connected');
                        addTranscript('aura', 'Connection established. Aura is listening.', false);
                        logEvent(ChronicleLogType.SYSTEM, 'Aura Live connection successful.');
                        
                        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
                        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                        
                        mediaStreamSourceRef.current = inputAudioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
                        scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                        analyserRef.current = inputAudioContextRef.current.createAnalyser();
                        analyserRef.current.fftSize = 256;
                        
                        scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const l = inputData.length;
                            const int16 = new Int16Array(l);
                            for (let i = 0; i < l; i++) { int16[i] = inputData[i] * 32768; }
                            const pcmBlob: Blob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
                            sessionPromiseRef.current!.then((session) => { session.sendRealtimeInput({ media: pcmBlob }); });
                        };
                        
                        mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
                        mediaStreamSourceRef.current.connect(analyserRef.current);
                        scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);
                        animationFrameRef.current = requestAnimationFrame(visualize);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) addTranscript('user', message.serverContent.inputTranscription.text, true);
                        if (message.serverContent?.outputTranscription) addTranscript('aura', message.serverContent.outputTranscription.text, true);
                        if (message.serverContent?.turnComplete) setTranscript(prev => prev.map(line => ({ ...line, isPartial: false })));
                        
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio) {
                            if (!outputAudioContextRef.current || outputAudioContextRef.current.state === 'closed') {
                                outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                            }
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current, 24000, 1);
                            const source = outputAudioContextRef.current.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputAudioContextRef.current.destination);
                            source.addEventListener('ended', () => { sourcesRef.current.delete(source); });
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            sourcesRef.current.add(source);
                        }
                        
                        if (message.serverContent?.interrupted) {
                            sourcesRef.current.forEach(source => source.stop());
                            sourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                            logEvent(ChronicleLogType.AGENT, "Aura was interrupted by operator's speech.");
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Aura Live Error:', e);
                        setConnectionStatus('error');
                        addTranscript('aura', `An error occurred: ${e.message}.`, false);
                        logEvent(ChronicleLogType.ANOMALY, `Aura Live connection error: ${e.message}`);
                        cleanup();
                    },
                    onclose: () => {
                        if (connectionStatus !== 'disconnected') {
                           logEvent(ChronicleLogType.SYSTEM, 'Aura Live connection closed by server.');
                           handleDisconnect();
                        }
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    inputAudioTranscription: {}, outputAudioTranscription: {},
                    systemInstruction: 'You are Aura, the core AI of the DLX Command Center. Be concise, professional, and helpful to the operator.',
                },
            });
        } catch (err) {
            console.error("Error setting up connection:", err);
            setConnectionStatus('error');
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            addTranscript('aura', `Connection setup failed: ${errorMessage}`, false);
            logEvent(ChronicleLogType.SYSTEM, `Aura Live connection failed: ${errorMessage}`);
            cleanup();
        }
    }, [addTranscript, logEvent, cleanup, visualize, apiKeyExists, connectionStatus, handleDisconnect]);

    useEffect(() => { return () => { if (sessionPromiseRef.current) { handleDisconnect(); } }; }, [handleDisconnect]);

    return (
        <div className="lab-container aura-live-lab">
            <div className="aura-status-header"><span className={`connection-dot ${connectionStatus}`}></span>Status: {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}</div>
            <div className="aura-visualizer"><div className={`aura-orb ${connectionStatus}`} style={{'--audio-level': audioLevel} as React.CSSProperties}></div></div>
            <div className="live-transcript">
                {transcript.map((line, index) => <p key={index} className={`transcript-line ${line.speaker}`}><strong>{line.speaker === 'user' ? 'Operator' : 'Aura'}:</strong> {line.text}</p>)}
                <div ref={transcriptEndRef} />
            </div>
            <div className="aura-controls">
                {!apiKeyExists && connectionStatus === 'disconnected' && <div className="api-key-prompt">Gemini API Key not found. Live connection disabled.</div>}
                {connectionStatus === 'connected' 
                    ? <button onClick={handleDisconnect} className="aura-button disconnect">Disconnect</button>
                    : <button onClick={handleConnect} disabled={connectionStatus === 'connecting' || !apiKeyExists} className="aura-button connect">{connectionStatus === 'connecting' ? 'Connecting...' : 'Connect'}</button>
                }
            </div>
        </div>
    );
});