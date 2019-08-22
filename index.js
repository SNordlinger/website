let helloIndex = 0;

function getRandomLetter() {
  charCode = Math.floor(Math.random() * (126 - 33)) + 33;
  return String.fromCharCode(charCode);
}

function runAnimation(element, frame, data) {
  const newChars = data.map(({ endChar, iterations }) =>
    iterations > 0 ? getRandomLetter() : endChar
  );

  element.textContent = newChars.join("");

  if (frame > 1) {
    const newData = data.map(({ endChar, iterations }) => ({
      endChar,
      iterations: iterations - 1
    }));

    setTimeout(() => runAnimation(element, frame - 1, newData));
  }
}

function startAnimation(element, endString) {
  const startString = element.textContent;
  const randomizeLength =
    startString.length > endString.length
      ? startString.length
      : endString.length;

  let data = [];
  let maxIterations = 0;

  for (i = 0; i < randomizeLength; i++) {
    let endChar = "";
    if (i < endString.length) {
      endChar = endString.charAt(i);
    }

    const iterations = Math.floor(Math.random() * (200 - 10)) + 10;
    if (iterations > maxIterations) {
      maxIterations = iterations;
    }

    data.push({
      endChar,
      iterations
    });
  }

  runAnimation(element, maxIterations + 1, data);
}

function cycle() {
  const hellos = [
    "print('Hello!')",
    "console.log('Hello!');",
    'System.out.println("Hello!");',
    'println!("Hello!");',
    'puts("Hello!");',
    '(println "Hello!")',
    'fmt.println("Hello!")',
    "SELECT 'Hello!';",
    'echo "Hello!"',
    'Write-Host "Hello!"'
  ];

  const target = document.getElementById("hello-code");

  let newHello = helloIndex;
  while (newHello === helloIndex) {
    newHello = Math.floor(Math.random() * hellos.length);
  }

  startAnimation(target, hellos[newHello]);
  helloIndex = newHello;
}

function main() {
  setInterval(cycle, 10000);
}

document.addEventListener("DOMContentLoaded", main);
