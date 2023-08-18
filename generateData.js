const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'data', 'data.json');

// Generate defaultRowsData dynamically using a for loop
const defaultRowsData = [];
const numberOfRows = 1000;
for (let i = 1; i <= numberOfRows; i++) {
  defaultRowsData.push({ id: i, checked: false, notes: '' });
}

// Write defaultRowsData to data.json file
fs.writeFileSync(dataFilePath, JSON.stringify(defaultRowsData, null, 2));

console.log('data.json generated with default data.');
