// Typewriter effect for the hero section
var i = 0;
var txt = 'Welcome to ClassCode';
var speed = 60;

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("hero").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}

window.onload = typeWriter;