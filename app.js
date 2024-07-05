const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const date = require(__dirname + "/date.js");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

let wData = [];

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {

    res.sendFile(__dirname + "/index.html");

});

app.get("/result", function (req, res) {
    const day = date.getDate();

    res.render("result", {
        date: day,
        wData: wData
    });

});

app.post("/", function (req, res) {
    const city = req.body.cityName;
    const url = "https://api.weatherapi.com/v1/current.json?key=" + process.env.APIKEY + "&q=" + city

    https.get(url, (response) => {
        console.log(response.statusCode);

        if (response.statusCode === 200) {

            response.on("data", function (data) {
                const weatherData = JSON.parse(data);
                wData = {
                    temp: weatherData.current.temp_c,
                    weatherDiscription: weatherData.current.condition.text,
                    icon: "" + weatherData.current.condition.icon,
                    city: weatherData.location.name,
                    country: weatherData.location.country,
                    fLikes: weatherData.current.feelslike_c
                }
            });

            res.redirect("/result");

        } else {
            res.send("Enter Valid City");
        }

    });

});

app.post("/tryAnother", function (req, res) {
    res.redirect("/");
});

app.listen(3000, function () {
    console.log("Server is running on port 3000.")
});


