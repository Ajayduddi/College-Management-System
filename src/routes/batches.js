import {batch_validation } from '../utils/validation_schemas.js';
import { Router } from 'express';
import { Batches } from '../models/batchs.js';
import { Types } from 'mongoose';
import { checkSchema, validationResult, matchedData } from 'express-validator';
import { Roles } from '../models/roles.js';
import passport from 'passport';

const route = Router();
route.use(passport.authenticate('jwt', { session: false }));

// get batches
route.get('/', async (req, res) => { 
    try {
        const { search, limit = 10, page = 1 , sort = "Asscending" } = req.query;
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
        const data = await Batches.find(query).sort({ created_at: sort_id }).skip((page - 1) * limit).limit(limit);
        res.status(200).send({ result: true, message: "Data fetch successfully", data: data });
    } catch (error) {
        console.error("Error while fetching Batches : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while getting Batches", data: error })
    }
});

// get batch by id
route.get('/:id', async (req, res) => {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).send({ result: false, message: "Invalid id", data: null });
    }
    try {
        const data = await Batches.findById(id);
        res.status(200).send({ result: true, message: "Data fetch successfully", data: data });
    } catch (error) {
        console.error("Error while fetching Batches : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while getting Batches", data: error })
    }
});

// add batch
route.post('/', checkSchema(batch_validation), async(req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ result: false, message: "Invalid data", data: result.array() });
    }

    try {
        const data = matchedData(req);
        if (!Types.ObjectId.isValid(data.department)) {
            return res.status(400).send({ result: false, message: "Invalid department id", data: [] });
        }

        if(!Types.ObjectId.isValid(data.created_by)) {
            return res.status(400).send({ result: false, message: "Invalid created_by id", data: [] });
        }

        const role = await Roles.findOne({ name: "Admin" });
        if (req.user.role.equals(role._id)) {
            const newBatch = await Batches.create(data);
            res.status(201).send({ result: true, message: "Batches created successfully", data: newBatch });
        }
        else {
            res.status(403).send({ result: false, message: "You desn't have a permission to do this operation", data: [] });
        }
    } catch (error) {
        console.log("Error while creating Batches : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while creating Batches", data: error })
    }
});

// update batch
route.post('/:id', checkSchema(batch_validation), async(req, res) => {
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
        if (!Types.ObjectId.isValid(data.department)) {
            return res.status(400).send({ result: false, message: "Invalid department id", data: [] });
        }

        if(!Types.ObjectId.isValid(data.created_by)) {
            return res.status(400).send({ result: false, message: "Invalid created_by id", data: [] });
        }
        
        const role = await Roles.findOne({ name: "Admin" });
        if (req.user.role.equals(role._id)) {
            const updated = await Batches.findByIdAndUpdate(id, data);
            res.status(200).send({ result: true, message: "Batches updated successfully", data: updated });
        }
        else {
            res.status(403).send({ result: false, message: "You desn't have a permission to do this operation", data: [] });
        }
    } catch (error) {
        console.log("Error while updating Batches : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while updating Batches", data: error })
    }
});

// delete batch
route.delete('/:id', async(req, res) => {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).send({ result: false, message: "Invalid id", data: null });
    }
    try {
        const role = await Roles.findOne({ name: "Admin" });
        if (req.user.role.equals(role._id)) {
            const deleted = await Batches.findByIdAndDelete(id);
            res.status(200).send({ result: true, message: "Batches deleted successfully", data: deleted });
        }
        else {
            res.status(403).send({ result: false, message: "You desn't have a permission to do this operation", data: [] });
        }
    } catch (error) {
        console.log("Error while deleting Batches : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while deleting Batches", data: error })
    }
});

export default route;