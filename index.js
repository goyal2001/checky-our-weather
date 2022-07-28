
const express = require("express");
const app =express();
const bodyParser = require("body-parser");
const ejs = require("ejs");

const https = require("https");

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",function(req,res) {
    res.render("index");
});

app.post("/",function(req,res){
    // console.log(req.body.cityName);
    const city = req.body.cityName;
    const apiKey = "c52a06a812ed6c14aa1d6d95ca92d623";
    const units = "metric";
    const url="https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey+"&units="+units;
    https.get(url,function(response){
        // console.log(response.statusCode);
        if(response.statusCode === 200){
            response.on("data",function(data){
                const weatherData = JSON.parse(data);
                // console.log(weatherData);
                // const temp=weatherData.main.temp;
                // const desc = weatherData.weather[0].description
                // // console.log(desc);
                const icon = weatherData.weather[0].icon;
                const imageUrl = " http://openweathermap.org/img/wn/"+icon+"@2x.png";
                // res.write("<h1>The Temperature of "+city+" is "+temp+" degree celcius.</h1>");
                // res.write("The weather is currently "+desc);
                // res.write("<img src="+imageUrl+">")
                // res.send();
                res.render("home",{weatherData:weatherData,icon:imageUrl});
            })
        }else{
            res.redirect("/failure")
        }
    })
})

app.get("/failure",function(req,res){
    res.render("failure");
})

let port = process.env.PORT;
if(port == null || port ==""){
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started Successfully");
});