// JavaScript file for login, sign up, and authentication
'use strict';

// const apiUrl = 'http://127.0.0.1:8000/api/';
// Determine if we're in production or development
const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:8000/api/'  // Local API for development
  : 'https://vertexx-85dc684c56f3.herokuapp.com/api/';  // Production API on Heroku

console.log('API URL:', apiUrl);

// Now you can use `apiUrl` for your API calls


document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToLogin = document.getElementById('switch-to-login');
  
    if (switchToSignup && switchToLogin) {
      // Switch to signup form
      switchToSignup.addEventListener('click', () => {
        signupForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
      });
  
      // Switch to login form
      switchToLogin.addEventListener('click', () => {
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
      });
    };
});


// Select the sign-up form
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');


if (signupForm) {
  // Add event listener for form submission
  signupForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Prevent default form submission behavior

      // Get the values from the form inputs
      const email = document.getElementById('signup-email').value;
      const companyName = document.getElementById('signup-company').value;
      const password = document.getElementById('signup-password').value;
      const confirmPassword = document.getElementById('signup-confirm-password').value;
    
      // Simple password validation
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
    
      // Create the data object to send to the API
      const signupData = {
        email: email,
        company_name: companyName,
        password: password,
      };
      console.log(signupData);
    
      try {
        // Send POST request to your API endpoint
        const response = await fetch(`${apiUrl}signup-company-owner/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Send the request as JSON
          },
          body: JSON.stringify(signupData), // Convert the data object to JSON string
        });
    
        const result = await response.json(); // Parse the JSON response from the server
        console.log(result);
    
        if (response.ok) {
          // If registration is successful
          alert('Registration successful! Redirecting to login...');
          // Optionally redirect the user to the login page or another page
          window.location.href = '/pages/dashboard.html';
        } else {
          // If there was an error, handle and display the specific errors
          let errorMessages = '';
          for (const [field, messages] of Object.entries(result.errors)) {
            errorMessages += `${field}: ${messages.join(', ')}\n`;
          }
          alert(`Error: \n${errorMessages}`);
        }
      } catch (error) {
        // If there was a network or server error
        console.error('There was an error registering the user:', error);
        alert('Something went wrong. Please try again.');
      }
    });
}


async function loginUser(username, password) {
    const response = await fetch(`${apiUrl}login/`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        
        body: JSON.stringify({ username, password })
    });
    const result = await response.json(); // Parse the JSON response from the server
    console.log(result);

    if (!response.ok) {
        throw new Error(`${result.errors['detail']}`);
    }
    return result; // This should return the tokens
}
function storeTokens(tokens) {
  // Access the nested `data` field for access and refresh tokens
  localStorage.setItem('accessToken', tokens.data.access);
  localStorage.setItem('refreshToken', tokens.data.refresh);
}
  
  
if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
    
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      console.log(email, password);
    
      try {
        const tokens = await loginUser(email, password);
        console.log(tokens);
        storeTokens(tokens);
        // alert('Login successful!');
    
        // Redirect or update UI
        window.location.href = '/pages/dashboard.html'; // Example redirect after login
      } catch (error) {
        alert('Login failed: ' + error.message);
      }
    });
}

async function refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
  
    const response = await fetch(`${apiUrl}refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });
  
    if (!response.ok) {
      // If refresh token is also invalid, redirect to login
      window.location.href = '/pages/login.html';
      throw new Error('Failed to refresh token');
    }
  
    const tokens = await response.json();
    storeTokens(tokens);
    return tokens.accessToken;
  }
  

async function fetchWithAuth(url, options = {}) {
    let accessToken = localStorage.getItem('accessToken');
    if (!options.headers) {
        options.headers = {};
    }
    options.headers.Authorization = `Bearer ${accessToken}`;

    let response = await fetch(url, options);

    if (response.status === 401) { // Token expired
        const newAccessToken = await refreshToken();
        options.headers.Authorization = `Bearer ${newAccessToken}`;
        response = await fetch(url, options);
    }

    return response;
}

  
// Logout function in JavaScript
function logout() {
  const refreshToken = localStorage.getItem("refreshToken");

  if (refreshToken) {
      fetch(`${apiUrl}logout/`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: refreshToken }),
      })
      .then(response => {
          if (response.ok) {
              // Clear tokens from localStorage
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              alert("Successfully logged out.");
          } else {
              alert("Logout failed.");
          }
      })
      .catch(error => console.error("Error:", error));
  } else {
      alert("No refresh token found.");
  }
}


async function getUserProfile() {
  try {
      const userProfileResponse = await fetchWithAuth(`${apiUrl}profile/`); // Await the fetch request
      const profileData = await userProfileResponse.json(); // Await parsing the JSON
      console.log(profileData);

      return profileData;
  } catch (error) {
      console.error('Error fetching user profile:', error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  console.log('reached here');
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    try {
      const userProfile = await getUserProfile();
      console.log(userProfile);
      const usernameElement = document.querySelector('#user-name');
      const userElement = document.querySelector('#username')
      const emailElement = document.querySelector('#email')
      if (usernameElement) {
        usernameElement.textContent = `Hello ${userProfile.data.username}`;
      }
      if (emailElement) {
        emailElement.textContent = userProfile.data.email;
      }
      if (userElement) {
        userElement.textContent = userProfile.data.company;
      }
    } catch (error) {
      console.error('Error displaying user profile:', error);
    }
  } else {
    console.log("No access token found, not fetching profile.");
    // Optionally, redirect to login page
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const signOutButton = document.getElementById('signout');

  if (signOutButton) {
    signOutButton.addEventListener('click', function() {
      // Clear tokens from localStorage/sessionStorage
      localStorage.removeItem('accessToken'); // or sessionStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      // Optionally clear other session data if needed
      // localStorage.removeItem('user_data');
      
      // Redirect to login or home page
      window.location.href = 'login.html';  // Change to '/' if you want to redirect to the home page
    });
  }
});
