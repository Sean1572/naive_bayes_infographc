<script>
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
    export let scale = 1;
    export let color = "black";
    
    

    let width = 100 * scale;
    let height = 80 * scale;

</script>
  

<svg class="email_cloud" id="og_email" width={width} height="{height}" viewBox="0 0 {width} {height}">
    <rect x=0 y=0 width="{width}" height="{height}" fill="white" stroke="{color}"/>
    <polygon points="0,0 {width/2},{height/2} {width},0" fill="{color}" />
</svg>

  
<style>
    #og_email {
        position: absolute;
        opacity: 0.0;
    }
</style>