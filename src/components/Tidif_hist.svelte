<script>
  import * as d3 from 'd3';
  import { onMount } from 'svelte';

  export let spam_split = true;
  export let no_prob = true;
  export let class_name = "";

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
  let TODO_DELETE = true;

  onMount(async () => {
        allData = await d3.csv("tidif_counts.csv");
        n = allData.length
        update_data()
  })

  
  $: x = d3.scaleLinear()
      .domain([0, 1])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width- marginLeft - marginRight]);

  $: x_inverse = d3.scaleLinear()
      .domain([0, width- marginLeft - marginRight])     
      .range([0, 1]);

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

  //https://stackoverflow.com/questions/68992663/d3-round-number-from-nest-and-sum
  //javascript why
  function round(x, position) {
    return Math.round(x*(10**position))/(10**position)
  }

  function update_bars(bins, id, fill_color) { 
      d3.select("."+class_name).select("svg").select(id).selectAll("rect")
        .data(bins)
        .join(
          function(enter) {
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
              return update;
          },
          function(exit) {
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


    if (spam_split) {
      let ham_data = allData.filter(function(d){ return (d[word] > 0) & (d.label == "ham") })
      let spam_data = allData.filter(function(d){ return (d[word] > 0) & (d.label == "spam") })

      histogram = d3.histogram()
        .value(function(d) { return d[word]; })   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(70)); // then the numbers of bins
      bins = histogram(ham_data);
      bins_spam = histogram(spam_data);
      bins_ham = histogram(ham_data);


      update_bars(bins_spam, "#spam", "orange")
      update_bars(bins_ham, "#ham","blue")
      update_probablity(ham_data, spam_data)
    } else {
      
      histogram = d3.histogram()
        .value(function(d) { return d[word]; })   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(70)); // then the numbers of bins
      bins = histogram(allData);
      


      update_bars(bins, "#spam", "black")
      
    }
    
      
      
  }

  let x_bar = 0.5*(width - marginLeft - marginRight)
  function update_probablity(ham_data, spam_data) {
      const svg = d3.select("."+class_name).select("svg")  
      if (no_prob) {
        svg.selectAll("text").text("");
        svg.select("#bar").select("rect").style("opacity", 0.0)
        return
      };

      //https://d3js.org/d3-drag      
      const rect = svg.select("#bar").select("rect")
            .attr("x", function(d) {return x_bar})
            .attr("y", marginTop)
            .attr("width", 5)
            .attr("height", height - marginBottom - marginTop)
            .style("fill", "red")
            .style("opacity", 0.5)
            .call(
              d3.drag()
                .on("drag", function(event) {
                  let new_x =  event.x
                  if ((new_x > marginLeft) && (new_x < width - marginRight)){
                    x_bar = new_x
                    //d3.select(this).attr("x", new_x)
                  }                
                })
            )
            .on('pointerenter pointermove', function(event) {

              d3.select(this).style("stroke-width", 2)
              d3.select(this).style("stroke",  "red")
            })
            .on('pointerleave', function(event) {
              d3.select(this).style("stroke-width", 0)
              d3.select(this).style("stroke",  "red")
            });

    let spam_num_right = spam_data.filter(function(d){ return (d[word] > x_inverse(x_bar))}).length
    let spam_num_left = spam_data.filter(function(d){ return (d[word] <= x_inverse(x_bar))}).length

    let ham_num_right = ham_data.filter(function(d){ return (d[word] > x_inverse(x_bar))}).length
    let ham_num_left = ham_data.filter(function(d){ return (d[word] <= x_inverse(x_bar))}).length
    
    let left_total = Math.max(spam_num_left + ham_num_left, 1)
    let right_total = Math.max(spam_num_right + ham_num_right, 1)

    let prob_ham_given_left = round(ham_num_left/left_total, 2)
    let prob_spam_given_left = round(spam_num_left/left_total, 2)

    let prob_ham_given_right = round(ham_num_right/right_total, 2)
    let prob_spam_given_right = round(spam_num_right/right_total, 2)
    
    // console.log("+++=======================================+++")
    // console.log(prob_ham_given_left, prob_spam_given_left)
    // console.log(prob_ham_given_right, prob_spam_given_right)
    
    //https://www.geeksforgeeks.org/d3-js-selection-text-function/
    svg.select("#right_spam")
            .text("Spam: " + prob_spam_given_right)
            .attr("x", function(d) {return x_bar + 10})
            .attr("y", marginTop + 20)

    svg.select("#right_ham")
            .text("Ham: " + prob_ham_given_right)
            .attr("x", function(d) {return x_bar + 10})
            .attr("y", marginTop + 40)

    svg.select("#left_spam")
            .text("Spam: " + prob_spam_given_left)
            .attr("x", function(d) {return x_bar - 80})
            .attr("y", marginTop + 20)


    svg.select("#left_ham")
            .text("Ham: " + prob_ham_given_left)
            .attr("x", function(d) {return x_bar - 80})
            .attr("y", marginTop + 40)
    
  }
    
  $: x_bar, update_data()
  $: word, update_data();
  $: no_prob, update_data();
  $: no_prob, console.log("updated no_prob ", no_prob, class_name)
  
  
</script>

<div class="visualization">
  <input type="text" id="word" name="word" placeholder={word} on:change={(event) => word = event.target.value}><br>
  <svg 
      {width}
      {height}
      viewBox="0 0 {width} {height}"
      style="">
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
          <g id="bar">
            <rect/>
            <text id="right_spam"></text>
            <text id="left_spam"></text>
            <text id="right_ham"></text>
            <text id="left_ham"></text>
          </g>
      
          
  </svg>
</div>

<style>
  .visualization {
    
  }
</style>
