const express = require('express');
const router = express.Router();
const InstanceManager = require('../Modules/IntanceManager');
const path = require('path');

router.post('/', async (req, res) => {
    const { name, version , command,port,password} = req.body;
    if (!name || !version || !command) {
        return res.status(400).json({ error: 'Name, version and command are required' });
    }
    const instancesPath = path.join(__dirname, '../../Intances');
    const instanceManager = new InstanceManager(name, version, instancesPath);
    console.log(`Retrieved: Instance Name: ${name},Version: ${version},command:${command},port:${port},password:${password}`);
    try {
        function callback(message) {
            console.log(message);
            res.status(200).json({ message });
        }
        await instanceManager.sencommand(command,callback,port,password);
    } catch (error) {
        res.status(500).json({ error: 'Failed to execute RCON command' });
        console.error('Failed to execute RCON command:', error);
    }
});

module.exports = router;