const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const currentWeather = document.getElementById("current-weather");
const forecast = document.getElementById("forecast");

const API_KEY = "9d667b296c3874be4a023158870a2686";

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const cityName = cityInput.value.trim();

  if (cityName) {
    const cityData = await getCityData(cityName);
    const weatherData = await getWeatherData(cityData.lat, cityData.lon);
    displayCurrentWeather(weatherData);
    displayForecast(weatherData);
  }
});

async function getCityData(cityName) {
  const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`);
  const data = await response.json();
  return data[0];
}

async function getWeatherData(lat, lon) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
  const data = await response.json();
  return data;
}

function displayCurrentWeather(data) {
  const current = data.list[0];
  const iconUrl = `https://openweathermap.org/img/wn/${current.weather[0].icon}.png`;

  currentWeather.innerHTML = `
    <h2>${data.city.name} (${new Date(current.dt * 1000).toLocaleDateString()})</h2>
    <img src="${iconUrl}" alt="${current.weather[0].description}">
    <p>Temperature: ${current.main.temp}°C</p>
    <p>Humidity: ${current.main.humidity}%</p>
    <p>Wind Speed: ${current.wind.speed} m/s</p>
  `;
}

function displayForecast(data) {
  const dailyData = data.list.filter((item) => item.dt_txt.endsWith("12:00:00"));

  forecast.innerHTML = dailyData
    .map((day) => {
      const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

      return `
        <div class="forecast-day">
          <h3>${new Date(day.dt * 1000).toLocaleDateString()}</h3>
          <img src="${iconUrl}" alt="${day.weather[0].description}">
          <p>Temp: ${day.main.temp}°C</p>
          <p>Wind: ${day.wind.speed} m/s</p>
          <p>Humidity: ${day.main.humidity}%</p>
        </div>
      `;
    })
    .join("");
}
