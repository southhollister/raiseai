(() => {const UsesCalculator = window.DealPageSettings.charts.acquisitionCosts;

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// Removing event listener this since this doesn't get added until the document state is complete
// window.addEventListener('load', function () {
const animatedElement = document.querySelector('#uses-calculator-wrapper[data-animate="true"]');
if (animatedElement) {
    observer.observe(animatedElement);
}

console.log("documented loaded");
        
calculateUses();


function calculateUses() {
    const acquisitionElement = document.getElementById('acquisition');
    const renoElement = document.getElementById('reno');
    const operatingElement = document.getElementById('operating');
    const totalUsesElement = document.getElementById('total-uses');
    const totalUses = UsesCalculator.acquistion + UsesCalculator.reno + UsesCalculator.operating;

    acquisitionElement.querySelectorAll('p')[1].innerHTML = `$${UsesCalculator.acquistion.toLocaleString()}`;
    renoElement.querySelectorAll('p')[1].innerHTML = `$${UsesCalculator.reno.toLocaleString()}`;
    operatingElement.querySelectorAll('p')[1].innerHTML = `$${UsesCalculator.operating.toLocaleString()}`;
    totalUsesElement.querySelectorAll('p')[1].innerHTML = `$${totalUses.toLocaleString()}`;

    createDonutChart([
        { label: 'Acquisition Cost', value: UsesCalculator.acquistion, color: UsesCalculator.colors.acquisition },
        { label: 'Construction / Renovation', value: UsesCalculator.reno, color: UsesCalculator.colors.reno },
        { label: 'Operating Expensees', value: UsesCalculator.operating, color: UsesCalculator.colors.operating }
    ]);
}

function createDonutChart(data) {
    d3.select('.uses-chart-container#chart').html('');
    const width = 300;
    const height = 300;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select('.uses-chart-container#chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

    const arc = d3.arc().innerRadius(radius * 0.6).outerRadius(radius);
    const pie = d3.pie().value(d => d.value).sort(null);

    const path = svg.selectAll('path')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => d.data.color)
        .attr('stroke', 'white')
        .style('stroke-width', '2px')
        .style('opacity', 0.7)
        .on('mouseover', function (event, d) {
            d3.select(this).style('opacity', 1);
        })
        .on('mouseout', function () {
            d3.select(this).style('opacity', 0.7);
        });

    path.transition().duration(1000).attrTween('d', function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
            return arc(interpolate(t));
        };
    });
}
})()