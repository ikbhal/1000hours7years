const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataFolderPath = path.join(__dirname, '..', 'data');

router.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

router.post('/create', (req, res) => {
    const topicName = req.body.topicName;
    if(topicName === undefined || topicName === '') {
        return res.status(400).json({ error: 'Topic name is required' });
    }

    // Check if topic file already exists
    const topicFilePath = path.join(dataFolderPath, `${topicName}.json`);
    if (fs.existsSync(topicFilePath)) {
        return res.status(400).json({ error: 'Topic already exists' });
    }

    // Create a new topic file with default values
    const defaultTopicData = Array.from({ length: 1000 }, (_, id) => ({ id: id + 1, checked: false, notes: '' }));
    fs.writeFileSync(topicFilePath, JSON.stringify(defaultTopicData, null, 2));

    res.json({ message: 'Topic created successfully' });
});

router.delete('/delete/:topicName', (req, res) => {
    const topicName = req.params.topicName;
    const topicFilePath = path.join(dataFolderPath, `${topicName}.json`);

    if (fs.existsSync(topicFilePath)) {
        fs.unlinkSync(topicFilePath);
        res.json({ message: 'Topic deleted successfully' });
    } else {
        res.status(404).json({ error: 'Topic not found' });
    }
});

router.get('/hours/:topicName', (req, res) => {
    const topicName = req.params.topicName;
    const topicFilePath = path.join(dataFolderPath, `${topicName}.json`);

    if (fs.existsSync(topicFilePath)) {
        const rawData = fs.readFileSync(topicFilePath);
        const data = JSON.parse(rawData);
        res.json(data);
    } else {
        res.status(404).json({ error: 'Topic not found' });
    }
});

router.get('/list', (req, res) => {
    // Read the list of files in the data folder
    fs.readdir(dataFolderPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Filter out only JSON files and trim the file extension
        const topics = files.filter(file => file.endsWith('.json')).map(file => file.replace('.json', ''));

        res.json(topics);
    });
});


router.put('/data/:topicName/:id', (req, res) => {
    const topicName = req.params.topicName;
    const id = req.params.id;
    const topicFilePath = path.join(dataFolderPath, `${topicName}.json`);

    if (fs.existsSync(topicFilePath)) {
        const rawData = fs.readFileSync(topicFilePath);
        const data = JSON.parse(rawData);

        const index = data.findIndex(row => row.id === parseInt(id));
        if (index !== -1) {
            data[index].checked = req.body.checked;
            data[index].notes = req.body.notes;

            fs.writeFileSync(topicFilePath, JSON.stringify(data, null, 2));
            res.json({ message: 'Data saved successfully' });
        } else {
            res.status(404).json({ error: 'Row not found' });
        }
    } else {
        res.status(404).json({ error: 'Topic not found' });
    }
});

module.exports = router;
