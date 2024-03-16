<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
  
    // Your data for the variants comparison
    let data = [
      { variant: 'Gaussian', accuracy: 0.8 },
      { variant: 'Multinomial', accuracy: 0.75 },
      { variant: 'Bernoulli', accuracy: 0.65 },
    ];
  
    onMount(() => {
      drawBarChart();
    });
  
    function drawBarChart() {
      // Assuming an SVG element with the id 'viz' exists
      const svg = d3.select('#viz')
        .attr('width', 400)
        .attr('height', 300);
  
      const xScale = d3.scaleBand()
        .domain(data.map(d => d.variant))
        .rangeRound([0, 400])
        .padding(0.1);
  
      const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([300, 0]);

        // Inside your drawBarChart function
        svg.selectAll('.bar')
        .on('mouseover', (event, d) => {
            // Show tooltip
        })
        .on('mouseout', (event, d) => {
            // Hide tooltip
        });

  
      // Add bars
      svg.selectAll('.bar')
        .data(data)
        .enter().append('rect')
          .attr('class', 'bar')
          .attr('x', d => xScale(d.variant))
          .attr('y', d => yScale(d.accuracy))
          .attr('width', xScale.bandwidth())
          .attr('height', d => 300 - yScale(d.accuracy))
          .attr('fill', 'steelblue');
    }
  </script>
  
  <svg id="viz"></svg>

  <style>
    svg {
      display: block;
      margin: 0 auto;
      background-color: #f9f9fa;
    }
  
    .bar {
      transition: fill 0.2s ease;
    }
  
    .bar:hover {
      fill: darkblue;
    }
  </style>

