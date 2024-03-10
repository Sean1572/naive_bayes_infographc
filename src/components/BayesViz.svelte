<script>
  import { onMount } from 'svelte';
  import * as agGrid from 'ag-grid-community';


  let priorProb = 0.5;
  let likelihood = 0.7;
  let marginalProb = 0.8;

  $: posteriorProb = (priorProb * likelihood) / marginalProb;

  const tableData = [
    { "x": 0, "y0": '0%', "y1": '0%' },
    { "x": 1, "y0": '5%', "y1": '0%' },
    { "x": 2, "y0": '10%', "y1": '5%' },
    { "x": 3, "y0": '15%', "y1": '15%' },
    { "x": 4, "y0": '5%', "y1": '20%' },
    { "x": 5, "y0": '0%', "y1": '15%' },
    { "x": 6, "y0": '0%', "y1": '10%' },
  ];
    

    const gridOptions = {
    rowData: tableData,
    columnDefs: [
      { field: "x" },
      { field: "y0" },
      { field: "y1" },
  ]
}

onMount(() => {
  const myGridElement = document.querySelector('#visualization');
  agGrid.createGrid(myGridElement, gridOptions);
  
  const agGridCSS = document.createElement('link');
    agGridCSS.rel = 'stylesheet';
    agGridCSS.href = 'https://cdn.jsdelivr.net/npm/ag-grid-community@29.0.0/styles/ag-grid.css';
    document.head.appendChild(agGridCSS);

    const agGridThemeCSS = document.createElement('link');
    agGridThemeCSS.rel = 'stylesheet';
    agGridThemeCSS.href = 'https://cdn.jsdelivr.net/npm/ag-grid-community@29.0.0/styles/ag-theme-alpine.css';
    document.head.appendChild(agGridThemeCSS);

});

  function handleInput(event, variableName) {
    if (variableName === 'priorProb') priorProb = parseFloat(event.target.value);
    else if (variableName === 'likelihood') likelihood = parseFloat(event.target.value);
    else if (variableName === 'marginalProb') marginalProb = parseFloat(event.target.value);
  }
  
</script>

<style>
  .slider {
    width: 100%;
    margin: 20px 0;
  }

  #visualization {
		--ag-foreground-color: rgb(126, 46, 132);
    --ag-background-color: rgb(249, 245, 227);
    --ag-header-foreground-color: rgb(204, 245, 172);
    --ag-header-background-color: rgb(209, 64, 129);
    --ag-odd-row-background-color: rgb(0, 0, 0, 0.03);
    --ag-header-column-resize-handle-color: rgb(126, 46, 132);

    --ag-font-size: 17px;
    --ag-font-family: monospace;
    width:600px;
    height:220px; 
	}	

  .ag-header-cell-label {
    justify-content: center !important;
    display: flex;
    align-items: center;
  }

</style>

<h2>Bayes' Rule Visualization</h2>
<div>
  <label for="priorProb">Prior Probability (P(A)):</label>
  <input type="range" id="priorProb" class="slider" min="0" max="1" step="0.01" bind:value={priorProb}>
  <span>{priorProb.toFixed(2)}</span>
</div>
<div>
  <label for="likelihood">Likelihood (P(B|A)):</label>
  <input type="range" id="likelihood" class="slider" min="0" max="1" step="0.01" bind:value={likelihood}>
  <span>{likelihood.toFixed(2)}</span>
</div>
<div>
  <label for="marginalProb">Marginal Probability (P(B)):</label>
  <input type="range" id="marginalProb" class="slider" min="0" max="1" step="0.01" bind:value={marginalProb}>
  <span>{marginalProb.toFixed(2)}</span>
</div>

<div id="formula">
  <p>Posterior Probability: {posteriorProb.toFixed(2)}</p>
</div>

<div id="visualization"></div>

