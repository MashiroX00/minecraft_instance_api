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
        await instanceManager.start(6144,callback);
        res.status(200).json('Started');
    } catch (error) {
        res.status(500).json({ error: 'Failed to start instance' });
        console.error('Failed to start instance:', error);
    }
})

module.exports = router;