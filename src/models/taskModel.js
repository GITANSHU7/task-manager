const mongoose= require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'License key is required'],
        unique: true
    },
    description : {
        type: String,
        
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, 'User reference is required']
    },

    due_date: {
        type: Date,
        required: [true, 'Due date is required']
    },
   
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    priority : {
        type: String,
        enum: ['low', 'medium', 'high'],
    },
    status: {
        type: String,
        enum: ['todo', 'completed', 'inProgress'],
        
    } 
});

const Task = mongoose.models.tasks || mongoose.model('tasks', taskSchema);

export default Task;