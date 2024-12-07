import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Projects.css';
import profilePic from '../../assets/images/circular_profile_pic.jpg';

const Projects = () => {
    return (
        <div className="projects-container">
            {/* Add the profile picture */}
            <Link to="/" className="profile-pic-link">
                <img src={profilePic} alt="Profile" className="profile-pic" />
            </Link>
            <h1 className="projects-header">Here are some of the projects I have worked on:</h1>
            <div className="projects-grid">

                {/* First project: Portfolio website with clickable link to GitHub */}
                <a href="https://github.com/zibawaa/zibawa-webby/tree/master" target="_blank" rel="noopener noreferrer" className="project-card-link">
                    <div className="project-card">
                        <h2 className="project-title">My Portfolio Website</h2>
                        <p className="project-description">
                            This portfolio website built with React to showcase my projects and skills.
                        </p>
                        <div className="tech-stack">
                            <span className="tech-icon-placeholder">React</span>
                            <span className="tech-icon-placeholder">CSS</span>
                            <span className="tech-icon-placeholder">JavaScript</span>
                        </div>
                    </div>
                </a>

                {/* Second project: Coming Soon */}
                <div className="project-card">
                    <h2 className="project-title">Coming Soon</h2>
                    <p className="project-description">Exciting AI and Python project coming soon. Stay tuned!</p>
                    <div className="tech-stack">
                        <span className="tech-icon-placeholder">Python</span>
                        <span className="tech-icon-placeholder">AI</span>
                        <span className="tech-icon-placeholder">Machine Learning</span>
                    </div>
                </div>

                {/* Add more project cards as needed */}
            </div>
        </div>
    );
};

export default Projects;
