const path = require('path');

const express = require('express');
const multer = require('multer');
const nanoid = require('nanoid');

const fileDb = require('../fileDb');
const config = require('../config');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

const router = express.Router();

router.get('/', async (req, res) => {
    const items = await fileDb.getLocationItems();
    const itemsArray = [];
    for(let item of items) {
        const object = {
            location: item.location,
            id: item.id,
        };
        itemsArray.push(object);
    }
    res.send(itemsArray);
});

router.get('/:id', async (req, res) => {
    const item = await fileDb.getLocationItemById(req.params.id);
    res.send(item);
});

router.delete('/:id', async (req, res) => {
    try {
        await fileDb.deleteLocation(req.params.id);
        res.send("Deleted");
    } catch(e) {
        res.send('Error!');
    }
});

router.post('/', upload.single('image'), async (req, res) => {

    if (req.body.item === '' || req.body.category === '' || req.body.location === '') {
        res.status(400).send({"error": "Error"})
    } else {
        const location = req.body;

        await fileDb.addLocation(location);
        res.send(req.body.id);
    }
});

module.exports = router;