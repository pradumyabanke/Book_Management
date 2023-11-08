const express = require("express");
const Router = express.Router();
const bodyParser = require("body-parser");


Router.use(bodyParser.json());
Router.use(bodyParser.urlencoded({ extended: true }));



//===================== [ checking your end point valid or not ] =======================//

Router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        message: "Make Sure Your Endpoint is Correct or Not!"
    })
});


module.exports = Router;