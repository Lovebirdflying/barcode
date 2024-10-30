
    import dotenv from 'dotenv';
    dotenv.config();
    import express, { Request, Response, RequestHandler } from 'express';
    import mongoose from 'mongoose';
    import bodyParser from 'body-parser';
    import validator from 'email-validator';
    import userModel from './helper/db';

    import 'express-async-errors';



    const app = express();
    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 1000;

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.get('/', (req, res) => {
        res.send('Welcome to the MY HOME!');
    })
    // Root route to add a user
    app.post('/addUser', (async (req: Request, res: Response) => {
        const { name, 
            email, 
            phone, 
            profileImage } = req.body;

        if (!name || !email || !phone || !profileImage) {

            return res.status(400).json({ message: "All fields are required." });
        }

        if (!validator.validate(email)) {

            return res.status(400).json({ message: "Invalid email format." });
        }
        
    
        if(email === req.body.email){
        
            res.status(404).json({error:"Email already exist"});
        
            return;
        }

        try {

            await userModel.create({ name, email, phone, profileImage });
            res.status(200).json({ message: "User added successfully" });
        } catch (err: any) {

            console.error("Error adding user:", err);
            res.status(500).json({ message: "Unable to add user", err: err.message });
        }
    }) as RequestHandler);

    // Route to get a user by UID
    app.get('/getUser', (async (req: Request, res: Response) => {


        const { UserUID } = req.query;

        console.log("Query parameters:", req.query); 

        console.log("Received UserUID:", UserUID); 

        if (!UserUID) {
            return res.status(400).json({ message: "UserUID is required" });
        }

        try {
            const user = await userModel.findOne({_id: UserUID} );
            if (!user) {
                res.status(404).json({ error: "User does not exist in the database" });
            } else {
                res.status(200).json(user);
            }
        } catch (err: any) {
            console.error("Error fetching user:", err);
            res.status(500).json({ message: "Unknown error", err: err.message });
        }
    }) as RequestHandler);

    
    // Connect to MongoDB and start the server
  
    
    mongoose.connect(process.env.MONGO as string)
        .then(() => {
            console.log("MongoDB connected successfully");
            app.listen(PORT, () => {
                console.log(`Server started at http://localhost:${PORT}`);
            });
        })
        .catch((err) => {
            console.error("MongoDB connection error:", err);
        });
