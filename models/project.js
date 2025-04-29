import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  project: {
    type: String,
    required: true,
  },
  assignees: {
    type: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        name: {
          type: String,
          required: true,
        }
      }
    ],
    required: true
  },
  
  template: {
    type: String,
    required:true,
  },

  tasks: {
    type: [
      {
        title: { type: String, required: true },
        
        stage: { type: String, required: true },
        status: { type: String, required: true },
        details: { type: String }, 
        startDate: { type: String, required: true },
        dueDate: { type: String, required: true },
      }
    ],
    default: [],
  }
  
 
});

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export default Project;

