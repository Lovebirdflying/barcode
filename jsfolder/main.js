"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const email_validator_1 = __importDefault(require("email-validator"));
const db_1 = __importDefault(require("./helper/db"));
require("express-async-errors");
const app = (0, express_1.default)();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 1000;
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.get('/', (req, res) => {
    res.send('Welcome to the MY HOME!');
});
// Root route to add a user
app.post('/addUser', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phone, profileImage } = req.body;
    if (!name || !email || !phone || !profileImage) {
        return res.status(400).json({ message: "All fields are required." });
    }
    if (!email_validator_1.default.validate(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }
    try {
        yield db_1.default.create({ name, email, phone, profileImage });
        res.status(200).json({ message: "User added successfully" });
    }
    catch (err) {
        console.error("Error adding user:", err);
        res.status(500).json({ message: "Unable to add user", err: err.message });
    }
})));
// Route to get a user by UID
app.get('/getUser', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { UserUID } = req.query;
    console.log("Query parameters:", req.query);
    console.log("Received UserUID:", UserUID);
    if (!UserUID) {
        return res.status(400).json({ message: "UserUID is required" });
    }
    try {
        const user = yield db_1.default.findOne({ _id: UserUID });
        if (!user) {
            res.status(404).json({ error: "User does not exist in the database" });
        }
        else {
            res.status(200).json(user);
        }
    }
    catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ message: "Unknown error", err: err.message });
    }
})));
// Connect to MongoDB and start the server
mongoose_1.default.connect(process.env.MONGO)
    .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
        console.log(`Server started at http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error("MongoDB connection error:", err);
});
