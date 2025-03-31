const express = require('express');
const router = express.Router();
const InstanceManager = require('../Modules/IntanceManager');
const path = require('path');

router.post('/', async (req,res) => {
    const {name, version} = req.body;
    if (!name || !version) {
        return res.status(400).json({"message": "Missing Name or Version"})
    }
    const InstancePath = path.join(__dirname,'../../Intances');
    console.log("Received:",name,version)
    const instanceManager = new InstanceManager(name,version,InstanceManager);
    try {
        const data = await instanceManager.checkstatus();
        res.status(200).json(data);
    }catch (error){
        res.status(500).json({"message": error});
    }
})

module.exports = router;