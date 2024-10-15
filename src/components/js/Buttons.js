import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Buttons.css';

const Buttons = ({ isFading }) => {
    return (
        <div className={`buttons-container ${isFading ? 'fade-in' : 'fade-out'}`}>
            <Link to="/projects" className="button">
                Projects
            </Link>
            <a
                className="button"
                href="https://www.linkedin.com/in//"
                target="_blank"
                rel="noopener noreferrer"
            >
                LinkedIn
            </a>

            <a
                className="button"
                href="https://github.com/zibawaa"
                target="_blank"
                rel="noopener noreferrer"
            >
                GitHub
            </a>
        </div>
    );
};

export default Buttons;
