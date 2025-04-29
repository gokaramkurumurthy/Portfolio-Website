import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  }
});

export const Skill = mongoose.model('Skill', skillSchema, 'skills');
