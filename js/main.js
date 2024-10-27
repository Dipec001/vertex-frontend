'use strict';

const nav = document.querySelector('.nav');
console.log(nav);


window.addEventListener('load', function () {
    console.log('hello');
    nav.classList.add('slide-in'); // Add the 'slide-in' class after the page loads
});
  
document.addEventListener('DOMContentLoaded', function () {
  const glassBox = document.querySelector('.glass-box');
  const heroSection = document.querySelector('.hero');

  // Fade in the glass-box and reveal text on load
  setTimeout(() => {
    glassBox.classList.add('fade-in');  // Smoothly appear
    setTimeout(() => {
      glassBox.classList.add('reveal');  // Reveal text
    }, 500); // Delay text reveal
  }, 300); // Slight delay for the glass-box

  // Scroll behavior with debounce
  let isScrolling = false;

  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        const scrollPos = window.scrollY;
        const heroHeight = heroSection.offsetHeight;

        if (scrollPos > heroHeight - 100) {
          heroSection.classList.add('scroll-hide');
          heroSection.classList.remove('scroll-show');
        } else {
          heroSection.classList.remove('scroll-hide');
          heroSection.classList.add('scroll-show');
        }

        isScrolling = false;
      });
    }

    isScrolling = true;
  });
});
