// // JavaScript file for handling dashboard logic (invite employees, view employees)
'use strict';

document.addEventListener('DOMContentLoaded', function () {
    const icons = document.querySelectorAll('.icon');
    const contentCards = document.querySelectorAll('.dashboard-content-card');
    const dashboardContent = document.querySelector('.dashboard-content');

    // Hide all content cards and make them visible only after processing
    dashboardContent.style.visibility = "hidden";

    // Check if there's a saved active tab in localStorage
    const savedContentId = localStorage.getItem('activeTab');
    let activeTab = savedContentId ? document.querySelector(`[data-content="${savedContentId}"]`) : icons[0];

    // Set the active class on the saved or default tab
    activeTab.classList.add("active");

    // Hide all content cards initially
    contentCards.forEach(function (card) {
        card.style.display = "none";
    });

    // Make content visible after processing
    dashboardContent.style.visibility = "visible";

    // Show the content card associated with the active tab
    const contentId = activeTab.dataset.content;
    document.getElementById(contentId).style.display = "block";

    // Add click event listeners to all icons
    icons.forEach(function (icon) {
        icon.addEventListener('click', function () {
            // Remove the active class from all icons
            icons.forEach(function (i) {
                i.classList.remove("active");
            });

            // Add the active class to the clicked icon
            this.classList.add("active");

            // Hide all content cards
            contentCards.forEach(function (card) {
                card.style.display = "none";
            });

            // Show the content card associated with the clicked icon
            const contentId = this.dataset.content;
            document.getElementById(contentId).style.display = "block";

            // Save the active tab to localStorage
            localStorage.setItem('activeTab', contentId);
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const accountSettingsOption = document.querySelector('#account-settings'); // Target specific "Account Settings" option
    const settingsIcon = document.querySelector('#settings'); // Settings tab icon in the sidebar

    if (accountSettingsOption && settingsIcon) {
        accountSettingsOption.addEventListener('click', function () {
            // Simulate a click on the settings tab
            settingsIcon.click();

            // Optional: Save settings tab as active in localStorage for persistence
            const contentId = settingsIcon.dataset.content;
            localStorage.setItem('activeTab', contentId);
        });
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const profileIcon = document.getElementById('profile-icon');
    const profileBox = document.querySelector('.profile-box');

    // Toggle visibility of the profile box when profile icon is clicked
    profileIcon.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent the click event from propagating to the document
        profileBox.style.display = profileBox.style.display === 'block' ? 'none' : 'block';
    });

    // Close the profile box if clicking outside
    document.addEventListener('click', function (event) {
        if (!profileBox.contains(event.target) && event.target !== profileIcon) {
            profileBox.style.display = 'none';
        }
    });
});
