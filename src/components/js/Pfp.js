import React, { useEffect, useState } from 'react';
import '../css/Pfp.css';
import profilePic from '../../assets/images/circular_profile_pic.jpg';
import catEar1 from '../../assets/images/cat_ear1.png';
import catEar2 from '../../assets/images/cat_ear2.png';
import catTail from '../../assets/images/cat_tail.gif';
import Buttons from './Buttons';

const Pfp = () => {
    const [text, setText] = useState('');
    const [popOut, setPopOut] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isFading, setIsFading] = useState(false);

    const fullText = `Welcome!\nI am zibawa, a web/software developer with a passion for creating innovative projects.`;

    useEffect(() => {
        let index = 0;

        const interval = setInterval(() => {
            if (index < fullText.length) {
                setText(fullText.substring(0, index + 1));
                index++;
            } else {
                clearInterval(interval);
            }
        }, 50);

        setTimeout(() => {
            setPopOut(true);
        }, 100);

        return () => clearInterval(interval);
    }, [fullText]);

    useEffect(() => {
        let fadeTimer;
        if (isHovered) {
            setIsFading(true);
        } else {
            fadeTimer = setTimeout(() => {
                setIsFading(false);
            }, 1000);
        }

        return () => clearTimeout(fadeTimer);
    }, [isHovered]);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div className="pfp-container">
            <div className="pfp-picture"
                 onMouseEnter={handleMouseEnter}
                 onMouseLeave={handleMouseLeave}>
                <img src={profilePic} alt="Profile" />
            </div>

            <Buttons isFading={isFading} />

            <div className="pfp-text">
                <img src={catEar1} alt="Cat Ear Left" className="cat-ear-left" />
                <img src={catEar2} alt="Cat Ear Right" className="cat-ear-right" />

                <p>
                    <span className="welcome-text">
                        {text.includes('Welcome!') ? 'Welcome!' : text}
                    </span><br />
                    {text.includes('I am') ? text.substring(text.indexOf('I am'), text.indexOf('zibawa')) : ''}
                    {text.includes('zibawa') ? (
                        <span className="highlighted-name">zibawa</span>
                    ) : ''}
                    {text.includes('zibawa') ? text.substring(text.indexOf('zibawa') + 'zibawa'.length) : ''}
                </p>

                <img src={catTail} alt="Cat Tail" className="cat-tail" />
            </div>
        </div>
    );
};

export default Pfp;
