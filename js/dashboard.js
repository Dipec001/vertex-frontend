// // JavaScript file for handling dashboard logic (invite employees, view employees)

// const sidebar = document.querySelector('.sidebar');
// const toggleBtn = document.getElementById('toggle-btn');

// toggleBtn.addEventListener('click', () => {
//   sidebar.classList.toggle('active');
// });

const apiUrl = 'http://127.0.0.1:8000/api/';

// Custom fetchWithAuth function
async function fetchWithAuth(url, options = {}) {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        throw new Error('No access token found');
    }

    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers, // Merge any additional headers passed to the function
    };

    const response = await fetch(url, { 
        ...options, 
        headers 
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    return response.json();
}


async function getUserProfile() {
    try {
        const userProfile = await fetchWithAuth(`${apiUrl}profile/`);
        console.log('User Profile:', userProfile);
        return userProfile;
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

// Example function to display the user's name (or email) in the UI
async function displayUserName() {
    const userProfile = await getUserProfile();
    console.log(userProfile);
    if (userProfile) {
        const name = userProfile.name || userProfile.email;  // Use name or email if name is not available
        document.getElementById('user-name').textContent = `Hello, ${name}`;  // Assuming you have an element with id="user-name"
    }
}

// Call this function when the dashboard page loads
displayUserName();
