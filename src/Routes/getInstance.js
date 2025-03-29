const express = require('express');
const router = express.Router();
const InstanceManager = require('../Modules/IntanceManager');
const path = require('path');

router.get('/', async (req,res) => {
    const InstancePath = path.join(__dirname, '../../Intances');
    const {name, version} = req.body;
    if(!name || !version) {
        return res.status(400,).json({"message": "Name and Version of Instance is require."});
    }
    const instanceManager = new InstanceManager(name,version,InstancePath);
    try {
        let data = await instanceManager.getintance(name,version) || {};
        console.log(data)
        // let dataparsed = JSON.parse(data);
        console.log(data);
        return res.status(200).json(data)
    }catch (error) {
        console.log('Failed to request data');
        return res.status(500).json({"message": "Failed to request data","isEmpty": true});
    }
})

module.exports = router