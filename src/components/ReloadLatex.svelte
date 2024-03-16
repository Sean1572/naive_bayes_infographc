<script async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js">
    import { onMount } from 'svelte';
    import {reloadLatex} from "./reloadLatex.js";
    export let math = "";
   //Code From below to get MathJax to reload this
   

   //It seems we need to read the script each time... okay

   onMount(() => {
    reloadLatex()
   })
   
</script>

<div>
    {@html math}
    
</div>