// require("dotenv").config({path:"./src/Components"});
import React ,{useState} from "react";
import axios from "axios";

const App = ()=>{

    

    const [city,setCity] = useState("");
    const apiKey = process.env.REACT_APP_API_KEY;

    const handleChange = (e)=>{
        const newValue = e.target.value;
        setCity(newValue);
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        axios.get(url).
        then((response)=>{

            const weatherData = JSON.parse(response);
            console.log(weatherData.main.temp);

        })

    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={city} onChange={handleChange} />
                <input type="submit"/>
            </form>
        </div>
    )
};

export default App;