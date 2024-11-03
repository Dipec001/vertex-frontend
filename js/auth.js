// JavaScript file for login, sign up, and authentication
'use strict';

const apiUrl = 'http://127.0.0.1:8000/api/';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToLogin = document.getElementById('switch-to-login');
  
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
});


// Select the sign-up form
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');

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
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    console.log(tokens.accessToken);
}
  
  

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    console.log(email, password);
  
    try {
      const tokens = await loginUser(email, password);
      storeTokens(tokens);
      alert('Login successful!');
  
      // Redirect or update UI
      window.location.href = '/pages/dashboard.html'; // Example redirect after login
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  });


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
    const accessToken = localStorage.getItem('accessToken');
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

  