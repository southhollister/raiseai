(() => {const SourceCalculator = {
    debt: 700000,
    equity: 300000,
    colors: {
        principal: '#3498db',
        profit: '#2ecc71'
    }
};

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
const animatedElement = document.querySelector('#sources-calculator-wrapper[data-animate="true"]');
if (animatedElement) {
    observer.observe(animatedElement);
}

console.log("documented loaded");
        
calculateSources();


function calculateSources() {
    const debtElement = document.getElementById('debt');
    const equityElement = document.getElementById('equity');
    const totalSourcesElement = document.getElementById('total-sources');
    const totalSources = SourceCalculator.debt + SourceCalculator.equity;

    debtElement.querySelector('span').innerHTML = `$${SourceCalculator.debt.toLocaleString()}`;
    equityElement.querySelector('span').innerHTML = `$${SourceCalculator.equity.toLocaleString()}`;
    totalSourcesElement.querySelector('span').innerHTML = `$${totalSources.toLocaleString()}`;

    createDonutChart([
        { label: 'Debt', value: SourceCalculator.debt, color: SourceCalculator.colors.principal },
        { label: 'Equity', value: SourceCalculator.equity, color: SourceCalculator.colors.profit }
    ]);
}

function createDonutChart(data) {
    d3.select('.sources-chart-container#chart').html('');
    const width = 100;
    const height = 100;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select('.sources-chart-container#chart')
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