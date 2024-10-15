import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Pfp from './components/js/Pfp';
import Projects from './components/js/Projects';
import '../src/App.css';
import lofiMusic from '../src/assets/audio/lofi-by-Chillpeach.mp3';  // Import the audio file

function App() {
    const [trackName, setTrackName] = useState('');
    const [audio, setAudio] = useState(null);  // State to store the audio object
    const [volume, setVolume] = useState(0.5);  // Default volume at 50%
    const [isPlaying, setIsPlaying] = useState(false);  // State to track if the music is playing

    useEffect(() => {
        // Extract a clean track name without the extension or hash
        const trackFileName = lofiMusic.substring(lofiMusic.lastIndexOf('/') + 1).replace(/(\.[^/.]+)|(\.[^.]*$)/, '');
        setTrackName(trackFileName);

        // Set up canvas for particles
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particlesArray = [];
        const colors = ['#f0c1a1', '#d89b72', '#4b2d1f'];

        function Particle(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;

            this.draw = function() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            };

            this.update = function() {
                if (this.x + this.size > canvas.width || this.x - this.size < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y + this.size > canvas.height || this.y - this.size < 0) {
                    this.directionY = -this.directionY;
                }
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            };
        }

        function initParticles() {
            particlesArray = [];
            for (let i = 0; i < 50; i++) {
                let size = (Math.random() * 5) + 2;
                let x = Math.random() * (canvas.width - size * 2) + size;
                let y = Math.random() * (canvas.height - size * 2) + size;
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                let color = colors[Math.floor(Math.random() * colors.length)];
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function animateParticles() {
            requestAnimationFrame(animateParticles);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
        }

        initParticles();
        animateParticles();

        // Handle window resize for particle canvas
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        });

        // Cursor trail effect
        document.addEventListener('mousemove', (e) => {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.top = `${e.pageY}px`;
            trail.style.left = `${e.pageX}px`;
            document.body.appendChild(trail);
            setTimeout(() => {
                document.body.removeChild(trail);
            }, 500);
        });

    }, []);

    const togglePlay = () => {
        if (!audio) {
            const audioElement = new Audio(lofiMusic);
            audioElement.loop = true;
            audioElement.volume = volume;
            audioElement.play();
            setAudio(audioElement);
            setIsPlaying(true);
        } else {
            if (isPlaying) {
                audio.pause();
                setIsPlaying(false);
            } else {
                audio.play();
                setIsPlaying(true);
            }
        }
    };

    const handleVolumeChange = (event) => {
        const newVolume = event.target.value / 100;
        setVolume(newVolume);
        if (audio) {
            audio.volume = newVolume;
        }
    };

    return (
        <div className="App">
            <canvas id="particle-canvas"></canvas>

            {/* Audio player (triggered by button) */}
            <div className="audio-player">
                <div className="controls">
                    <button onClick={togglePlay} className="play-button">
                        {isPlaying ? '■' : '▶'}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume * 100}
                        className="volume-slider"
                        onChange={handleVolumeChange}
                    />
                </div>
                {/* "Currently Playing" text */}
                <div className="currently-playing">
                    <p>Currently Playing: <span className="rainbow-text">{trackName || "Loading..."}</span></p>
                </div>
            </div>

            {/* Copyright Footer */}
            <footer className="copyright-footer">
                © {new Date().getFullYear()} zibawa webby
            </footer>

            <Router>
                <Routes>
                    <Route path="/" element={<Pfp />} />
                    <Route path="/projects" element={<Projects />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
