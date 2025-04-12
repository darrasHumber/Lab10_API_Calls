// API URL
const API_URL = "https://jsonplaceholder.typicode.com/posts";

// DOM Elements
const fetchBtn = document.getElementById("fetchBtn");
const xhrBtn = document.getElementById("xhrBtn");
const fetchAllBtn = document.getElementById("fetchAllBtn");
const postBtn = document.getElementById("postBtn");
const putBtn = document.getElementById("putBtn");
const deleteBtn = document.getElementById("deleteBtn");
const dataDisplay = document.getElementById("dataDisplay");
const responseResults = document.getElementById("responseResults");
const dataForm = document.getElementById("dataForm");

// Event Listeners
fetchBtn.addEventListener("click", fetchDataWithFetch);
xhrBtn.addEventListener("click", fetchDataWithXHR);
fetchAllBtn.addEventListener("click", fetchAllPosts);
postBtn.addEventListener("click", (e) => {
  e.preventDefault();
  postData();
});
putBtn.addEventListener("click", (e) => {
  e.preventDefault();
  putData();
});
deleteBtn.addEventListener("click", (e) => {
  e.preventDefault();
  deletePost();
});

// Task 1: API Interaction Using GET Requests
function fetchDataWithFetch() {
  showLoading(dataDisplay, "Loading post #1 with fetch()...");

  fetch(`${API_URL}/1`)
    .then(handleResponse)
    .then((data) => {
      displayData([data], "Single post #1 fetched with fetch()");
    })
    .catch((error) => {
      showError(dataDisplay, "Fetch Error", error);
    });
}

// Task 2: API Interaction Using XMLHttpRequest
function fetchDataWithXHR() {
  showLoading(dataDisplay, "Loading post #2 with XHR...");

  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${API_URL}/2`, true);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);
      displayData([data], "Single post #2 fetched with XHR");
    } else {
      showError(dataDisplay, "XHR Error", {
        message: `HTTP ${xhr.status}: ${xhr.statusText}`,
      });
    }
  };

  xhr.onerror = function () {
    showError(dataDisplay, "Network Error", {
      message: "Failed to make XHR request",
    });
  };

  xhr.send();
}

// Part 3: Challange Fetch all posts ( We show only 5 posts in the app )
function fetchAllPosts() {
  showLoading(dataDisplay, "Loading first 5 posts...");

  fetch(API_URL)
    .then(handleResponse)
    .then((data) => {
      if (Array.isArray(data)) {
        displayData(data.slice(0, 5), "First 5 posts fetched");
      } else {
        displayData([data], "Single post fetched");
      }
    })
    .catch((error) => {
      showError(dataDisplay, "Fetch All Error", error);
    });
}

// Task 3: Send Data Using POST
function postData() {
  const formData = getFormData();

  // Validate input
  if (!formData.title || !formData.body) {
    showError(responseResults, "Validation Error", {
      message: "Title and body are required fields",
    });
    return;
  }

  showLoading(responseResults, "Sending POST request...");

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then(handleResponse)
    .then((data) => {
      showSuccess(
        responseResults,
        "POST Successful (201 Created)",
        `
            <div class="single-item">
                <strong>${data.title || "No title"}</strong>
                <p>${data.body || "No content"}</p>
                <small>ID: ${data.id}, User ID: ${data.userId}</small>
            </div>
            <h4>Full Response:</h4>
            <pre>${JSON.stringify(data, null, 2)}</pre>
        `
      );
    })
    .catch((error) => {
      showError(responseResults, "POST Error", error);
    });
}

// Task 4: Update Data Using PUT
function putData() {
  const formData = getFormData();
  const postId = document.getElementById("postId").value;

  if (!postId) {
    showError(responseResults, "Validation Error", {
      message: "Post ID is required for PUT request",
    });
    return;
  }

  if (!formData.title || !formData.body) {
    showError(responseResults, "Validation Error", {
      message: "Title and body are required fields",
    });
    return;
  }

  showLoading(responseResults, `Sending PUT request for post #${postId}...`);

  const xhr = new XMLHttpRequest();
  xhr.open("PUT", `${API_URL}/${postId}`, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);
      showSuccess(
        responseResults,
        "PUT Successful (200 OK)",
        `
              <div class="single-item">
                  <strong>${data.title || "No title"}</strong>
                  <p>${data.body || "No content"}</p>
                  <small>ID: ${data.id}, User ID: ${data.userId}</small>
              </div>
              <h4>Complete JSON Response:</h4>
              <pre>${JSON.stringify(data, null, 2)}</pre>
          `
      );
    } else {
      showError(responseResults, "PUT Error", {
        message: `HTTP ${xhr.status}: ${xhr.statusText}`,
      });
    }
  };

  xhr.onerror = function () {
    showError(responseResults, "Network Error", {
      message: "Failed to make XHR request",
    });
  };

  xhr.send(JSON.stringify(formData));
}

//Part 3: Challange, DELETE post
function deletePost() {
  const postId = document.getElementById("postId").value;

  // Validate input
  if (!postId) {
    showError(responseResults, "Validation Error", {
      message: "Post ID is required for DELETE request",
    });
    return;
  }

  showLoading(responseResults, `Sending DELETE request for post #${postId}...`);

  fetch(`${API_URL}/${postId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response;
    })
    .then(() => {
      showSuccess(
        responseResults,
        "DELETE Successful (200 OK)",
        `
          <p>Post with ID ${postId} has been deleted successfully.</p>
          <p><small>Note: JSONPlaceholder doesn't actually delete the post, but simulates the response.</small></p>
      `
      );
    })
    .catch((error) => {
      showError(responseResults, "DELETE Error", error);
    });
}
// Helper function to get form data
function getFormData() {
  return {
    title: document.getElementById("title").value,
    body: document.getElementById("body").value,
    userId: 1,
  };
}

// Helper function to handle API response
function handleResponse(response) {
  if (!response.ok) {
    return response
      .json()
      .then((err) => {
        throw new Error(
          err.message || `HTTP ${response.status}: ${response.statusText}`
        );
      })
      .catch(() => {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      });
  }
  return response.json();
}

// Helper function to display data
function displayData(data, title = "Fetched Data") {
  let html = `<h3>${title}</h3>`;

  if (Array.isArray(data)) {
    if (data.length === 0) {
      html += "<p>No data found</p>";
    } else {
      html += `<p>Showing ${data.length} items</p><ul>`;
      data.forEach((item) => {
        html += `<li>
                    <strong>${item.title || "No title"}</strong>
                    <p>${item.body || "No content"}</p>
                    <small>ID: ${item.id}, User ID: ${item.userId}</small>
                </li>`;
      });
      html += "</ul>";
    }
  } else {
    html += `<div class="single-item">
            <strong>${data.title || "No title"}</strong>
            <p>${data.body || "No content"}</p>
            <small>ID: ${data.id}, User ID: ${data.userId}</small>
        </div>`;
  }

  dataDisplay.innerHTML = html;
}

// Helper function to show loading state
function showLoading(element, message) {
  element.innerHTML = `
        <div class="placeholder">
            <i class="fas fa-spinner fa-spin"></i>
            <h3>${message}</h3>
        </div>
    `;
}

// Helper function to show error
function showError(element, title, error) {
  element.innerHTML = `
        <div class="error-box">
            <h3><i class="fas fa-exclamation-circle"></i> ${title}</h3>
            <p>${error.message}</p>
            ${error.stack ? `<pre>${error.stack}</pre>` : ""}
        </div>
    `;
}

// Helper function to show success
function showSuccess(element, title, content) {
  element.innerHTML = `
        <div class="success-box">
            <h3><i class="fas fa-check-circle"></i> ${title}</h3>
            ${content}
        </div>
    `;
}
