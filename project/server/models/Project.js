import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  tech: [{
    type: String
  }],
  demo: String,
  github: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// This will refer to the 'projects' collection in the 'Portfolio' database
export const Project = mongoose.model('Project', projectSchema);
