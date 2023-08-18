const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3041; // Use port 3041

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const dataFilePath = path.join(__dirname, 'data.json');

// Update data for a specific row using PUT request
app.put('/api/data/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { checked, notes } = req.body;

    try {
        const rawData = fs.readFileSync(dataFilePath);
        const data = JSON.parse(rawData);

        const index = data.findIndex(row => row.id === id);
        if (index !== -1) {
            data[index].checked = checked;
            data[index].notes = notes;

            fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

            res.json({ message: 'Data updated successfully' });
        } else {
            res.status(404).json({ error: 'Row not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/data', (req, res) => {
    // Read data from the JSON file and send it back
    try {
        const rawData = fs.readFileSync(dataFilePath);
        const data = JSON.parse(rawData);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/data', (req, res) => {
    const newData = req.body;

    // Read existing data from the JSON file
    try {
        const rawData = fs.readFileSync(dataFilePath);
        const data = JSON.parse(rawData);

        // Add the new data to the existing data array
        data.push(newData);

        // Write the updated data back to the JSON file
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

        res.json({ message: 'Data saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
