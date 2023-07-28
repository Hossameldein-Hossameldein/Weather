"use strict";
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let s_btn = document.getElementById('search');
let cartona='';
let weatherBox = document.querySelector('.weather-box');
async function getIp() {
  let api = await fetch(`https://api.ipify.org/?format=json`);
  if (api.status == 200) {
    let response = await api.json();
    return (response.ip)
  }

}
async function getDetailsIp() {
  let ip = await getIp();
  let api = await fetch(`https://api.weatherapi.com/v1/ip.json?key=3e7ba761baa74999bfd235126231102&q=${ip}`);
  if (api.status == 200) {
    let response = await api.json();
    await GetWeather(response.city)
    putDetailsIp(response)
  }

}
function putDetailsIp(ip_response) {
  let ip_info = Array.from(document.querySelectorAll('.ip-info'));
  for (let i = 0; i < ip_info.length; i++) {
    if (ip_info[i].getAttribute('data-info') == 'ip') {
      ip_info[i].innerHTML = ip_response.ip;
    }
    if (ip_info[i].getAttribute('data-info') == 'country_name') {
      ip_info[i].innerHTML = ip_response.country_name;
    }
    if (ip_info[i].getAttribute('data-info') == 'country_code') {
      ip_info[i].innerHTML = ip_response.country_code;
    }
    if (ip_info[i].getAttribute('data-info') == 'city') {
      ip_info[i].innerHTML = ip_response.city;
    }

  }
}
async function GetWeather(C_name) {
  let api = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=3e7ba761baa74999bfd235126231102&q=${C_name}&days=3`);
  if (api.status == 200) {
    let response = await api.json();
    getWeatherToday(response.current , response.location.name);
    getWeatherOther(response.forecast.forecastday , response.location.name)
  }

}

function getWeatherToday(response ,city) {
  let e = new Date(response.last_updated.replace(" ", "T"))
  let num_day = response.last_updated.split(" ")[0].split("-")[2];
  let wind = windDirection(response.wind_dir);
  cartona += ` <div class="col-md-4">
  <div class="box">
    <div class="title d-flex justify-content-between">
      <h4>${days[e.getDay()]}</h4>
      <h4>${num_day} ${monthNames[e.getMonth()]}</h4>
    </div>
    <div class="body">
      <h5>${city}</h5>
      <p class="text-white">${response.temp_c} C</p>
      <img src="https://${response.condition.icon}" alt="" srcset="">
      <h5>${response.condition.text}</h5>
      <div class="icons d-flex justify-content-start">
        <div class="p-2">
          <img src="images/icon-umberella.png" alt="" srcset="">
          <span>${response.humidity}%</span>
        </div>
        <div class="p-2">
          <img src="images/icon-wind.png" alt="" srcset="">
          <span>${response.wind_kph}km/h</span>
        </div>
        <div class="p-2">
          <img src="images/icon-compass.png" alt="" srcset="">
          <span>${wind}</span>
        </div>
      </div>
    </div>
  </div>
</div>`
}
function windDirection(windDirection) {
  let wind;
  switch (windDirection) { // 16 direction
    case 'N':
      wind = 'North'
      break;
    case 'E':
      wind = 'East'
      break;
    case 'S':
      wind = 'South'
      break;
    case 'W':
      wind = 'West'
      break;
    default:
      wind = 'East'
      break;
  }
  return wind;
}
function getWeatherOther(response , city){
  for (let i = 1; i < response.length; i++) {
      let c = new Date(response[i].date)
      let num_day = response[i].date.split("-")[2];
      cartona += ` <div class="col-md-4">
      <div class="box">
        <div class="title d-flex justify-content-between">
          <h4>${days[c.getDay()]}</h4>
          <h4>${num_day} ${monthNames[c.getMonth()]}</h4>
        </div>
        <div class="body">
          <h5>${city}</h5>
          <p class="text-white">${response[i].day.avgtemp_c} C</p>
          <img src="https://${response[i].day.condition.icon}" alt="" srcset="">
          <h5>${response[i].day.condition.text}</h5>
          <div class="icons d-flex justify-content-start">
            <div class="p-2">
              <img src="images/icon-umberella.png" alt="" srcset="">
              <span>${response[i].day.avghumidity}%</span>
            </div>
            <div class="p-2">
              <img src="images/icon-wind.png" alt="" srcset="">
              <span>${response[i].day.maxwind_kph}km/h</span>
            </div>
            <div class="p-2">
              <img src="images/icon-compass.png" alt="" srcset="">
              <span>East</span>
            </div>
          </div>
        </div>
      </div>
    </div>`
    }
 weatherBox.innerHTML = cartona;
 cartona = '';
}
getDetailsIp();
s_btn.addEventListener('input', () => { GetWeather(s_btn.value) })