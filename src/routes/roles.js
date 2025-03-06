import { validationResult, matchedData, checkSchema } from 'express-validator';
import { Router } from 'express';
import { Roles } from '../models/roles.js';
import passport from 'passport';
import { roles_validation } from '../utils/validation_schemas.js';
import { Types } from 'mongoose';

const route = Router();
route.use(passport.authenticate('jwt', { session: false }));

// get roles
route.get('/', async (req, res) => {
    try {
        const data = await Roles.find();
        res.status(200).send({ result: true, message: "Data fetch successfully", data: data });
    } catch (error) {
        console.error("Error while fetching Roles : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while getting Roles", data: error })
    }
});

// add roles
route.post('/', checkSchema(roles_validation), (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ result: false, message: "Invalid data", data: result.array() });
    }
    next();
}, async (req, res) => {
    try {
        const data = await Roles.create(matchedData(req));
        res.status(200).send({ result: true, message: "Roles created successfully", data: data });
    } catch (error) {
        console.error("Error while creating Roles : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while creating Roles", data: error })
    }
});

// update roles
route.post('/:id', checkSchema(roles_validation), (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ result: false, message: "Invalid data", data: result.array() });
    }
    next();
}, async (req, res) => {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) { 
        return res.status(400).send({ result: false, message: "Invalid id", data: null });
    }
    try {
        const data = matchedData(req);
        const updated = await Roles.findByIdAndUpdate(id, data);
        res.status(200).send({ result: true, message: "Roles updated successfully", data: updated });
    } catch (error) {
        console.error("Error while updating Roles : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while updating Roles", data: error })
    }
});

// delete roles
route.delete('/:id', async (req, res) => {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).send({ result: false, message: "Invalid id", data: null });
    }
    try {
        const deleted = await Roles.findByIdAndDelete(id);
        res.status(200).send({ result: true, message: "Roles deleted successfully", data: deleted });
    } catch (error) {
        console.error("Error while deleting Roles : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while deleting Roles", data: error })
    }
});

export default route;