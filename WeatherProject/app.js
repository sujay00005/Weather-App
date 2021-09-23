
const express = require("express");
const http = require('http');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended : true}));

app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html')
});

app.post('/',function(req,res){
    console.log("Post request recieved." +req.body.cityName);

    
const apikey = 'NwGAGiBaVznAYwDtnaCL92pVCGVxPrYL';
    const query = req.body.cityName;

    const cityKeyUrl = "http://dataservice.accuweather.com/locations/v1/cities/search?apikey="+ apikey +"&q=" + query;

    http.get(cityKeyUrl, function(response){
        console.log(response.statusCode);
        
        response.on('data',function(data) {
            const cityData   = JSON.parse(data);
            const cityKey = cityData[0].Key;

            const url = 'http://dataservice.accuweather.com/currentconditions/v1/' + cityKey + '?apikey=' + apikey;
            var temp;
            var weatherCondition;
            //var icon;

            http.get(url,function(resp) {
                console.log(resp.statusCode);

                resp.on("data", function(data){
                    var weatherData = JSON.parse(data);
                    temp = weatherData[0].Temperature.Metric.Value;
                    console.log(temp);
                    weatherCondition = weatherData[0].WeatherText; 
                    console.log(weatherCondition) ;                  
                    //icon = 'http://openweathermap.org/img/wn/'+ weatherData[0].WeatherIcon+ '@2x.png';
                });
                res.write("<p>The weather is currently "+ weatherCondition+"</p>");
                res.write("<h1>The temperatur in "+query+" is " + temp + "</h1>");
                //res.write("<img src=" + icon + ">");
                res.send();
            })
            
        })
    })

});





app.listen(3000,function(){
    console.log('Server is running on port 3000.');
});