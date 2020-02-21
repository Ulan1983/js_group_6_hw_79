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
    const items = await fileDb.getCategoryItems();
    const itemsArray = [];
    for(let item of items) {
        const object = {
            category: item.category,
            id: item.id,
        };
        itemsArray.push(object);
    }
    res.send(itemsArray);
});

router.get('/:id', async (req, res) => {
    const item = await fileDb.getCategoryItemById(req.params.id);
    res.send(item);
});

router.delete('/:id', async (req, res) => {
    try {
        await fileDb.deleteCategory(req.params.id);
        res.send("Deleted");
    } catch(e) {
        res.send('Error!');
    }
});

router.post('/', upload.single('image'), async (req, res) => {

    if (req.body.category === '') {
        res.status(400).send({"error": "Error"})
    } else {
        const category = req.body;

        await fileDb.addCategory(category);
        res.send(req.body.id);
    }
});

module.exports = router;