import React, { useState, useRef, useEffect } from 'react';
import { CameraIcon } from '../icons/CameraIcon';
import { ArrowPathIcon } from '../icons/ArrowPathIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { ExclamationTriangleIcon } from '../icons/ExclamationTriangleIcon';

interface CameraCaptureModalProps {
    onCapture: (imageSrc: string) => void;
    onClose: () => void;
}

const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({ onCapture, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mediaStream: MediaStream | null = null;
        const startCamera = async () => {
            try {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                    setStream(mediaStream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                    }
                } else {
                     setError("Camera access is not supported by this browser.");
                }
            } catch (err) {
                console.error("Error accessing camera: ", err);
                setError("Could not access the camera. Please ensure permissions are granted.");
            }
        };

        startCamera();

        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                const dataUrl = canvas.toDataURL('image/jpeg');
                setImageSrc(dataUrl);
            }
        }
    };

    const handleRetake = () => {
        setImageSrc(null);
    };

    const handleConfirm = () => {
        if (imageSrc) {
            onCapture(imageSrc);
        }
    };

    const handleClose = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        onClose();
    };

    return (
        <div className="modal-overlay animate-fadeIn flex items-center justify-center p-4">
            <div className="bg-bg-secondary border border-green-dark rounded-sm shadow-2xl max-w-2xl w-full p-6 animate-fadeInUp">
                <div className="relative aspect-video w-full rounded-sm bg-black border border-green-dark overflow-hidden">
                    {error ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-error p-4">
                            <ExclamationTriangleIcon className="h-12 w-12 mb-4" />
                            <h3 className="font-bold">Camera Error</h3>
                            <p className="text-sm">{error}</p>
                        </div>
                    ) : (
                        <>
                            <video ref={videoRef} autoPlay playsInline className={`object-cover w-full h-full ${imageSrc ? 'hidden' : 'block'}`} />
                            {imageSrc && <img src={imageSrc} alt="Captured" className="object-cover w-full h-full" />}
                            <canvas ref={canvasRef} className="hidden" />
                        </>
                    )}
                </div>
                <div className="flex justify-between items-center mt-4">
                    <button onClick={handleClose} className="px-4 py-2 bg-bg-primary text-text-primary rounded-sm hover:bg-bg-primary/50 transition font-semibold">
                        Close
                    </button>
                    {!error && (
                        <div className="flex space-x-4">
                            {imageSrc ? (
                                <>
                                    <button onClick={handleRetake} className="px-4 py-2 bg-warning/80 text-bg-primary rounded-sm hover:bg-warning transition font-bold flex items-center space-x-2">
                                        <ArrowPathIcon className="h-5 w-5" />
                                        <span>Retake</span>
                                    </button>
                                    <button onClick={handleConfirm} className="px-4 py-2 bg-green-muted text-bg-primary rounded-sm hover:bg-green-bright transition font-bold flex items-center space-x-2">
                                        <CheckIcon className="h-5 w-5" />
                                        <span>Confirm</span>
                                    </button>
                                </>
                            ) : (
                                <button onClick={handleCapture} className="p-4 bg-green-bright text-bg-primary rounded-full hover:bg-green-primary transition">
                                    <CameraIcon className="h-6 w-6" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CameraCaptureModal;