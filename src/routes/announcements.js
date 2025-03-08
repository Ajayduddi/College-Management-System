import { announcement_validation } from '../utils/validation_schemas.js';
import { Router } from 'express';
import { Announcements } from '../models/announcements.js';
import { Types } from 'mongoose';
import { checkSchema, validationResult, matchedData } from 'express-validator';
import passport from 'passport';

const route = Router();
route.use(passport.authenticate('jwt', { session: false }));

// get announcements
route.get('/', async (req, res) => {
    try {
        const { search, limit = 10, page = 1, sort = "Descending" } = req.query;
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
                { title: regex },
            ];
        }
        const data = await Announcements.find(query).sort({ created_at: sort_id }).skip((page - 1) * limit).limit(limit);
        res.status(200).send({ result: true, message: "Data fetch successfully", data: data });
    } catch (error) {
        console.error("Error while fetching Announcements : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while getting Announcements", data: error })
    }
});

// get announcement by id
route.get('/:id', async (req, res) => {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).send({ result: false, message: "Invalid id", data: null });
    }
    try {
        const data = await Announcements.findById(id);
        res.status(200).send({ result: true, message: "Data fetch successfully", data: data });
    } catch (error) {
        console.error("Error while fetching Announcements : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while getting Announcements", data: error })
    }
});

// add announcement
route.post('/', checkSchema(announcement_validation), async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ result: false, message: "Invalid data", data: result.array() });
    }
    try {
        const data = matchedData(req);
        if (!Types.ObjectId.isValid(data.created_by)) {
            return res.status(400).send({ result: false, message: "Invalid created_by id", data: [] });
        }
        const newAnnouncement = await Announcements.create(data);
        res.status(201).send({ result: true, message: "Announcements created successfully", data: newAnnouncement });
    } catch (error) {
        console.error("Error while creating Announcements : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while creating Announcements", data: error })
    }
});

// update announcement
route.post('/:id', checkSchema(announcement_validation), async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ result: false, message: "Invalid data", data: result.array() });
    }
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).send({ result: false, message: "Invalid id", data: null });
    }
    try {
        const data = matchedData(req);
        if (!Types.ObjectId.isValid(data.created_by)) {
            return res.status(400).send({ result: false, message: "Invalid created_by id", data: [] });
        }
        const updated = await Announcements.findByIdAndUpdate(id, data);
        res.status(200).send({ result: true, message: "Announcements updated successfully", data: updated });
    } catch (error) {
        console.error("Error while updating Announcements : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while updating Announcements", data: error })
    }
});

// delete announcement
route.delete('/:id', async (req, res) => {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).send({ result: false, message: "Invalid id", data: null });
    }
    try {
        const deleted = await Announcements.findByIdAndDelete(id);
        res.status(200).send({ result: true, message: "Announcements deleted successfully", data: deleted });
    } catch (error) {
        console.error("Error while deleting Announcements : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while deleting Announcements", data: error })
    }
});

export default route;