// Check if user is logged in
window.onload = function() {
    const loginButton = document.getElementById('login-button');
    if (localStorage.getItem('loggedIn') === 'true') {
        // Change "Log In" to "Dashboard" if logged in
        loginButton.textContent = 'Dashboard';
        loginButton.href = 'Dashboard.html';
    }
};


function loadRandomAds() {
    const adContainer = document.getElementById('ad-container');

    const adImages = [
        './Ads/Ad1.jpg', './Ads/Ad2.jpg', './Ads/Ad3.jpg', './Ads/Ad4.jpg',
        './Ads/Ad5.jpg', './Ads/Ad6.jpg', './Ads/Ad7.jpg', './Ads/Ad8.jpg',
        './Ads/Ad9.jpg','./Ads/Ad10.jpg', './Ads/Ad11.jpg','./Ads/Ad12.jpg',
        './Ads/Ad13.jpg','./Ads/Ad14.jpg','./Ads/Ad15.jpg','./Ads/Ad16.jpg',
        './Ads/Ad17.jpg','./Ads/Ad18.jpg','./Ads/Ad19.jpg','./Ads/Ad20.jpg',
        './Ads/Ad21.jpg','./Ads/Ad22.jpg','./Ads/Ad23.jpg','./Ads/Ad24.jpg',
        './Ads/Ad25.jpg','./Ads/Ad26.jpg','./Ads/Ad27.jpg','./Ads/Ad28.jpg',
        './Ads/Ad29.jpg','./Ads/Ad30.jpg','./Ads/Ad31.jpg','./Ads/Ad32.jpg',
        './Ads/Ad33.jpg','./Ads/Ad34.jpg','./Ads/Ad35.jpg','./Ads/Ad36.jpg',
        './Ads/Ad37.jpg','./Ads/Ad38.jpg','./Ads/Ad39.jpg','./Ads/Ad40.jpg',
        './Ads/Ad41.jpg','./Ads/Ad42.jpg','./Ads/Ad43.jpg','./Ads/Ad44.jpg',
        './Ads/Ad45.jpg','./Ads/Ad46.jpg','./Ads/Ad47.jpg','./Ads/Ad48.jpg',
        './Ads/Ad49.jpg','./Ads/Ad50.jpg','./Ads/Ad51.jpg','./Ads/Ad52.jpg',
        './Ads/Ad56.jpg','./Ads/Ad57.jpg',

    ];

    // Shuffle the images to pick two random ones
    const shuffledAds = adImages.sort(() => Math.random() - 0.5);
    const selectedAds = shuffledAds.slice(0, 2);

    selectedAds.forEach(ad => {
        const img = document.createElement('img');
        img.src = ad;
        img.alt = 'Ad Image:'+ ad;
        img.className = 'ad-image';
        console.log('Loading image:', img.src);
        img.onerror = () => {
            console.error('Failed to load image:', img.src);
        };

        adContainer.appendChild(img);
    });
}
window.onload = loadRandomAds;

//log in button switch
// Get the buttons
const loginButton = document.getElementById('login-Button');
const mysiteButton = document.getElementById('mysite-Button');

// Check if 'loggedIn' is true in local storage
const loggedIn = localStorage.getItem('loggedIn') === 'true';

// Show/hide buttons based on login status
if (loggedIn) {
    loginButton.style.display = 'none';
    mysiteButton.style.display = 'block';
} else {
    loginButton.style.display = 'block';
    mysiteButton.style.display = 'none';
}
