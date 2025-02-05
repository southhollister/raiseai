// Class to handle the creation and functionality of an Income Chart
class IncomeChart {
    /**
     * Constructor to initialize the IncomeChart
     * @param {string} elementId - The ID of the container element for the chart
     * @param {Array} data - Array of objects containing year and income
     */
    constructor(elementId, data, active, buttonElement) {
        this.container = document.getElementById(elementId); // Get the chart container element by its ID
        this.data = data; // Store the data for the chart
        this.tooltip = this.createTooltip(); // Create a tooltip for the chart
        this.active = active || 'false';
        this.buttonElement = document.querySelector(buttonElement);
        this.init(); // Initialize the chart setup
    }

    /**
     * Creates a tooltip element for showing income details on hover
     * @returns {HTMLElement} - The tooltip element
     */
    createTooltip() {
        const tooltip = document.createElement('div'); // Create a <div> element
        tooltip.className = 'income-chart-tooltip'; // Assign a class for styling
        document.body.appendChild(tooltip); // Add the tooltip to the body for global positioning
        return tooltip;
    }

    /**
     * Formats a number as currency (e.g., $100,000)
     * @param {number} value - The income value to format
     * @returns {string} - Formatted currency string
     */
    formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value); // Use Intl API for consistent currency formatting
    }

    hide() {
        this.container.parentElement.setAttribute('data-active', "false");
        this.buttonElement.setAttribute('data-active', 'false'); 
    }
    
    show() {
        this.container.parentElement.setAttribute('data-active', "true");
        this.buttonElement.setAttribute('data-active', 'true'); 
    }

    /**
     * Initializes the chart by creating bars, axes, and adding animations
     */
    init() {
        // Create a container for the bars
        const barContainer = document.createElement('div');
        barContainer.className = 'income-chart-bar-container'; // Add a class for styling

        // Create a container for the Y-axis labels
        const yAxis = document.createElement('div');
        yAxis.className = 'income-chart-y-axis'; // Add a class for styling

        // Calculate the maximum income to scale the chart
        const maxIncome = Math.max(...this.data.map(d => d.income)); // Get the highest income value
        const yAxisSteps = this.data.length ; // Number of steps on the Y-axis
        const stepSize = maxIncome / yAxisSteps; // Income range for each step

        const gridLineContainer = document.createElement('div');
        gridLineContainer.className = 'income-grid-line-container';
        this.container.appendChild(gridLineContainer);

        console.log(`Setting up chart ${this.container}`);
        // Create Y-axis labels and grid lines
        for (let i = 0; i <= yAxisSteps; i++) {
            const value = i * stepSize; // Calculate the value for each step
            const yLabel = document.createElement('div'); // Create a label for the Y-axis
            yLabel.className = 'income-chart-y-label'; // Add a class for styling
            yLabel.textContent = this.formatCurrency(value); // Format the value as currency
            yAxis.appendChild(yLabel); // Add the label to the Y-axis container

            // Add grid lines for better visualization
            const gridLine = document.createElement('div');
            gridLine.className = 'income-chart-grid-line'; // Add a class for styling
            gridLine.style.bottom = `${(i / yAxisSteps) * 100}%`; // Position the grid line
            gridLineContainer.appendChild(gridLine); // Add the grid line to the chart container
        }

        // Create bars for each data point (year and income)
        this.data.forEach(item => {
            const barGroup = document.createElement('div'); // Group for the bar and its label
            barGroup.className = 'income-chart-bar-group'; // Add a class for styling

            const bar = document.createElement('div'); // Create the bar element
            bar.className = 'income-chart-bar'; // Add a class for styling
            const height = (item.income / maxIncome) * 100; // Calculate the bar height as a percentage
            bar.style.height = `${height}%`; // Set the bar's height

            // Add a label below the bar for the year
            const label = document.createElement('div');
            label.className = 'income-chart-bar-label'; // Add a class for styling
            label.textContent = item.year; // Set the label text to the year

            // Add event listeners for tooltips on hover
            bar.addEventListener('mousemove', (e) => {
                this.tooltip.style.opacity = '1'; // Show the tooltip
                this.tooltip.textContent = this.formatCurrency(item.income); // Set the tooltip text
                this.tooltip.style.left = `${e.pageX + 10}px`; // Position the tooltip near the cursor
                this.tooltip.style.top = `${e.pageY - 25}px`; // Adjust the vertical position
            });

            bar.addEventListener('mouseleave', () => {
                this.tooltip.style.opacity = '0'; // Hide the tooltip when the mouse leaves
            });

            // Append the bar and label to the bar group
            barGroup.appendChild(bar);
            barGroup.appendChild(label);
            barContainer.appendChild(barGroup); // Add the bar group to the bar container
        });

        // Append the Y-axis and bar container to the chart container
        this.container.appendChild(yAxis);
        this.container.appendChild(barContainer);

        this.container.parentElement.setAttribute('data-active', this.active);

        this.buttonElement.setAttribute('data-active', this.active);
        this.buttonElement.classList.add("income-chart-button");
        this.buttonElement.addEventListener('click', (e) => {
            e.preventDefault();
            // Ensure the event targets the correct button
            const buttonId = e.target.closest('button')?.id; // Use closest to ensure we're getting the button element
            if (!buttonId) return; // Exit if no valid button ID is found

            // console.log(buttonId);
            
            // Loop through all charts in window.charts
            window.charts.forEach(chart => {
                if (buttonId === chart.buttonElement.id) {
                    // console.log("Matched", chart.buttonElement.id);
                    chart.show(); // Show the chart matching the clicked button
                } else {
                    console.log("No match", chart.buttonElement.id);
                    chart.hide(); // Hide all other charts
                }
            });
        });

        // Set up animations using IntersectionObserver
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate bars when they become visible
                    const bars = entry.target.getElementsByClassName('income-chart-bar');
                    Array.from(bars).forEach((bar, i) => {
                        setTimeout(() => {
                            bar.classList.add('visible'); // Add the class to trigger animation
                        }, i * 100); // Stagger animations for each bar
                    });
                    observer.unobserve(entry.target); // Stop observing once animation is triggered
                }
            });
        }, { threshold: 0.2 }); // Trigger when 20% of the element is visible

        observer.observe(this.container); // Start observing the chart container
    }
}

// Example dataset for the first chart
const data1 = [
    { year: 2020, income: 150000 },
    { year: 2021, income: 180000 },
    { year: 2022, income: 220000 },
    { year: 2023, income: 280000 },
    { year: 2024, income: 320000 },
];

// Example dataset for the second chart
const data2 = [
    { year: 2020, income: 250000 },
    { year: 2021, income: 280000 },
    { year: 2022, income: 320000 },
    { year: 2023, income: 380000 },
    { year: 2024, income: 420000 },
];

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

async function graphInit() {
    // Determine the base URL dynamically
    const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
    const baseURL = isLocal 
        ? 'http://127.0.0.1:5500/raiseai/bar-graphs' // Local Live Server base URL
        : 'https://raiseai.netlify.app/bar-graphs'; // Production base URL

    try {
        
        // Load CSS
        await loadCSS(`${baseURL}/bar-graph-style.css`);
        console.log('CSS loaded');

    } catch (error) {
        console.error(error);
    }
}

graphInit();

// Initialize charts with datasets
// new IncomeChart('incomeChart', data1); // Create the first chart
// new IncomeChart('incomeChart2', data2); // Create the first chart