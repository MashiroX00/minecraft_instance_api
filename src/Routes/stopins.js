const express = require('express');
const router = express.Router();
const InstanceManager = require('../Modules/IntanceManager');
const path = require('path');

router.post('/', async (req, res) => {
    const { name, version } = req.body;
    if (!name || !version) {
        return res.status(400).json({ error: 'Name and version are required' });
    }
    const instancesPath = path.join(__dirname, '../../Intances');
    const instanceManager = new InstanceManager(name, version, instancesPath);
    try {
        function callback(message) {
            console.log(message);
        }
        const respo = await instanceManager.stop(callback);
        res.status(200).json(respo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to stop instance' });
        console.error('Failed to stop instance:', error);
    }
});

module.exports = router;