const API_URL = "https://jsonplaceholder.typicode.com/posts/";

// DOM Elements
const fetchBtn = document.getElementById("fetchBtn");
const xhrBtn = document.getElementById("xhrBtn");
const dataDisplay = document.getElementById("dataDisplay");

// Event Listeners
fetchBtn.addEventListener("click", fetchDataWithFetch);
xhrBtn.addEventListener("click", fetchDataWithXHR);

//Task 1: Task 1: API Interaction Using GET Requests
function fetchDataWithFetch() {
  dataDisplay.innerHTML = "<p>Loading data with fetch()...</p>";

  fetch(`${API_URL}1`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      displayData(data, "using GET request");
    })
    .catch((error) => {
      dataDisplay.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    });
}
// Task 2: API Interaction Using XMLHttpRequest
function fetchDataWithXHR() {
  dataDisplay.innerHTML = "<p>Loading data with XHR...</p>";
  let html = "<h3>Fetched Data:</h3>";

  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${API_URL}2`, true);

  xhr.onload = function () {
    console.log(xhr.status);
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);
      displayData(data, "Using XMLHttpRequest");
    } else {
      dataDisplay.innerHTML = `<p class="error">Error: ${xhr.statusText}</p>`;
    }
  };

  xhr.onerror = function () {
    dataDisplay.innerHTML = '<p class="error">Request failed</p>';
  };

  xhr.send();
}

function displayData(data, msg = "") {
  let html = `<h3>Fetched Data ${msg}:</h3>`;
  html += `<div class="single-item">
  <strong>${data.title}</strong>
  <p>${data.body}</p>
  <small>ID: ${data.id}, User ID: ${data.userId}</small>
</div>`;
  dataDisplay.innerHTML = html;
}
