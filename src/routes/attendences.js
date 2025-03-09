import { Attendances } from '../models/attendences.js';
import passport from 'passport';
import { Router } from 'express';
import { checkSchema, validationResult, matchedData } from 'express-validator';
import { attendances_validation } from '../utils/validation_schemas.js';
import { Types } from 'mongoose';
import { Roles } from '../models/roles.js';

const route = Router();
route.use(passport.authenticate('jwt', { session: false }));

// get attendences
route.get('/', async (req, res) => {
    try {
        const { search, limit = 10, page = 1, sort = "Descending" } = req.query;
        const query = {};
        let sort_id;

        if (sort === "Ascending") {
            sort_id = 1;
        } else {
            sort_id = -1;
        }

        if (search) { 
            const regex = new RegExp(search, 'i');
            query.$or = [
                { year, regex },
                { month, regex },
                { date, regex }
            ];
        }

        const attendences = await Attendances.aggregate([
            { $match: query },
            { $group: {
            _id: { year: "$year", month: "$month" },
            records: { $push: "$$ROOT" }
            }},
            { $sort: { "records.date": sort_id } },
            { $skip: Math.max((page - 1) * limit, 0) },
            { $limit: Number(limit) }
        ]);
        res.status(200).json({ result : true, message : "Attendances retrieved successfully", data : attendences });
    } catch (error) {
        console.log("Error occured while retrieving attendences", error);
        res.status(500).json({ result : false, message : "Error occured while retrieving attendences", data : [] });
    }
});

// add attendence
route.post('/',checkSchema(attendances_validation), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ result : false, message : "Invalid data", data : errors.array() });
        }

        const data = matchedData(req);
        if (!Types.ObjectId.isValid(data.batch) && !Types.ObjectId.isValid(data.department) && !Types.ObjectId.isValid(data.given_by)) {
            return res.status(400).json({ result : false, message : "Invalid data", data : [] });
        }

        const attendence = await Attendances.create(data);
        res.status(200).json({ result : true, message : "Attendance added successfully", data : attendence });
    } catch (error) {
        console.log("Error occured while adding attendence", error);
        res.status(500).json({ result : false, message : "Error occured while adding attendence", data : [] });
    }
});

// update attendence
route.post('/:id', checkSchema(attendances_validation), async (req, res) => { 
    const id = req.params.id;
    if(!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ result : false, message : "Invalid Id", data : [] });
    }

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ result : false, message : "Invalid data", data : errors.array() });
        }

        const data = matchedData(req);
        if (!Types.ObjectId.isValid(data.batch) && !Types.ObjectId.isValid(data.department) && !Types.ObjectId.isValid(data.given_by)) {
            return res.status(400).json({ result : false, message : "Invalid data", data : [] });
        }
        
        const attendenceRecord = await Attendances.findById(id);
        if (!attendenceRecord) {
            return res.status(404).json({ result: false, message: "Attendance record not found", data: [] });
        }
        const oneHour = 60 * 60 * 1000;
        if (Date.now() - new Date(attendenceRecord.createdAt).getTime() > oneHour) {
            return res.status(400).json({ result: false, message: "Cannot update attendance record && Updated time is over", data: [] });
        }
        const attendence = await Attendances.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json({ result : true, message : "Attendance updated successfully", data : attendence });
    } catch (error) {
        console.log("Error occured while updating attendence", error);
        res.status(500).json({ result : false, message : "Error occured while updating attendence", data : [] });
    }
});

// delete attendence
route.delete('/:id', async (req, res) => {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ result: false, message: "Invalid Id", data: [] });
    }

    try {
        const role = await Roles.findOne({ name: "Admin" });
        if (req.user.role.equals(role._id)) {
            const deleteRecord = await Attendances.findByIdAndDelete(id);
            res.status(200).json({ result: true, message: "Attendance deleted successfully", data: deleteRecord });
        }
        else {
            return res.status(403).json({ result: false, message: "Unauthorized access", data: [] });
        }
    } catch (error) {
        console.log("Error occured while deleting attendence", error);
        res.status(500).json({ result: false, message: "Error occured while deleting attendence", data: [] });
    }
});

export default route;