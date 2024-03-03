<script>
  import { onMount } from 'svelte';
  let Tabulator;


  let priorProb = 0.5;
  let likelihood = 0.7;
  let marginalProb = 0.8;
  let table;

  $: posteriorProb = (priorProb * likelihood) / marginalProb;

  function updateTableData() {
    const tableData = [
      { x: 0, y0: '0%', y1: '0%' },
      { x: 1, y0: '5%', y1: '0%' },
      { x: 2, y0: '10%', y1: '5%' },
      { x: 3, y0: '15%', y1: '15%' },
      { x: 4, y0: '5%', y1: '20%' },
      { x: 5, y0: '0%', y1: '15%' },
      { x: 6, y0: '0%', y1: '10%' },
    ];
    if (table) {
      table.setData(tableData);
    }
  }

  onMount( async () => {
    const module = await import('tabulator-tables');
    Tabulator = module.default;


    table = new Tabulator("#visualization", {
      height: "311px",
      data: [],
      columns: [
        { title: "X", field: "x", hozAlign: "center", width: 200 },
        { title: "Y = 0", field: "y0", hozAlign: "center", width: 200 },
        { title: "Y = 1", field: "y1", hozAlign: "center", width: 200 },
      ],
    });
    updateTableData();
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
  #visualization .tabulator {
    font-size: 1em; 
  }
  #visualization .tabulator-row {
    padding: 15px; 
  }
  #visualization .tabulator-cell {
    padding: 15px; 
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
