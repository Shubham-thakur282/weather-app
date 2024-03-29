// require("dotenv").config({path:"./src/Components"});
import React ,{useState} from "react";
import axios from "axios";

const App = ()=>{

    const [isData,setIsData] = useState(false);
    const [city,setCity] = useState("");
    const [location,setLocation] = useState("");
    const [temp,setTemp] = useState("");
    const [weatherDescription,setWeatherDescription] = useState("");
    const [iconUrl,setIconUrl] = useState("");
    const apiKey = process.env.REACT_APP_API_KEY;

    const handleChange = (e)=>{
        const newValue = e.target.value;
        setCity(newValue);
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        axios.get(url)
        .then((response)=>{
            // console.log(response);
            const weatherData = response.data;
            console.log(weatherData);
            setLocation(city);
            setTemp(weatherData.main.temp);
            setWeatherDescription(weatherData.weather[0].description);
            const icon = weatherData.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`
            setIconUrl(iconUrl);
            setIsData(true);
        })

    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={city} onChange={handleChange} />
                <input type="submit"/>
            </form>

            {isData && <div>
                <h1>The weather in {location} is {temp} degree celcius</h1>
            </div>}
            {/* <div>
                <h1>{`The weather in ${city} is ${temp} degree celcius`}</h1>
            </div> */}

        </div>
    )
};

export default App;