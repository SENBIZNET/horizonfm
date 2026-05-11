import React, { useRef, useState, useEffect } from 'react';
import Hls from 'hls.js';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  RotateCcw,
  Settings,
  Shield
} from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  isLive?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, isLive = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls && isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, isPlaying]);

  // Handle source changes and HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls: Hls | null = null;

    if (src.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // Ready to play
        });
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error("HLS network error", data);
                hls?.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error("HLS media error", data);
                hls?.recoverMediaError();
                break;
              default:
                console.error("HLS fatal error", data);
                hls?.destroy();
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native support (Safari)
        video.src = src;
      }
    } else {
      // Regular video source
      video.src = src;
    }

    video.load();
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  const togglePlay = async () => {
    if (videoRef.current && src) {
      try {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
            setIsPlaying(true);
          }
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error("Playback error:", error);
        }
        setIsPlaying(false);
      }
    }
  };

  // Cleanup: Pause on unmount
  useEffect(() => {
    const video = videoRef.current;
    return () => {
      if (video) {
        video.pause();
        video.src = "";
        video.load();
      }
    };
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const dur = videoRef.current.duration;
      setCurrentTime(current);
      setProgress((current / dur) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const seekTime = (Number(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = seekTime;
      setProgress(Number(e.target.value));
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setVolume(val);
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const ytId = isYouTube ? getYouTubeId(src) : null;

  return (
    <div 
      ref={containerRef}
      className={`relative group bg-slate-900 rounded-none lg:rounded-[2.5rem] overflow-hidden border-b lg:border border-slate-200 shadow-2xl transition-all duration-500 ${isFullscreen ? 'rounded-none' : ''}`}
      onMouseMove={() => setShowControls(true)}
    >
      {isYouTube && ytId ? (
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3`}
          className="w-full h-full aspect-video border-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <>
          <video
            ref={videoRef}
            poster={poster}
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
          >
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>

          {/* Overlay - Play Button */}
          <AnimatePresence>
            {!isPlaying && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="w-24 h-24 rounded-full bg-brand-primary/20 backdrop-blur-md border border-brand-primary/30 flex items-center justify-center text-brand-primary">
                  <Play fill="currentColor" size={40} className="ml-2" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Live Badge */}
          {isLive && (
            <div className="absolute top-8 left-8 flex items-center gap-2 bg-brand-primary px-3 py-1.5 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest shadow-lg shadow-brand-primary/20 z-20">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              EN DIRECT
            </div>
          )}

          {/* Controls Container */}
          <AnimatePresence>
            {(showControls || !isPlaying) && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent space-y-4 z-30"
              >
                {/* Progress Slider */}
                {!isLive && (
                  <div className="relative group/progress">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={handleSeek}
                      className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-brand-primary group-hover/progress:h-2 transition-all"
                    />
                    <div 
                      className="absolute top-0 left-0 h-1.5 bg-brand-primary rounded-full pointer-events-none group-hover/progress:h-2"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button onClick={togglePlay} className="text-white hover:text-brand-primary transition-colors">
                      {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                    </button>

                    <div className="flex items-center gap-4 group/volume">
                      <button onClick={toggleMute} className="text-white hover:text-brand-primary transition-colors">
                        {isMuted || volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300 h-1 accent-white"
                      />
                    </div>

                    <div className="text-xs font-mono text-white/60">
                      {isLive ? (
                        <span className="flex items-center gap-2">
                           <Shield size={12} className="text-brand-primary" />
                           DIRECT SECURE
                        </span>
                      ) : (
                        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest">
                       <Settings size={16} />
                       1080p
                    </div>
                    <button onClick={toggleFullscreen} className="text-white hover:text-brand-primary transition-colors">
                      {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>

  );
};
