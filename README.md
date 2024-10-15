# Zibawa Webby - My Portfolio Website

Welcome to **Zibawa Webby** — my personal portfolio website! This project is designed to showcase my skills as a web/software developer, especially in **React.js**, and to provide a platform where I can display my projects and creative work.

## 🖥️ About the Project

This portfolio website was built with **React** to demonstrate my abilities in modern web development. It features:
- **Smooth user interactions** and a **sleek user interface**.
- **Custom audio player** with a sleek interface.
- Responsive design, ensuring it looks great on all screen sizes.
- A personalized theme that aligns with my creative style.
  
While building this site, I focused on writing clean, modular, and reusable code that adheres to modern development practices.

## 🛠️ Technologies Used

- **React.js**: A powerful JavaScript library for building user interfaces, which allowed me to create dynamic components and handle the state management with ease.
- **HTML5 & CSS3**: For structuring the content and styling the website.
- **JavaScript (ES6+)**: Used throughout for various dynamic functionalities.
- **Git & GitHub**: For version control and deployment.

## 🎨 Key Features

- **Smooth Animations**: Interactive background particles, a rainbow animation effect for track names, and smooth sliding transitions enhance the overall user experience.
- **Project Showcase**: It highlights the key projects I've worked on, showing the technologies used and project descriptions.
- **Responsive Design**: Built to work seamlessly across desktop, tablet, and mobile devices.
  
## 📂 Folder Structure

The project follows a clean and intuitive folder structure for easy maintainability:

zibawa-webby/ ├── public/ │ ├── index.html # Main HTML template │ ├── favicon.ico # Favicon ├── src/ │ ├── assets/ # Contains images, audio, fonts, etc. │ ├── components/ # Reusable React components │ ├── App.js # Main React component │ ├── App.css # Main CSS file for global styles ├── .gitignore ├── package.json # Project metadata and dependencies ├── README.md # You're reading this!


## ⚙️ Code Highlights

Here's an overview of the key concepts and features implemented using React:

### Audio Player

- **State Management**: React's `useState` hook is used to manage the play/pause state, volume, and track information.
- **Custom Styling**: CSS animations and transitions are used to create smooth interactions for dragging the audio player and animating the track name with a rainbow effect.

### React Router

- **Routing**: `react-router-dom` is used to navigate between the different sections of the portfolio, like the profile page and the projects page, without refreshing the page.

```javascript
<Router>
  <Routes>
    <Route path="/" element={<Pfp />} />
    <Route path="/projects" element={<Projects />} />
  </Routes>
</Router>
```
Particle Background & Cursor Trail
Interactive Background: A custom particle system was created using the HTML5 canvas to add dynamic effects to the background.
Cursor Trail: A fun visual cursor trail was added to further enhance the user experience.
Modern CSS
Flexbox: Used for creating flexible and responsive layouts.
CSS Transitions: Added for smooth hiding and showing of elements like the draggable audio player.
🤝 Credits
While I built this website mostly on my own to showcase my development skills, I did have a bit of assistance from ChatGPT to help with certain sections, particularly around fine-tuning animations and interactions. Overall, this was a project that allowed me to grow and hone my React.js expertise.

🚀 How to Run This Project
If you'd like to run this project locally, follow these steps:

Clone the repository:

```bash

git clone https://github.com/zibawaa/zibawa-webby.git
Navigate into the project directory:
```
```bash
cd zibawa-webby
Install the dependencies:
```
```bash

npm install
Start the development server:
```
```bash
npm start
The website will be running locally on http://localhost:3000.
```

Thanks for checking out Zibawa Webby! Feel free to browse through the site, explore my projects, and connect with me if you'd like to collaborate.
