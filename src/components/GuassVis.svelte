<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
  
    let data = [
      // data here
        {"Temperature": 24.73, "Humidity": 47.66, "WillRain": "No"},
        {"Temperature": 17.27, "Humidity": 37.46, "WillRain": "Yes"},
        {"Temperature": 24.0, "Humidity": 38.13, "WillRain": "Yes"},
        {"Temperature": 15.3, "Humidity": 32.73, "WillRain": "Yes"},
        {"Temperature": 22.88, "Humidity": 31.56, "WillRain": "No"},
        {"Temperature": 22.97, "Humidity": 30.64, "WillRain": "Yes"},
        {"Temperature": 17.99, "Humidity": 45.14, "WillRain": "Yes"},
        {"Temperature": 27.81, "Humidity": 36.36, "WillRain": "No"},
        {"Temperature": 27.6, "Humidity": 43.47, "WillRain": "No"},
        {"Temperature": 20.45, "Humidity": 48.99, "WillRain": "Yes"},
        {"Temperature": 16.9, "Humidity": 49.54, "WillRain": "No"},
        {"Temperature": 16.77, "Humidity": 37.5, "WillRain": "No"},
        {"Temperature": 27.04, "Humidity": 22.52, "WillRain": "Yes"},
        {"Temperature": 16.51, "Humidity": 33.19, "WillRain": "No"},
        {"Temperature": 17.81, "Humidity": 45.96, "WillRain": "Yes"},
        {"Temperature": 27.65, "Humidity": 34.87, "WillRain": "Yes"},
        {"Temperature": 27.47, "Humidity": 45.55, "WillRain": "No"},
        {"Temperature": 22.68, "Humidity": 39.0, "WillRain": "No"},
        {"Temperature": 17.81, "Humidity": 21.81, "WillRain": "No"},
        {"Temperature": 17.59, "Humidity": 43.6, "WillRain": "Yes"}
    ];
    
    let currentCategory = 'All'; 
  
    function filterData(category) {
      return data.filter(d => category === 'All' || d.WillRain === category);
    }
  
    function setupHistogram(variable, filteredData) {
      const svg = d3.select(`#${variable.toLowerCase()}Histogram`);
      svg.selectAll("*").remove(); 
  
      const margin = {top: 20, right: 30, bottom: 40, left: 50},
            width = 450 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;
  
      // scales
      const x = d3.scaleLinear()
                  .domain(d3.extent(filteredData, d => d[variable]))
                  .range([0, width]);
  
      const histogram = d3.histogram()
                          .value(d => d[variable])
                          .domain(x.domain())
                          .thresholds(x.ticks(20));
  
      const bins = histogram(filteredData);
  
      const y = d3.scaleLinear()
                  .domain([0, d3.max(bins, d => d.length)])
                  .range([height, 0]);
  
      // Append the bar rectangles to the svg element
      const g = svg.append("g")
                   .attr("transform", `translate(${margin.left},${margin.top})`);
  
      g.selectAll("rect")
        .data(bins)
        .enter().append("rect")
          .attr("x", d => x(d.x0) + 1)
          .attr("width", d => x(d.x1) - x(d.x0) - 1)
          .attr("y", d => y(d.length))
          .attr("height", d => height - y(d.length))
          .style("fill", "#69b3a2");
  
      // x-axis
      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
  
      // y-axis
      g.append("g")
        .call(d3.axisLeft(y));
    }
  
    onMount(() => {
      // initial drawing of hists
      setupHistogram('Temperature', filterData(currentCategory));
      setupHistogram('Humidity', filterData(currentCategory));
    });
  
    // redraw hists
    $: if (currentCategory) {
      setupHistogram('Temperature', filterData(currentCategory));
      setupHistogram('Humidity', filterData(currentCategory));
    }
  </script>
  
  <div>
    <button on:click={() => currentCategory = 'All'}>All</button>
    <button on:click={() => currentCategory = 'Yes'}>Will Rain</button>
    <button on:click={() => currentCategory = 'No'}>Won't Rain</button>
  </div>
  
  <svg id="temperatureHistogram" width="450" height="400"></svg>
  <svg id="humidityHistogram" width="450" height="400"></svg>
  