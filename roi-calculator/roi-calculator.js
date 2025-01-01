const ROICalculator = {
    defaultInvestment: 50000,
    roiPercentage: 0.15,
    holdPeriod: '1 year',
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

console.log(document.readyState);

window.addEventListener('load', function () {
    const animatedElement = document.querySelector('[data-animate="true"]');
    if (animatedElement) {
        observer.observe(animatedElement);
    }

    console.log("documented loaded");
            
    const investmentInput = document.getElementById('investment');
    investmentInput.value = ROICalculator.defaultInvestment;
    calculateROI(ROICalculator.defaultInvestment);
});

document.getElementById('roiForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const investment = parseFloat(document.getElementById('investment').value);
    calculateROI(investment);
});

function calculateROI(investment) {
    const profit = investment * ROICalculator.roiPercentage;

    const resultsElement = document.getElementById('results');
    resultsElement.textContent = `When I invest $${investment.toLocaleString()} over ${ROICalculator.holdPeriod}, I will earn $${profit.toLocaleString()}.`;

    createDonutChart([
        { label: 'Principal', value: investment, color: ROICalculator.colors.principal },
        { label: 'Profit', value: profit, color: ROICalculator.colors.profit }
    ]);
}

function createDonutChart(data) {
    d3.select('#chart').html('');
    const width = 400;
    const height = 400;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select('#chart')
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
