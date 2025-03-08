import { regulatoion_validation as academics_validation } from '../utils/validation_schemas.js';
import { Router } from 'express';
import { Academics } from '../models/academics.js';
import { Types } from 'mongoose';
import { checkSchema, validationResult, matchedData } from 'express-validator';
import { Roles } from '../models/roles.js';
import passport from 'passport';

const route = Router(); 
route.use(passport.authenticate('jwt', { session: false }));

// get academics
route.get('/', async (req, res) => {
    try {
        const { search, limit = 10, page = 1,sort = "Descending" } = req.query;
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
                { regulation: regex }
            ];
        }
        const data = await Academics.find(query).sort({ created_at: sort_id }).skip((page - 1) * limit).limit(limit);
        res.status(200).send({ result: true, message: "Data fetch successfully", data: data });
    } catch (error) {
        console.error("Error while fetching Academics : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while getting Academics", data: error })
    }
});

// get academics by id
route.get('/:id', async (req, res) => {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).send({ result: false, message: "Invalid id", data: null });
    }
    try {
        const data = await Academics.findById(id);
        res.status(200).send({ result: true, message: "Data fetch successfully", data: data });
    } catch (error) {
        console.error("Error while fetching Academics : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while getting Academics", data: error })
    }
});

// add academics
route.post('/', checkSchema(academics_validation), async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ result: false, message: "Invalid data", data: result.array() });
    }
    try {
        const data = matchedData(req);
        if (!Types.ObjectId.isValid(data.created_by)) {
            return res.status(400).send({ result: false, message: "Invalid created_by id", data: [] });
        }

        if(!Types.ObjectId.isValid(data.department)) {
            return res.status(400).send({ result: false, message: "Invalid department id", data: [] });
        }

        const role = await Roles.findOne({ name: "Admin" });
        if (req.user.role.equals(role._id)) {
            const newAcademics = await Academics.create(data);
            res.status(201).send({ result: true, message: "Academics created successfully", data: newAcademics });
        }
        else {
            res.status(403).send({ result: false, message: "You desn't have a permission to do this operation", data: [] });
        }   
    } catch (error) {
        console.error("Error while creating Academics : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while creating Academics", data: error })
    }
});

// update academics
route.post('/:id', checkSchema(academics_validation), async (req, res) => {
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

        if(!Types.ObjectId.isValid(data.department)) {
            return res.status(400).send({ result: false, message: "Invalid department id", data: [] });
        }
        
        const role = await Roles.findOne({ name: "Admin" });
        if (req.user.role.equals(role._id)) {
            const updated = await Academics.findByIdAndUpdate(id, data);
            res.status(200).send({ result: true, message: "Academics updated successfully", data: updated });
        }
        else {
            res.status(403).send({ result: false, message: "You desn't have a permission to do this operation", data: [] });
        }
    } catch (error) {
        console.error("Error while updating Academics : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while updating Academics", data: error })
    }
});

// delete academics
route.delete('/:id', async (req, res) => {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).send({ result: false, message: "Invalid id", data: null });
    }
    try {
        const role = await Roles.findOne({ name: "Admin" });
        if (req.user.role.equals(role._id)) {
            const deleted = await Academics.findByIdAndDelete(id);
            res.status(200).send({ result: true, message: "Academics deleted successfully", data: deleted });
        }
        else {
            res.status(403).send({ result: false, message: "You desn't have a permission to do this operation", data: [] });
        }
    } catch (error) {
        console.error("Error while deleting Academics : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while deleting Academics", data: error })
    }
});

export default route;