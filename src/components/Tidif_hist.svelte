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
  let x = null;
  let n = 0;
  const width = 800;
  const height = 600;
  const marginBottom = 40;
  const marginLeft = 40;

  onMount(async () => {
        allData = await d3.csv("tidif_counts.csv");
        n = allData.length
        console.log("hello")
        update_data()
  })

  
  $: x = d3.scaleLinear()
      .domain([0, 1])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width]);

  $: y = d3.scaleLinear()
      .domain([0, 0.05])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, height]);
  

  $: allData, update_data();

  function update_data() {
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
  }


</script>

<div class="visualization">
  <svg 
      {width}
      {height}
      viewBox="0 0 {width} {height}"
      style="max-width: 100%; height: auto;">
          <!-- draw bars -->
          <g fill-opacity="0.5">
              {#each bins_spam as bin}
                  <rect
                    x=1
                    transform={"translate(" + x(bin.x0) + "," + (height - y(bin.length/n)) + ")"}
                    width={x(bin.x1) - x(bin.x0) -1}
                    height={y(bin.length/n)}
                    fill="orange"
                  />
              {/each}
              {#each bins_ham as bin}
                  <rect
                    x=1
                    transform={"translate(" + x(bin.x0) + "," + (height - y(bin.length/n)) + ")"}
                    width={x(bin.x1) - x(bin.x0) -1}
                    height={y(bin.length/n)}
                    fill="blue"
                  />
              {/each}
          </g>
  </svg>
</div>

