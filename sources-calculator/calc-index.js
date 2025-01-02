(() => {
// Determine the base URL dynamically
const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
const baseURL = isLocal
    ? 'http://127.0.0.1:5500/raiseai/sources-calculator' // Local Live Server base URL
    : 'https://raiseai.netlify.app/sources-calculator'; // Production base URL

// Function to dynamically load a CSS file
function loadCSS(url) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to load CSS: ${url}`));
        document.head.appendChild(link);
    });
}

// Function to dynamically load a JavaScript file
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
        document.body.appendChild(script);
    });
}

// Function to load the HTML content
function loadHTML(url, targetElementId) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch HTML: ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            // Inject HTML into the placeholder element
            const targetElement = document.getElementById(targetElementId);
            if (targetElement) {
                targetElement.innerHTML = html;
            } else {
                console.error(`Element with ID '${targetElementId}' not found.`);
            }
        })
        .catch(error => {
            console.error(error);
        });
}


// Function to initialize the calculator
async function initROICalculator() {
    try {
        // Load CSS
        await loadCSS(`${baseURL}/sources-calculator.css`);
        console.log('CSS loaded');

        // Inject HTML into the placeholder
        await loadHTML(`${baseURL}/sources-calculator.html`, 'sources-calculator-wrapper');
        console.log('HTML injected');

        // Load and initialize the main JavaScript
        await loadScript(`${baseURL}/sources-calculator.js`);
        console.log('ROI Calculator initialized');
    } catch (error) {
        console.error(error);
    }
}

// Start the loading process
initROICalculator();
})()