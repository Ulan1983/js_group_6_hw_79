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
    const items = await fileDb.getItems();
    const itemsArray = [];
    for(let item of items) {
        const object = {
            item: item.item,
            itemId: item.id,
            category_id: item.category_id,
            location_id: item.location_id
        };
        itemsArray.push(object);
    }
    res.send(itemsArray);
});

router.get('/:id', async (req, res) => {
    const item = await fileDb.getItemById(req.params.id);
    res.send(item);
});

router.delete('/:id', async (req, res) => {
    await fileDb.deleteItem(req.params.id);
    res.send("Deleted");
});

router.post('/', upload.single('image'), async (req, res) => {

    if (req.body.item === '' || req.body.category_id === '' || req.body.location_id === '') {
        res.status(400).send({"error": "Error"})
    } else {
        const item = req.body;

        if (req.file) {
            item.image = req.file.filename;
        }

        await fileDb.addItem(item);
        res.send(req.body.id);
    }
});

router.put('/:id', upload.single('image'), async (req, res) => {
    const itemData = req.body;
    let itemId = await fileDb.getItemById(req.params.id);

    if (!itemId) {
        return res.status(404).send({"Error": "Item not found!"})
    }

    itemId = {...itemId, ...itemData};

    if (req.file) {
        itemId.image = req.file.filename;
    }

    await fileDb.editItem(itemId);

    res.send(itemId);
});

module.exports = router;