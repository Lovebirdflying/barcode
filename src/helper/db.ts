
//usermodel.ts

import mongoose,{Document, Schema} from "mongoose";

interface IUser extends Document{

    profileImage?: string; 
    name: string;
    email: string;
    phone: string;
    DateCreated: Date;
}

const userSchema: Schema<IUser> = new Schema({
    profileImage: {
        type: String,
        required: false
    },
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true

    },
    phone:{
        type: String,
        required: true,
    },
    DateCreated:{
        type: Date,
        required: true,
        default: Date.now
    }
})

// create the userModel

const userModel = mongoose.model<IUser>('User', userSchema)

export default userModel