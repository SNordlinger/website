import "core-js/stable";
import "regenerator-runtime/runtime";
import prism from "prismjs";
import hellos from "./hellos";
import ElementAnimation from "./ElementAnimation";
import WeatherAnswer from "./WeatherAnswer";

function runAnimations(animations) {
  animations.forEach(a => a.displayNextFrame());

  if (animations.some(a => !a.isDone())) {
    setTimeout(() => runAnimations(animations));
  }
}

function startAnimation(element, oldText, newText, codeHtml) {
  const padding =
    oldText.length > newText.length ? oldText.length - newText.length : 0;

  const codeHtmlElements = codeHtml.childNodes;
  const animations = Array.prototype.map.call(
    codeHtmlElements,
    (span, index) => {
      if (index == codeHtmlElements.length - 1) {
        return new ElementAnimation(span, padding);
      }

      return new ElementAnimation(span, 0);
    }
  );

  const container = document.createElement("div");
  container.id = "hello-code";
  animations.forEach(a => {
    container.appendChild(a.getTag());
  });
  element.parentElement.replaceChild(container, element);

  runAnimations(animations);
}

function cycle(coloredHellos, currentIndex) {
  const target = document.getElementById("hello-code");

  let newIndex = currentIndex;
  while (newIndex === currentIndex) {
    newIndex = Math.floor(Math.random() * hellos.length);
  }

  const oldText = hellos[currentIndex].hello;
  const newText = hellos[newIndex].hello;
  const newHtml = coloredHellos[newIndex].cloneNode(true);

  startAnimation(target, oldText, newText, newHtml);

  setTimeout(() => cycle(coloredHellos, newIndex), 10000);
}

function mobileResize() {
  const fontSize = getComputedStyle(
    document.documentElement,
    null
  ).getPropertyValue("font-size");
  const fontPixelHeight = parseFloat(fontSize, 10);
  const expectedPixelHeight = window.innerHeight - fontPixelHeight * 4.5;

  const splashScreen = document.querySelector(".splash-screen");
  const screenHeight = getComputedStyle(splashScreen, null).getPropertyValue(
    "height"
  );
  const screenPixelHeight = parseFloat(screenHeight, 10);

  if (abs(screenPixelHeight - expectedPixelHeight) > 10) {
    const newHeightPropery = `${window.innerHeight}px`;
    document.documentElement.style.addProperty(
      "--screen-height",
      newHeightPropery
    );
  }
}

function main() {
  const coloredHellos = hellos.map(hello => {
    const newGrammar = hello.grammar;
    const newLang = hello.lang;
    const newText = hello.hello;

    const helloHTMLText = prism.highlight(newText, newGrammar, newLang);

    return document.createRange().createContextualFragment(helloHTMLText);
  });

  setTimeout(() => cycle(coloredHellos, 0), 1000);
}

document.addEventListener("DOMContentLoaded", main);
