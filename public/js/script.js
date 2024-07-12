"use strict";

document.addEventListener('DOMContentLoaded', function () {
  function updateTime() {
    var currentTime = new Date().toLocaleTimeString();
    var headerElement = document.querySelector('.text-white');
    headerElement.innerHTML = currentTime + ' ' + headerElement.innerHTML.split(' ').slice(1).join(' ');
  }
  updateTime();
  setInterval(updateTime, 1000);
});