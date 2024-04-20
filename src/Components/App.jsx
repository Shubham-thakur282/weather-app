import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spin, Card, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Bar } from "react-chartjs-2";
import { Input } from "antd";
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
Chart.register(CategoryScale);

const apiKey = process.env.REACT_APP_API_KEY;
const { Search } = Input;

const App = () => {
  const [isData, setIsData] = useState(false);
  const [city, setCity] = useState("Shimla");
  const [location, setLocation] = useState("Shimla");
  const [temp, setTemp] = useState("");
  const [weatherDescription, setWeatherDescription] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [forecast, setForecast] = useState([]);
  const [temperatureHistory, setTemperatureHistory] = useState([]);

  useEffect(() => {
    handleSubmit(city);
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setCity(newValue);
  };

  const handleSubmit = (value) => {
    setLoading(true);
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${apiKey}&units=metric`
      )
      .then((response) => {
        const weatherData = response.data;
        setLocation(value);
        setTemp(weatherData.main.temp);
        setWeatherDescription(weatherData.weather[0].description);
        const icon = weatherData.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;
        setIconUrl(iconUrl);
        setIsData(true);
        setLoading(false);
        setError(false);
      })
      .catch((err) => {
        console.log(err);
        setIsData(false);
        setError(true);
        setLoading(false);
      });

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${value}&appid=${apiKey}&units=metric`
      )
      .then((response) => {
        const forecastData = response.data.list;
        console.log(forecastData);
        const nextFiveDays = forecastData.slice(0, 40).map((item) => ({
          date: item.dt_txt,
          temperature: item.main.temp,
        }));
        setForecast(nextFiveDays);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=35&lon=139&dt=${Math.floor(
          Date.now() / 1000
        )}&appid=${apiKey}&units=metric`
      )
      .then((response) => {
        const temperatureData = response.data.hourly.map((item) => ({
          time: new Date(item.dt * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          temperature: item.temp,
        }));
        setTemperatureHistory(temperatureData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const temperatureHistoryChart = {
    labels: temperatureHistory.map((item) => item.time),
    datasets: [
      {
        label: "Temperature (°C)",
        data: temperatureHistory.map((item) => item.temperature),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      xAxes: [
        {
          type: "category",
          labels: temperatureHistory.map((item) => item.time),
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", paddingTop: "50px" }}>
      <Search
        placeholder="Enter Location"
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        defaultValue={city}
        onSearch={handleSubmit}
      />
      {loading && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Spin size="large" />
        </div>
      )}
      {error && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h1>Error finding the weather</h1>
        </div>
      )}
      {isData && (
        <div style={{ marginTop: "20px" }}>
          <Card
            title={`Weather in ${location}`}
            style={{ width: "100%", marginBottom: "20px" }}
          >
            <img
              src={iconUrl}
              alt="Weather Icon"
              style={{ marginBottom: "10px" }}
            />
            <p>Temperature: {temp} °C</p>
            <p>Description: {weatherDescription}</p>
          </Card>
          <h2>5-Day Forecast</h2>
          <Row gutter={[16, 16]}>
            {forecast.map((day, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <Card
                  title={day.date.split(" ")}
                  style={{ marginBottom: "20px" }}
                >
                  <p>Temperature: {day.temperature} °C</p>
                </Card>
              </Col>
            ))}
            
          </Row>
          <h2>Temperature History for Past 5 Days</h2>
          <Bar data={temperatureHistoryChart} options={options} />
        </div>
      )}
      
    </div>
  );
};

export default App;
