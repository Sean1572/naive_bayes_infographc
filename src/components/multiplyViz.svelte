<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
  
    let svg;
    let probabilityA = 0.6;
    let probabilityB = 0.5;
  
    onMount(() => {
      drawVisualization();
    });
  
    // draw vis
    function drawVisualization() {
      const width = 400, height = 400;
      const pAB = probabilityA * probabilityB;
  
      d3.select(svg).selectAll('*').remove(); 
  
      const chart = d3.select(svg)
        .attr('width', width)
        .attr('height', height)
        .append('g');
  
      // background
      chart.append('rect')
        .attr('width', width)
        .attr('height', height)
        .style('fill', '#f8f9fa');
  
      // event a
      chart.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width * probabilityA)
        .attr('height', height)
        .style('fill', '#007bff')
        .style('opacity', 0.5);
  
      // overlap
      chart.append('rect')
        .attr('x', 0)
        .attr('y', height - (height * probabilityB))
        .attr('width', width * probabilityA)
        .attr('height', height * probabilityB)
        .style('fill', '#6610f2')
        .style('opacity', 0.7);
  
      // labels
      chart.append('text')
        .attr('x', 10)
        .attr('y', 20)
        .text(`P(A) = ${probabilityA}, P(B) = ${probabilityB}, P(A and B) = ${pAB.toFixed(2)}`)
        .style('font-family', 'Roboto')
        .style('font-size', '14px')
        .style('fill', '#000000');
    }
  
    // update prob
    function updateProbabilities(event, which) {
      if (which === 'A') {
        probabilityA = parseFloat(event.target.value);
      } else if (which === 'B') {
        probabilityB = parseFloat(event.target.value);
      }
      drawVisualization();
    }
  </script>

  <div>
    <label for="probabilityA">P(A): </label>
    <input type="range" id="probabilityA" min="0" max="1" step="0.01" value={probabilityA} on:input="{(event) => updateProbabilities(event, 'A')}">
  </div>
  <div>
    <label for="probabilityB">P(B): </label>
    <input type="range" id="probabilityB" min="0" max="1" step="0.01" value={probabilityB} on:input="{(event) => updateProbabilities(event, 'B')}">
  </div>
  
  <svg bind:this={svg}></svg>