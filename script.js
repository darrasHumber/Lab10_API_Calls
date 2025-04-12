const API_URL = "https://jsonplaceholder.typicode.com/posts/";

// DOM Elements
const fetchBtn = document.getElementById("fetchBtn");
const xhrBtn = document.getElementById("xhrBtn");
const dataDisplay = document.getElementById("dataDisplay");
const postBtn = document.getElementById("postBtn");
const responseResults = document.getElementById("responseResults");
const dataForm = document.getElementById("dataForm");

// Event Listeners
fetchBtn.addEventListener("click", fetchDataWithFetch);
xhrBtn.addEventListener("click", fetchDataWithXHR);
postBtn.addEventListener("click", postData);

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

// Task 3: Send Data Using POST
function postData() {
  const formData = getFormData();
  responseResults.innerHTML = "<p>Sending POST request...</p>";

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      responseResults.innerHTML = `
          <h3>POST Response (Status: 201 Created)</h3>
          <div class="single-item">
              <strong>${data.title || "No title"}</strong>
              <p>${data.body || "No content"}</p>
              <small>ID: ${data.id}, User ID: ${data.userId}</small>
          </div>
          <h4>Full Response:</h4>
          <pre>${JSON.stringify(data, null, 2)}</pre>
      `;
    })
    .catch((error) => {
      responseResults.innerHTML = `<p class="error">POST Error: ${error.message}</p>`;
    });
}

function getFormData() {
  return {
    title: document.getElementById("title").value,
    body: document.getElementById("body").value,
    userId: 1, // Default user ID
  };
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
