import { useState, useEffect } from 'react'
import { Link } from 'react-scroll'
import { motion } from 'framer-motion'
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { FaGithub, FaLinkedin, FaInstagram,FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

const navigation = [
  { name: 'Home', href: 'home' },
  { name: 'About', href: 'about' },
  { name: 'Skills', href: 'skills' },
  { name: 'Projects', href: 'projects' },
  { name: 'Contact', href: 'contact' },
]

function App() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchProjects();
    fetchSkills();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Check if theme is saved in localStorage
    const storedTheme = localStorage.getItem('theme');
  
    // If no theme is found in localStorage, default to dark mode
    if (storedTheme) {
      setIsDark(storedTheme === 'dark');
    } else {
      // Default to dark mode if no theme is set in localStorage
      setIsDark(true);
    }
  }, []);
  
  useEffect(() => {
    // Add 'dark' class to the document element based on isDark state
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);
  

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/skills');
      const data = await response.json();
      setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('Sending message...');  // Update status while sending the message
  
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        setFormStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });  // Clear the form
  
        // Hide the status after 3 seconds and redirect to home page
        setTimeout(() => {
          setFormStatus('');
          window.location.href = '/';  // Redirect to the home page
        }, 1000);
      } else {
        setFormStatus('Error sending message. Please try again.');
      }
    } catch (error) {
      setFormStatus('Error sending message. Please try again.');
    }
  };
  

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="bg-white dark:bg-dark-900 transition-colors duration-200">
      {/* Navbar */}
      <header className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <nav className="flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="text-2xl font-bold gradient-text dark:text-primary-300">GK</span>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                smooth={true}
                duration={500}
                className="nav-link text-gray-900 dark:text-gray-100"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-200"
            >
              {isDark ? (
                <SunIcon className="h-5 w-5 text-gray-100" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-900" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'visible' : 'hidden'}`}>
          <div className="flex flex-col items-center justify-center min-h-screen space-y-2 pt-16">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                smooth={true}
                duration={500}
                className="mobile-menu-link"
                onClick={closeMobileMenu}
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={() => {
                setIsDark(!isDark)
                closeMobileMenu()
              }}
              className="mobile-menu-link flex items-center justify-center gap-2"
            >
              {isDark ? (
                <>
                  Light Mode
                </>
              ) : (
                <>
                  Dark Mode
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative isolate px-6 pt-14 lg:px-8 min-h-screen flex items-center">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-600 to-sky-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4  ">
              <span className="block text-gray-900 dark:text-gray-100 text-[50px] mb-4">Hi, I'm </span><b/>
              <span className="gradient-text text-primary-500 dark:text-primary-300">Gokaram Kurumurthy</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Full Stack Developer
            </p>
            <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Crafting exceptional digital experiences with modern technologies
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="projects"
                smooth={true}
                duration={500}
                className="rounded-md bg-primary-600 dark:bg-primary-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 dark:hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 cursor-pointer transition-colors duration-200"
              >
                View My Work
              </Link>
              <a
  href="public/Gokaram Kurumurthy.pdf"
  download
  className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
>
  Download Resume <span aria-hidden="true">→</span>
</a>

            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-gray-50 dark:bg-dark-800">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center"
          >


<div style={{ padding: "16px" }}>
  <img 
    style={{ 
      width: "55%", 
      height: "55%", 
      borderRadius: "50%", 
      padding: "3px", // Adds gap between the image and the border
      boxShadow: "0 0 25px rgba(33,150,243,0.5)", // Stronger bluish light shadow for a more intense glow
      transition: "all 0.5s ease-in-out" // Smooth transition effect for the hover
    }}
    src="./src/gk.jpeg"
    alt="Profile"
    className="about-image hover:shadow-[0_0_35px rgba(33,150,243,0.7)] hover:border-[#42A5F5] transition-all duration-500 ease-in-out"
  />
</div>

            <div>

              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6 ">About Me</h2>
              <p className="text-lg leading-8 text-gray-600 dark:text-gray-300 mb-8">
                I'm a passionate Full Stack Developer with expertise in building scalable web applications
                and microservices. With a strong foundation in both frontend and backend technologies,
                I create efficient, user-friendly solutions that solve real-world problems.
              </p>

<div className="flex gap-6">
  <a
    href="https://github.com/gokaramkurumurthy"
    target="_blank"
    rel="noopener noreferrer"
    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500 transform transition-transform duration-300 hover:scale-[1.03] hover:shadow-md hover:shadow-blue-400/50 rounded-full"
  >
    <FaGithub className="h-6 w-6" />
  </a>
  <a
    href="https://www.linkedin.com/in/gokaram-kurumurthy-174134339/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500 transform transition-transform duration-300 hover:scale-[1.03] hover:shadow-md hover:shadow-blue-400/50 rounded-full"
  >
    <FaLinkedin className="h-6 w-6" />
  </a>
  <a
    href="https://www.instagram.com/call_me_gk__2312?igsh=MXRjeGhzN2F2c3hvOQ=="
    target="_blank"
    rel="noopener noreferrer"
    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500 transform transition-transform duration-300 hover:scale-[1.03] hover:shadow-md hover:shadow-blue-400/50 rounded-full"
  >
    <FaInstagram className="h-6 w-6" />
  </a>
</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
  <section id="skills" className="section-padding">
  <div className="mx-auto max-w-7xl">
    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 text-center mb-12">
      Skills & Expertise
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {skills.map((skillGroup, index) => (
        <motion.div
          key={skillGroup.category}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow-md transform transition-transform duration-300 hover:scale-[1.03] hover:shadow-blue-400/50 hover:shadow-md"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {skillGroup.category}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {skillGroup.items.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-md bg-primary-50 dark:bg-primary-900/50 px-2 py-1 text-sm font-medium text-primary-700 dark:text-primary-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>



      {/* Projects Section */}
<section id="projects" className="section-padding bg-gray-50 dark:bg-dark-800">
  <div className="mx-auto max-w-7xl">
    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 text-center mb-12">
      Featured Projects
    </h2>
    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
  <motion.div
  key={project.title}
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: index * 0.1 }}
  viewport={{ once: true }}
  className="project-card flex flex-col overflow-hidden rounded-lg shadow-md bg-white dark:bg-dark-800 transform transition-transform duration-300 hover:scale-105 shadow-blue-400/70 hover:shadow-blue-400/80 hover:shadow-lg"
>

          <div className="flex-shrink-0">
            <img
              className="h-48 w-full object-cover transition-transform duration-300 hover:scale-110"
              src={project.image}
              alt={project.title}
            />
          </div>
          <div className="flex flex-1 flex-col justify-between p-6">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{project.title}</h3>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-md bg-primary-50 dark:bg-primary-900/50 px-2 py-1 text-xs font-medium text-primary-700 dark:text-primary-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <a
                href='#'
                className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline transition-all duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Live Demo
              </a>
              <a
                href={project.github}
                className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline transition-all duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>

        </motion.div>
      ))}
    </div>
  </div>
</section>




      {/* Contact Section */}
      <section id="contact" className="section-padding">
  <div className="mx-auto max-w-7xl">
    <div className="text-center">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Get in Touch</h2>
      <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
        Have a project in mind? Let's work together!
      </p>
    </div>
    <div className="mx-auto mt-16 max-w-xl">
      <form onSubmit={handleContactSubmit} className="grid grid-cols-1 gap-y-6 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md hover:shadow-blue-400/50 transform transition-transform duration-300 hover:scale-[1.02] bg-white dark:bg-dark-800">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
            Name
          </label>
          <div className="mt-2.5">
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-dark-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 bg-white dark:bg-dark-700 transition-colors duration-200"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
            Email
          </label>
          <div className="mt-2.5">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-dark-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 bg-white dark:bg-dark-700 transition-colors duration-200"
            />
          </div>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
            Message
          </label>
          <div className="mt-2.5">
            <textarea
              name="message"
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-dark-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 bg-white dark:bg-dark-700 transition-colors duration-200"
            />
          </div>
        </div>
        {formStatus && (
          <div className={`text-center ${formStatus.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
            {formStatus}
          </div>
        )}
        <div>
          <button
            type="submit"
            className="block w-full rounded-md bg-primary-600 dark:bg-primary-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 dark:hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors duration-200"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  </div>
</section>


      {/* Footer */}
  <footer className="bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-dark-700">
  <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <div className="footer-section">
        <h3 className="footer-heading">About</h3>
        <p className="text-gray-600 dark:text-gray-400">
        Full Stack Developer with expertise in building scalable web applications
                and microservices. With a strong foundation in both frontend and backend technologies,
                I create efficient, user-friendly solutions that solve real-world problems.        </p>
      </div>

      <div className="footer-section">
        <h3 className="footer-heading">Quick Links</h3>
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                smooth={true}
                duration={500}
                className="footer-link cursor-pointer"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="footer-section">
        <h3 className="footer-heading">Connect</h3>

        <div className="space-y-4 mb-6 text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <FaEnvelope className="h-5 w-5" />
            <span>gkmurthy2312@gmail.com</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="h-5 w-5" />
            <span>Pragathi Nagar, Hyderabad, 500090</span>
          </div>
        </div>

        <div className="flex space-x-6">
          <a href="https://github.com/gokaramkurumurthy" target="_blank" rel="noopener noreferrer" className="footer-link">
            <FaGithub className="h-6 w-6" />
          </a>
          <a href="https://www.linkedin.com/in/gokaram-kurumurthy-174134339/" target="_blank" rel="noopener noreferrer" className="footer-link">
            <FaLinkedin className="h-6 w-6" />
          </a>
          <a href="https://www.instagram.com/call_me_gk__2312/?igsh=MXRjeGhzN2F2c3hvOQ%3D%3D#" target="_blank" rel="noopener noreferrer" className="footer-link">
            <FaInstagram className="h-6 w-6" />
          </a>
        </div>
      </div>

    </div>

    <div className="mt-8 border-t border-gray-200 dark:border-dark-700 pt-8 text-center">
      <p className="text-gray-600 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Gokaram Kurumurthy. All rights reserved.
      </p>
    </div>

  </div>
</footer>
    </div>
  )
}

export default App