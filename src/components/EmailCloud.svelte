<script>
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
    import Email from './Email.svelte';
  

    export let frame = 1;

    let allData = []; 
    let svg;
   
    let x = null;
    let n = 0;
    let width = 0;
    let height = 0;
    const marginBottom = 40;
    const marginLeft = 40;
    const marginTop = 40;
    const marginRight = 40;
  
    onMount(async () => {
          width = window.screen.width;
          height = window.screen.height;
          allData = await d3.csv("intro_vis.csv");
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
  
    function update_email_svgs(data) { 
        console.log(d3.select("svg").select(".email_cloud").data(data))
        d3.select("svg").selectAll(".email_cloud").data(data)
          .join(
            function(enter) {
              console.log("entered!");
              //https://d3js.org/d3-selection/modifying#selection_append
              //https://www.shecodes.io/athena/42375-how-to-make-a-copy-of-an-image-in-html-using-javascript
              // Because I want to insert a svelte component for animation, I need to copy the element
              // Clone doesn't work, it just overwrites the data
              // Can't just be a text, enter.append("email_cloud") tries to do document.createElement("email_cloud")
              return enter.append(() => {
                let email =  document.getElementsByClassName('email_cloud')
                return email[0].cloneNode(true)
              })
                .attr("id", "not og")
                .attr("height", function(d) { return 50 * d.size})
                .attr("width", function(d) { return 40 * d.size})
                .attr("fill", "black")
                .attr("opacity", 0.0)
                .attr("x", function(d) {return d.x * width})
                .attr("y", function(d) {return d.y * height});
            },
            function(update) {
                console.log("update!");
                return update;
            },
            function(exit) {
              console.log("remove!");
              return exit.transition()
                .duration(2000)
                .attr("opacity", 0.0).remove();
            }
          ).transition()
            .duration(2000)
            .attr("x", function(d) {return d.x * width})
            .attr("y", function(d) {return d.y * height})
            .attr("height", function(d) { return 50 * d.size})
            .attr("width", function(d) { return 40 * d.size})
            .attr("opacity", 0.5)
            
      }
  
    function update_data() {
      if (allData.length == 0) {
        return;
      }

      let frame_data = allData.filter(function(d){ return d.frame == frame})
      update_email_svgs(frame_data)
    }

    $: frame, update_data()

  </script>
  
  <div class="email cloud">
    <svg 
        {width}
        {height}
        viewBox="0 0 {width} {height}"
        style="max-width: 100%; height: auto;">
            <Email style="opacity=0.5"/>
            <g id="cloud"></g>
    </svg>
  </div>
  
  