<script>
  import * as d3 from 'd3';
  import { onMount } from 'svelte';

  let allData = []; 
  let svg;
  let bins;
  let bins_spam;
  let bins_ham;
  let word = "call";
  let histogram = null;
  let gx;
  let gy;
  let x = null;
  let n = 0;
  const width = 800;
  const height = 600;
  const marginBottom = 40;
  const marginLeft = 40;
  const marginTop = 40;
  const marginRight = 40;

  onMount(async () => {
        allData = await d3.csv("tidif_counts.csv");
        n = allData.length
        console.log("hello")
        update_data()
  })

  
  $: x = d3.scaleLinear()
      .domain([0, 1])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width- marginLeft - marginRight]);

  $: y = d3.scaleLinear()
      .domain([0.05, 0])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0 , height - marginTop - marginBottom]);
  

  
  

  $: d3.select(gx).call(d3.axisBottom(x).ticks(width / 80));
  $: d3.select(gy)
    .call(d3.axisLeft(y).ticks(null, '+'))
    // grid lines
    .call((g) =>
      g
        .selectAll('.tick line')
        .clone()
        .attr('x2', width - marginRight - marginLeft)
        .attr('stroke-opacity', (d) => (d === 0 ? 1 : 0.1))
        .attr('height', height - marginBottom),
    );

  function update_bars(bins, id, fill_color) { 
      d3.select("svg").select(id).selectAll("rect")
        .data(bins)
        .join(
          function(enter) {
            console.log("entered!");
            return enter
            .append("rect")
              .attr("x", function(d) {return x(d.x0) + marginLeft;})
              .attr("y", function(d) {return y(d.length/n) + marginBottom})
              .attr("width", function(d) { return x(d.x1) - x(d.x0) -1; })
              .attr("height", function(d) { return height - y(d.length/n) - marginBottom - marginTop; })
              .style("fill", fill_color)
              .style("opacity", 0.5);
          },
          function(update) {
              console.log("update!");
              return update;
          },
          function(exit) {
            console.log("remove!");
            return exit.transition()
              .duration(800)
              .attr("height", function(d) { return height - marginBottom - marginTop; })
              .remove();
          }
        ).transition()
          .duration(800)
          .attr("y", function(d) {return y(d.length/n) + marginBottom})
          .attr("height", function(d) { return height - y(d.length/n) - marginBottom - marginTop; })
    }

  function update_data() {
    if (allData.length == 0) {
      return;
    }

    console.log(allData)
    let ham_data = allData.filter(function(d){ return (d[word] > 0) & (d.label == "ham") })
    let spam_data = allData.filter(function(d){ return (d[word] > 0) & (d.label == "spam") })
    histogram = d3.histogram()
      .value(function(d) { return d[word]; })   // I need to give the vector of value
      .domain(x.domain())  // then the domain of the graphic
      .thresholds(x.ticks(70)); // then the numbers of bins
    bins = histogram(ham_data);
    bins_spam = histogram(spam_data);
    bins_ham = histogram(ham_data);

    console.log(bins_spam)
    update_bars(bins_spam, "#spam", "orange")
    update_bars(bins_ham, "#ham","blue")
      
      
  }

  $: word, update_data();




</script>

<div class="visualization">
  <input type="text" id="word" name="word" placeholder={word} on:change={(event) => word = event.target.value}><br>
  <svg 
      {width}
      {height}
      viewBox="0 0 {width} {height}"
      style="max-width: 100%; height: auto;">
          <!-- x-axis -->
          <g bind:this={gx} transform="translate({marginLeft},{height - marginBottom})" />
          <!-- y-axis -->
          <g bind:this={gy} transform="translate({marginLeft},{marginTop})">
            <text
              x="5"
              y={marginTop}
              dy="0.32em"
              fill="#000"
              font-weight="bold"
              text-anchor="start"
            >
              {word}
            </text>
          </g>

          <g id="spam"></g>
          <g id="ham"></g>
      
          
  </svg>
</div>

