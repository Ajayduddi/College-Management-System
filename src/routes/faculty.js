import { Router } from 'express';
import { faculty_validation } from '../utils/validation_schemas.js';
import { checkSchema, validationResult, matchedData } from 'express-validator';
import { Types } from 'mongoose';
import { Roles } from '../models/roles.js';
import { Faculty } from '../models/faculty.js';
import passport from 'passport';

const route = Router();
route.use(passport.authenticate('jwt', { session: false }));

// get faculty
route.get('/', async (req, res) => {
    try {
        const { search, limit = 10, page = 1, sort = "Ascending" } = req.query;
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
                { name: regex }
            ];
        }

        const faculty = await Faculty.aggregate([
            { $match: query },
            { $lookup: { from: "users", localField: "user_details", foreignField: "_id", as: "user_details" } },
            { $lookup: { from: "departments", localField: "department", foreignField: "_id", as: "department_details" } },
            { $lookup: { from: "courses", localField: "courses_taught", foreignField: "_id", as: "courses_detail" } },
            { $unwind: { path: "$courses_detail", preserveNullAndEmptyArrays: true } },
            { $group: {
            _id: { department: "$department" },
            records: { $push: "$$ROOT" }
            }},
            { $sort: { "records.department": sort_id } },
            { $skip: Math.max((page - 1) * limit, 0) },
            { $limit: Number(limit) },
            { $project: { records: 1 } }
        ]);
        res.status(200).json({ result: true, message: "Data fetched successfully", data: faculty });
    } catch (error) {
        console.error("Error while fetching faculty: ", error);
        res.status(500).json({ result: false, message: "Internal server error while getting faculty", data: error });
    }
});

// add faculty
route.post('/', checkSchema(faculty_validation), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ result: false, message: "Invalid data", data: errors.array() });
        }

        const data = matchedData(req);
        if (!Types.ObjectId.isValid(data.created_by) && !Types.ObjectId.isValid(data.department) && !Types.ObjectId.isValid(data.user_details)) {
            return res.status(400).json({ result: false, message: "Invalid data", data: [] });
        }

        const role = await Roles.findOne({ name: "Admin" });
        if (req.user.role.equals(role._id)) {
            const faculty = await Faculty.create(data);
            res.status(201).json({ result: true, message: "Faculty created successfully", data: faculty });
        }
        else {
            return res.status(403).json({ result: false, message: "Unauthorized access", data: [] });
        }
    } catch (error) {
        console.error("Error while creating faculty : ", error);
        res.status(500).json({ result: false, message: "Internal server Error while creating faculty", data: error })
    }
});

// get data by id
route.get('/:id', async (req, res) => {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ result: false, message: "Invalid Id", data: [] });
    }
    try {
        const faculty = await Faculty.findById(id);
        res.status(200).json({ result: true, message: "Data fetched successfully", data: faculty });
    } catch (error) {
        console.error("Error while fetching faculty: ", error);
        res.status(500).json({ result: false, message: "Internal server error while getting faculty", data: error });
    }
});

// update faculty
route.post('/:id', checkSchema(faculty_validation), async (req, res) => {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ result: false, message: "Invalid Id", data: [] });
    }
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ result: false, message: "Invalid data", data: errors.array() });
        }

        const data = matchedData(req);
        if (!Types.ObjectId.isValid(data.created_by) && !Types.ObjectId.isValid(data.department) && !Types.ObjectId.isValid(data.user_details)) {
            return res.status(400).json({ result: false, message: "Invalid data", data: [] });
        }

        const role = await Roles.findOne({ name: "Admin" });
        if (req.user.role.equals(role._id)) {
            const updated = await Faculty.findByIdAndUpdate(id, data);
            res.status(200).json({ result: true, message: "Faculty updated successfully", data: updated });
        }
        else {
            return res.status(403).json({ result: false, message: "Unauthorized access", data: [] });
        }
    } catch (error) {
        console.error("Error while updating faculty : ", error);
        res.status(500).json({ result: false, message: "Internal server Error while updating faculty", data: error })
    }
});

// delete faculty
route.delete('/:id', async (req, res) => {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ result: false, message: "Invalid Id", data: [] });
    }
    try {
        const role = await Roles.findOne({ name: "Admin" });
        if (req.user.role.equals(role._id)) {
            const deleteRecord = await Faculty.findByIdAndDelete(id);
            res.status(200).json({ result: true, message: "Faculty deleted successfully", data: deleteRecord });
        }
        else {
            return res.status(403).json({ result: false, message: "Unauthorized access", data: [] });
        }
    } catch (error) {
        console.log("Error occured while deleting faculty", error);
        res.status(500).json({ result: false, message: "Error occured while deleting faculty", data: [] });
    }    
});

export default route;