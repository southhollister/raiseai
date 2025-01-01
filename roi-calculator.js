<!-- Main calculator container with data-animate attribute for targeting by IntersectionObserver -->
<div class="roi-calculator-wrapper" data-animate="true">
    <!-- Form section for investment input -->
    <div class="roi-calculator-form">
        <form id="roiForm">
            <input type="number" id="investment" class="roi-calculator-input" placeholder="Investment Amount" required min="0" step="0.01">
            <button type="submit" class="roi-calculator-button">Calculate</button>
        </form>
    </div>
    <!-- Chart section containing legend and donut chart -->
    <div class="roi-chart-section">
        <div class="roi-chart-legend">
            <div class="roi-legend-item">
                <div class="roi-legend-color" style="background-color: var(--roi-calc-principal)"></div>
                <span>Principal</span>
            </div>
            <div class="roi-legend-item">
                <div class="roi-legend-color" style="background-color: var(--roi-calc-profit)"></div>
                <span>Profit</span>
            </div>
        </div>
        <div class="roi-chart-container" id="chart"></div>
    </div>
    <div class="roi-results-text" id="results"></div>
</div>
