const express = require('express');
const router = express.Router();
const InstanceManager = require('../Modules/IntanceManager');
const path = require('path');

router.delete('/', async (req, res) => {
    const { name, version } = req.body;
    if (!name || !version) {
        return res.status(400).json({ error: 'Name and version are required' });
    }
    const instancesPath = path.join(__dirname, '../../Intances');
    const instanceManager = new InstanceManager(name, version, instancesPath);
    try {
        function callback(message) {
            console.log(message);
            res.status(200).json({ message });
        }
        await instanceManager.delete(callback);
    }catch (error) {
        res.status(500).json({ error: 'Failed to delete instance' });
    }
});

module.exports = router;