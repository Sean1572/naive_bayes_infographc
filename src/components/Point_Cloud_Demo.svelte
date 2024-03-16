<script>
    // based largely on:
    //https://d3-graph-gallery.com/graph/violin_jitter.html

    //GOALS
    //Create Jitter violin plot
    //Split between spam and ham (y axis)
    //Create rectangles that can compute the probablitty of spam in ham in each section
    //Do reactangles both x and y and make them toggleable
    //Maybbe add an extra feature to do a second split down the y axis and have like a grouped axis to allow for more words
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
  


    export let class_name = "";
    export let word = "call";
    export let index = 0;
    let allData = []; 
    const rect_width = 100;
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

    let x_bar = 0.5*(width - marginLeft - marginRight)
  
    onMount(async () => {
          allData = await d3.csv("tidif_counts.csv");
          n = allData.length
          update_data()
          update_prob()
    })
  
  
    //TF-IDF
    $: x = d3.scaleLinear()
        .domain([0, 1])     
        .range([marginLeft, width- marginRight]);
  
    $: x_inverse = d3.scaleLinear()
      .domain([marginLeft, width - marginRight])     
      .range([0, 1]);

    //Groups
    $:  y = d3.scaleBand()
        .domain(["spam", "ham"])
        .range([0 , height - marginTop - marginBottom])
        .padding(0.05)     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
    
  
    $: d3.select(gx).call(d3.axisBottom(x).ticks(width / 80));
    $: d3.select(gy).call(d3.axisLeft(y))

  
    //https://stackoverflow.com/questions/68992663/d3-round-number-from-nest-and-sum
    //javascript why
    function round(x, position) {
      return Math.round(x*(10**position))/(10**position)
    }

    //allow for select highlighting
    let all_flag = true
    let label_flag = false
    let spam_flag = true
    let range_flag = false

    function adjust_highlight() {
      if (allData.length == 0) {
          return;
      }
      let ham_data = allData.filter(function(d){ 
        return (d[word] < x_inverse(x_bar +  rect_width)) & (d[word] > x_inverse(x_bar)) & (d.label == "ham") })
      let spam_data = allData.filter(function(d){ 
        return (d[word] < x_inverse(x_bar +  rect_width)) & (d[word] >  x_inverse(x_bar)) & (d.label == "spam") })


      const total_spam = allData.filter(function(d){return (d[word] > 0) & (d.label == "spam") }).length
      const total_ham = allData.filter(function(d){return(d[word] > 0) & (d.label == "ham") }).length
      const total_points = allData.filter(function(d){return(d[word] > 0)}).length
      const total_range = allData.filter(function(d){return (d[word] < x_inverse(x_bar +  rect_width)) & (d[word] >  x_inverse(x_bar)) &(d[word] > 0)}).length
      // console.log(x_inverse(x_bar), x_inverse(x_bar +  rect_width), 
      //   "total spam: ", total_spam,
      //   "total ham: ", total_ham,
      //   "total spam in range: ", spam_data.length,
      //   "total ham in range: ", ham_data.length,
      //   "total points: ", total_points,
      //   "points in range: ", total_range,
      //   "probablity of spam given tidif range = prob in range and prob of spam devided by prob of range",
      //   "prob in range = #of points in range / #of points = ", total_range/total_points,
      //   "prob in spam = #of points in spam / #of points = ", total_spam/total_points,
      //   "prob in spam GIVEN in range = # of points in spam and range / # of points in range = ", spam_data.length/total_range ,
        
      //   "this is equal to prob in range and spam / prob in range = ", 
      //   spam_data.length/total_points, "/", total_range/total_points, "=",
      //    (spam_data.length/total_points)/(total_range/total_points),

      //    "Now the Probablity of range given spam is therefore = # the number of points in spam and range / # of points in spam",
      //    spam_data.length/total_points, "/", total_spam/total_points, "=",
      //    (spam_data.length/total_points)/(total_spam/total_points),
      //   )

        const svg = d3.select("."+class_name).select("svg")
        //Program a probablity system with each histogram
        if (false) {
          svg.selectAll("text").text("");
          svg.select("#bar").select("rect").style("opacity", 0.0)
          return
        };
        console.log(svg.select("#PS"))
        

        // svg.select("#PR")
        //         .text("Prob of TF-IDF in range, P(R): " + round(total_range/total_points, 2))
        //         .attr("x", function(d) {return width-250})
        //         .attr("y", marginTop + 40)

        // svg.select("#PRS")
        //         .text("A text has a TF-IDF in range and spam, P(R and S): " + round(spam_data.length/total_points, 2))
        //         .attr("x", function(d) {return width-385})
        //         .attr("y", marginTop + 60)


        // svg.select("#PSGR")
        //         .text("Given a TF-IDF range, prob of spam, P(S | R): " + round(spam_data.length/total_range, 2))
        //         .attr("x", function(d) {return width-350})
        //         .attr("y", marginTop + 80)
        
        // svg.select("#PRGS")
        //         .text("Given a TF-IDF range, prob of spam, P(R | S): " + round(spam_data.length/total_spam, 2))
        //         .attr("x", function(d) {return width-350})
        //         .attr("y", marginTop + 100)

      
      if (index <= 24) {
        svg.selectAll("text").text("");
        all_flag = true
      }
      if (index > 24) {
        svg.selectAll("text").text("");
        all_flag = false;
        spam_flag = true; 
        range_flag = false;
        svg.select("#PR")
                .text("Prob of spam, P(S): " + round(total_spam/total_points, 2))
                .attr("x", function(d) {return width-250})
                .attr("y", marginTop + 40)
      }
      if (index > 25) {
        svg.selectAll("text").text("");
        range_flag = true; 
        spam_flag=false;
        svg.select("#PR")
                .text("Prob of TF-IDF in range, P(R): " + round(total_range/total_points, 2))
                .attr("x", function(d) {return width-250})
                .attr("y", marginTop + 40)
      }
      if (index > 26) {
        svg.selectAll("text").text("");
        range_flag = true; 
        spam_flag=true;
        svg.select("#PR")
                .text("A text has a TF-IDF in range and spam, P(R and S): " + round(spam_data.length/total_points, 2))
                .attr("x", function(d) {return width-385})
                .attr("y", marginTop + 40)

      }

      //pause for a second to explain conditional probablity

      //Reveal conditional probablities
      if (index > 28) {
        svg.selectAll("text").text("");
        range_flag = true; 
        spam_flag=true;
        svg.select("#PR")
                .text("Prob of spam, P(S): " + round(total_spam/total_points, 2))
                .attr("x", function(d) {return width-250})
                .attr("y", marginTop + 40)

        svg.select("#PRS")
                .text("A text has a TF-IDF in range and spam, P(R and S): " + round(spam_data.length/total_points, 2))
                .attr("x", function(d) {return width-385})
                .attr("y", marginTop + 60)


        svg.select("#PSGR")
                .text("Given a TF-IDF range, prob of spam, P(R | S): " + round(spam_data.length/total_spam, 2))
                .attr("x", function(d) {return width-350})
                .attr("y", marginTop + 80)

        svg.select("#PRGS")
                .text(
                  "P(R | S) = P(S and R) / P(S) = "
                  + round(spam_data.length/total_points, 2) + " / " 
                  + round(total_spam/total_points, 2) + " = " 
                  + round(spam_data.length/total_spam, 2)
                  )
                .attr("x", function(d) {return width-350})
                .attr("y", marginTop + 100)


      }
      if (index > 30) {
        svg.selectAll("text").text("");
        range_flag = true; 
        spam_flag=true;
        svg.select("#PR")
                .text("Prob of TF-IDF in range, P(R): " + round(total_range/total_points, 2))
                .attr("x", function(d) {return width-250})
                .attr("y", marginTop + 40)

        svg.select("#PRS")
                .text("A text has a TF-IDF in range and spam, P(R and S): " + round(spam_data.length/total_points, 2))
                .attr("x", function(d) {return width-385})
                .attr("y", marginTop + 60)


        svg.select("#PSGR")
                .text("Given a TF-IDF range, prob of spam, P(S | R): " + round(spam_data.length/total_range, 2))
                .attr("x", function(d) {return width-350})
                .attr("y", marginTop + 80)

        svg.select("#PRGS")
                .text(
                  "P(S | R) = P(S and R) / P(R) = "
                  + round(spam_data.length/total_points, 2) + " / " 
                  + round(total_range/total_points, 2) + " = " 
                  + round(spam_data.length/total_range, 2)
                  )
                .attr("x", function(d) {return width-350})
                .attr("y", marginTop + 100)


      }
      console.log(all_flag, label_flag, spam_flag, range_flag)
      
      update_data();
    }
   
    

    function select_points(d) {
      return (
          ((d[word] < x_inverse(x_bar +  rect_width)) || !range_flag) 
        ) & (
          (d[word] > x_inverse(x_bar) || !range_flag)
        ) & (
          (d.label == "ham") || !label_flag
        ) & (
          (d.label == "spam") || !spam_flag
        ) || all_flag
    }

  
    function update_data() {
      if (allData.length == 0) {
          return;
      }
      let data = allData.filter(function(d){ return (d[word] > 0) })
      const svg = d3.select("."+class_name).select("svg")
      
      const ticks = 10
      const histogram = d3.histogram()
        .value(function(d) { return d[word]; })   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(ticks));
      console.log(histogram(data), histogram(data)[0])

      //Get bin height to give scatter a sense of histogram binning
      const bins = histogram(data)
      data = data.map((d)=> {
          d["bin_height"] = bins[round(d[word]/(1/ticks), 0)].length
          return d
      })
      console.log(data[0]["bin_height"], data[0][word])
      console.log(svg)
      const jitterWidth = 1.5
      svg
          .selectAll("circle")
          .data(data)
          
          .join(
        function(enter) {
          return enter
            .append("circle")
            .attr("cx", function(d){return(x(d[word]))})
            .attr("cy", function(d){
              let random_move =  (Math.random() * 2 - 1)
              let offset = y.bandwidth()/2
              let init = y(d.label) + offset - (random_move*d.bin_height/2)
              return init  + 40
            })
            .attr("r", 5)
            .style("fill", function(d){
                if(d.label == "spam") {
                  return "orange"
                } else {
                  return "blue"
                }
            })
            .attr("stroke", "white")
            
            .attr("opacity", function(d) {
              if (select_points(d)){
                return 1
              } else {
                return 0.2
              }
            })
            
        },
        function(update) {
            return update
            .attr("opacity", function(d) {
              if (select_points(d)){
                return 1
              } else {
                return 0.2
              }
            });
        },
        function(exit) {
          console.log(exit)
          return exit.transition()
            .duration(800)
            .attr("opacity", 0.0)
            .remove();
        }
      )

      update_prob()
    }

    function update_prob() {
      if (allData.length == 0) {
          return;
      }
      const svg = d3.select("."+class_name).select("svg")
      //Program a probablity system with each histogram
      if (false) {
        svg.selectAll("text").text("");
        svg.select("#bar").select("rect").style("opacity", 0.0)
        return
      };


      //https://d3js.org/d3-drag  
      
      //TODO CREATE SWAP LOGIC!!!
      const rect = svg.select("#bar").select("rect")
          .attr("opacity", 0.0)    
          .attr("x", function(d) {return x_bar})
          .attr("y", marginTop)
          .attr("width", rect_width)
          .attr("height", height - marginBottom - marginTop)
          .style("fill", "red")
          
          .call(
            d3.drag()
              .on("drag", function(event) {
                let new_x =  event.x
                if ((new_x > marginLeft) && (new_x < width - marginRight - rect_width)){
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
          })
          .transition().duration(800).style("opacity", 0.5);
        }

    $: word, update_data();
    $: x_bar, adjust_highlight();
    $: index, adjust_highlight();
    $: index, console.log(index)
    
    
  </script>
  
  <div class="visualization">
    <input type="text" id="word" name="word" placeholder={word} on:change={(event) => word = event.target.value}><br>
    <svg 
        {width}
        {height}
        viewBox="0 0 {width} {height}"
        style="">
            <!-- x-axis -->
            <g bind:this={gx} transform="translate({0},{height - marginBottom})" />
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

            <g id="bar">
              <rect/>
              <text id="PS"></text>
              <text id="PR"></text>
              <text id="PRS"></text>
              <text id="PSGR"></text>
              <text id="PRGS"></text>
            </g>
            
    </svg>
  </div>
  
  <style>
    .visualization {
      
    }
  </style>
  