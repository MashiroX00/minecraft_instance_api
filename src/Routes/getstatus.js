const express = require('express');
const router = express.Router();
const InstanceManager = require('../Modules/IntanceManager');
const path = require('path');

router.get('/', async (req,res) => {
    const {name, version} = req.body;
    const InstancePath = path.join(__dirname,'../../Intances');
    
    const instanceManager = new InstanceManager(name,version,InstanceManager);
    try {
        const data = await instanceManager.checkstatus();
        res.status(200).json(data);
    }catch (error){
        res.status(500).json({"message": error});
    }
})

module.exports = router;