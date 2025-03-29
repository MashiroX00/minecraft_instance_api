const express = require('express');
const router = express.Router();
const InstanceManager = require('../Modules/IntanceManager');
const path = require('path');

router.post('/', async (req, res) => {
    const instancesPath = path.join(__dirname, '../../Intances');
    const { name, version } = req.body;
    if (!name || !version) {
        return res.status(400).json({ error: 'Name and version are required' });
    }
    const instanceManager = new InstanceManager(name, version, instancesPath);
    try {
        function callback(message) {
            console.log(message);
            res.status(200).json({ message });
        }
        await instanceManager.create(callback);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create instance' });
        console.error('Failed to create instance:', error);
    }
}
);

module.exports = router;