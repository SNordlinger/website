import { resolve } from "dns";

const NWS_MONTANA_ENDPOINT =
  "https://api.weather.gov/stations/KGPI/observations/latest";

function getWeatherText(tempF) {
  const quip = getWeatherQuip(tempF);
  return `It is ${tempF.toFixed(1)}° F. ${quip}`;
}

function getWeatherQuip(tempF) {
  if (tempF < 25) return "Yup. 🥶";
  if (tempF < 40) return "Balmy by Montana standards.";
  if (tempF < 80) return "Pretty nice out.";
  return "Quite the opposite. 🥵";
}

function cToF(tempC) {
  return (tempC * 9) / 5 + 32;
}

function getTemp(data) {
  return data.properties.temperature.value;
}

async function getMontanaTemp() {
  const resp = await fetch(NWS_MONTANA_ENDPOINT);
  const data = await resp.json();
  const tempC = getTemp(data);
  return cToF(tempC);
}

function createMessageElement(message) {
  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  return messageElement;
}

function createLoadElement() {
  const loadElement = createMessageElement("Loading...");
  loadElement.classList.add("loading");
  return loadElement;
}

function createErrorElement(retryFn) {
  const message = "Can't tell. Seems there's an issue getting weather info.";
  const errorElement = document.createElement("div");
  const messageElement = createMessageElement(message);
  const retryElement = document.createElement("button");
  retryElement.classList.add("retry");
  retryElement.textContent = "retry";
  retryElement.addEventListener("click", retryFn);
  errorElement.appendChild(messageElement);
  errorElement.appendChild(retryElement);
  return errorElement;
}

class WeatherAnswer {
  constructor(container) {
    this.container = container;
    this.element = null;
  }

  async load() {
    const loadElement = createLoadElement(this.message);
    this.display(loadElement);

    let resultElement = null;
    await Promise.all([
      getMontanaTemp()
        .then(temp => {
          const message = getWeatherText(temp);
          resultElement = createMessageElement(message);
        })
        .catch(e => {
          console.error(e.message);
          resultElement = createErrorElement(() => this.load());
        }),
      new Promise(resolve => setTimeout(resolve, 800))
    ]);
    this.display(resultElement);
  }

  display(newElement) {
    if (!this.element) {
      this.container.appendChild(newElement);
    } else {
      this.container.replaceChild(newElement, this.element);
    }
    this.element = newElement;
  }
}

export default WeatherAnswer;
