// JavaScript file for login, sign up, and authentication
'use strict';

const apiUrl = 'http://127.0.0.1:8000';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToLogin = document.getElementById('switch-to-login');
  
    // Switch to signup form
    switchToSignup.addEventListener('click', () => {
      loginForm.classList.remove('active');
      signupForm.classList.add('active');
      signupForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
    });
  
    // Switch to login form
    switchToLogin.addEventListener('click', () => {
      signupForm.classList.remove('active');
      loginForm.classList.add('active');
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
    });
});


// Select the sign-up form
const signupForm = document.getElementById('signup-form');

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
      const response = await fetch(`${apiUrl}/api/signup-company-owner/`, {
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
        window.location.href = 'index.html';
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
  