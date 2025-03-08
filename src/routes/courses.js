import { validationResult, matchedData, checkSchema } from 'express-validator';
import { Courses } from '../models/courses.js';
import { Router } from 'express';
import passport from 'passport';
import { course_validation } from '../utils/validation_schemas.js';
import { generateCourseId } from '../utils/helper.js';
import { Types } from 'mongoose';
import { Roles } from '../models/roles.js';

const route = Router();
route.use(passport.authenticate('jwt', { session: false }));

// get courses list
route.get('/', async (req, res) => {
    try {
        const { search, limit = 10, page = 1, sort = "Asscending" } = req.query;
        const query = {};
        let sort_id;
        if (sort === "Descending") {
            sort_id = -1;
        }
        else {
            sort_id = 1;
        }
        
        if (search) {
            const regex = new RegExp(search, "i");
            query.$or = [
                { name: regex },
                { status: regex },
            ];
        }

        const data = await Courses.find(query).sort({ created_at: sort_id }).skip((page - 1) * limit).limit(limit);
        res.status(200).send({ result: true, message: "Data fetch successfully", data: data });
    } catch (error) {
        console.error("Error while fetching Courses : ", error);
        res.status(500).send({result : false, message : "Internal server Error while getting Courses", data : error})
    }
});

// get course by id
route.get('/:id', async (req, res) => {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).send({ result: false, message: "Invalid id", data: null });
    }
    try {
        const data = await Courses.findById(id);
        res.status(200).send({ result: true, message: "Data fetch successfully", data: data });
    } catch (error) {
        console.error("Error while fetching Courses : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while getting Courses", data: error })
    }
});

// add course
route.post('/', checkSchema(course_validation), (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ result: false, message: "Bad request", data: result.array() });
    }
    next();
},
    async (req, res) => {
        const data = matchedData(req);
        if (!Types.ObjectId.isValid(data.created_by)) {
            return res.status(400).send({ result: false, message: "Invalid created_by id", data: [] });
        }
        try {
            const role = await Roles.findOne({ name: "Admin" });
            if (req.user.role.equals(role._id)) {
                data.course_id = generateCourseId();
                const newCourse = new Courses(data);
                const saveCourses = await newCourse.save();
                res.status(201).send({ result: true, message: "Course created successfully", data: saveCourses });
            }
            else {
                res.status(403).send({ result: true, message: "You desn't have a permision to do this operation", data: [] });
            }
        } catch (error) {
            console.error("Error while adding a course :", error);
            res.status(500).send({ result: true, message: "Internal server error", data: error });
            
        }
    }
);

// update course
route.post('/:id', checkSchema(course_validation), (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ result: false, message: "Bad request", data: result.array() });
    }
    next();
},
    async (req, res) => {
        const id = req.params.id;
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).send({ result: false, message: "Invalid course id", data: [] });
        }
        const data = matchedData(req);
        if (!Types.ObjectId.isValid(data.created_by)) {
            return res.status(400).send({ result: false, message: "Invalid created_by id", data: [] });
        }
        try {
            const role = await Roles.findOne({ name: "Admin" });
            if (req.user.role.equals(role._id)) {
                const updated = await Courses.findByIdAndUpdate(id, data);
                res.status(200).send({ result: true, message: "Course updated successfully", data: updated });
            }
            else {
                res.status(403).send({ result: true, message: "You desn't have a permission to do this operation", data: [] });
            }
        } catch (error) {
            console.error("Error while updating the course :", error);
            res.status(500).send({ result: true, message: "Internal server error", data: error });
        }
    }
);

// delete course
route.delete('/:id',async (req, res) => {
        const id = req.params.id;
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).send({ result: false, message: "Invalid course id", data: [] });
        }
        
        try {
             const role = await Roles.findOne({ name: "Admin" });
            if (req.user.role.equals(role._id)) {
                const deleted = await Courses.findByIdAndDelete(id);
                res.status(200).send({ result: true, message: "Course deleted successfully", data: deleted });
            }
            else {
                res.status(403).send({ result: true, message: "You desn't have a permission to do this operation", data: [] });
            }
        } catch (error) {
            console.error("Error while updating the course :", error);
            res.status(500).send({ result: true, message: "Internal server error", data: error });
        }
    }
);

export default route;