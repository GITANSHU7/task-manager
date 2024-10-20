import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },
    

    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tasks'
    }]
});

const User = mongoose?.models?.users || mongoose?.model("users", userSchema);

export default User;