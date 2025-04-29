import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Contact } from './models/Contact.js';
import { Project } from './models/Project.js';
import { Skill } from './models/Skill.js';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB URI - Make sure this is correct
const mongooseURI = "mongodb+srv://GK:Gk2312@cluster0.kpavp.mongodb.net/Portfolio?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongooseURI)
  .then(() => console.log('Connected to MongoDB - Portfolio Database'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Nodemailer Setup for sending contact emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Routes for Projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project' });
  }
});

// Routes for Skills
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skills' });
  }
});

app.post('/api/skills', async (req, res) => {
  try {
    const skill = new Skill(req.body);
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Error creating skill' });
  }
});

// Contact Route
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    const contact = new Contact({
      name,
      email,
      message
    });
    await contact.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'New Portfolio Contact Form Submission',
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// original