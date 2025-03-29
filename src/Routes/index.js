const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API Minecraft Instances Manager",
  });
});
router.use("/createins", require("./createins"));
router.use("/deleteins", require("./deleteins"));
router.use("/startins", require("./startins"));
router.use("/stopins", require("./stopins"));
router.use("/sendcommand", require("./rcon"));
router.use("/getinstance", require("./getInstance"));
module.exports = router;
