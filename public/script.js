document.addEventListener("DOMContentLoaded", function () {
  const cities = ["New Delhi", "Mumbai", "Hyderabad", "Chennai", "Bengaluru"];
  const apiKey = "bdd90d281d3349e1b71112357251102";
  const weatherUrl = "https://api.weatherapi.com/v1/forecast.json";
  const weatherDetails = document.getElementById("weatherDetails");
  const cityInput = document.querySelector("input[name='cityName']");
  fetch(`${weatherUrl}?key=${apiKey}&q=New Delhi&days=3`)
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error fetching weather:", error));

  // Buttons
  const currentWeatherBtn = document.getElementById("currentWeather");
  const nextWeatherBtn = document.getElementById("nextWeather");
  const threeDayForecastBtn = document.getElementById("threeDayForecast");
  const sevenDayReportBtn = document.getElementById("sevenDayReport");

  // Function to fetch data
  function fetchWeather(endpoint, days = 1) {
    const city = cityInput.value.trim();
    if (!city) {
      weatherDetails.innerHTML = `<p style="color:red;">Please enter a city name first.</p>`;
      return;
    }

    fetch(`${weatherUrl}/${endpoint}.json?key=${apiKey}&q=${city}&days=${days}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          weatherDetails.innerHTML = `<p style="color:red;">${data.error.message}</p>`;
        } else {
          displayWeather(data, days);
        }
      })
      .catch((error) => {
        weatherDetails.innerHTML = `<p style="color:red;">Error fetching data</p>`;
        console.error("Error fetching weather:", error);
      });
  }

  // Function to display weather data
  function displayWeather(data, days) {
    let output = `<h3>Weather in ${data.location.name}, ${data.location.country}</h3>`;

    if (days === 1) {
      // Current weather
      output += `
        <p><strong>Temperature:</strong> ${data.current.temp_c}°C</p>
        <p><strong>Condition:</strong> ${data.current.condition.text}</p>
        <p><img src="${data.current.condition.icon}" alt="Weather icon"></p>
        <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.current.wind_kph} km/h</p>
      `;
    } else {
      // Forecast data
      data.forecast.forecastday.forEach((day) => {
        output += `
          <p><strong>${day.date}:</strong> ${day.day.avgtemp_c}°C, ${day.day.condition.text}</p>
          <p><img src="${day.day.condition.icon}" alt="Weather icon"></p>
        `;
      });
    }

    weatherDetails.innerHTML = output;
  }

  // Event Listeners for Buttons
  currentWeatherBtn.addEventListener("click", () => fetchWeather("current"));
  nextWeatherBtn.addEventListener("click", () => fetchWeather("forecast", 2));
  threeDayForecastBtn.addEventListener("click", () =>
    fetchWeather("forecast", 3)
  );
  sevenDayReportBtn.addEventListener("click", () =>
    fetchWeather("forecast", 7)
  );

  // Fetch Weather for Major Cities
  function fetchMajorCityWeather() {
    cities.forEach((city) => {
      fetch(`${weatherUrl}?key=${apiKey}&q=${city}&days=3`) // 3-day forecast
        .then((response) => response.json())
        .then((data) => {
          if (!data.error) {
            const weatherIcon = data.current.condition.icon;
            document.getElementById(
              city.replace(" ", "").toLowerCase() + "Weather"
            ).innerHTML = `
                <p><strong>${city}:</strong> ${data.current.temp_c}°C 
                
                <img src="https:${weatherIcon}" alt="Weather Icon" style="width: 40px; vertical-align: middle; ">
                
                 ${data.current.humidity}%
                </p>
               
              `;
          }
        })
        .catch((error) =>
          console.error(`Error fetching weather for ${city}:`, error)
        );
    });
  }

  // Fetch AQI for Current Location
  function fetchAQIForCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          fetch(`${weatherUrl}?key=${apiKey}&q=${lat},${lon}&aqi=yes`)
            .then((response) => response.json())
            .then((data) => {
              if (!data.error) {
                document.getElementById("aqiResult").innerHTML = `
                    <p><strong>Location:</strong> ${data.location.name}, ${data.location.country}</p>
                    <p><strong>AQI Level:</strong> ${data.current.air_quality.pm2_5} μg/m³</p>
                  `;
              }
            })
            .catch((error) => console.error("Error fetching AQI:", error));
        },
        (error) => {
          console.error("Geolocation error:", error);
          document.getElementById("aqiResult").innerHTML =
            "<p style='color:red;'>Location access denied. Cannot fetch AQI.</p>";
        }
      );
    } else {
      document.getElementById("aqiResult").innerHTML =
        "<p style='color:red;'>Geolocation is not supported by your browser.</p>";
    }
  }

  // Call functions on page load
  fetchMajorCityWeather();
  fetchAQIForCurrentLocation();
});
