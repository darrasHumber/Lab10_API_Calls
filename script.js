const API_URL = "https://jsonplaceholder.typicode.com/posts/";

// DOM Elements
const fetchBtn = document.getElementById("fetchBtn");

// Event Listeners
fetchBtn.addEventListener("click", fetchDataWithFetch);

//Task 1: Task 1: API Interaction Using GET Requests
function fetchDataWithFetch() {
  dataDisplay.innerHTML = "<p>Loading data with fetch()...</p>";
  let html = "<h3>Fetched Data:</h3>";

  fetch(`${API_URL}1`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      html += `<div class="single-item">
      <strong>${data.title}</strong>
      <p>${data.body}</p>
      <small>ID: ${data.id}, User ID: ${data.userId}</small>
  </div>`;
      dataDisplay.innerHTML = html;
    })
    .catch((error) => {
      dataDisplay.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    });
}
