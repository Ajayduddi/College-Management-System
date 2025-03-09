import express from 'express';
import passport from 'passport';
import 'dotenv/config';
import mongoose from 'mongoose';
import cors from 'cors';
import users from './routes/users.js';
import departments from './routes/departments.js';
import roles from './routes/roles.js';
import courses from './routes/courses.js';
import announcements from './routes/announcements.js';
import batches from './routes/batches.js';
import academics from './routes/academics.js';
import attendences from './routes/attendences.js';
import faculty from './routes/faculty.js';
import './strategies/passport_jwt.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Parse incoming JSON-formatted request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data with the querystring library (extended: true allows for rich objects and arrays)

const mongodb = mongoose.connect(process.env.MONGO_URI).then((result) => {
    console.log(`MongoDB successfully connected`);
}).catch((err) => {
    console.log("Error while connecting with mongodb", err);
});

// set-up cors
app.use(cors({
    origin: '*',
    credentials: true,
    maxAge: 1 * 24 * 60 * 60 *1000, // 1 day
}));

// for production
app.set('trust proxy', 1);


// initilize passport
app.use(passport.initialize())

// logging request
app.use(function (req, res, next) {
    console.log(`${new Date().toISOString().split('T').join(' ')} ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    console.log("Welcome to the project");
    res.status(200).send({ result: true, message: "Welcome to the college management project"});
});

// routes
app.use('/api/v1/users', users);
app.use('/api/v1/courses', courses);
app.use('/api/v1/departments', departments);
app.use('/api/v1/roles', roles);
app.use('/api/v1/announcements', announcements);
app.use('/api/v1/batches', batches);
app.use('/api/v1/academics', academics);
app.use('/api/v1/faculty', faculty);
app.use('/api/v1/attendences', attendences);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ result: false, message: "Internal server error", data: err });
});

app.listen(port, () => {
    console.log(`Application started at http://localhost:${port}/`);
})