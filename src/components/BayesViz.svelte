<script>
  import { onMount, afterUpdate } from 'svelte';
  import * as d3 from 'd3';

  let selectedProbabilityType = 'none';
  let selectedColumn = 'none';
  let selectedX = null; 
  let selectedY = null; 
  let selectedDimension = 'none'; 

  

  let priorProb = 0.5;
  let likelihood = 0.7;
  let marginalProb = 0.8;

  let calculatedValue = 0; 
  $: if (selectedProbabilityType && selectedColumn !== 'none') {
    calculatedValue = calculateProbability(selectedProbabilityType, selectedColumn);
    renderTable();
  }

  $: if (selectedProbabilityType !== 'marginal') {
    selectedColumn = 'none';
  }

  $: if (selectedDimension === 'row' && selectedX !== null) {
  calculateMarginalProbabilityForRow();
  }

  const tableData = [
    { "x": 0, "y0": '0%', "y1": '0%' },
    { "x": 1, "y0": '5%', "y1": '0%' },
    { "x": 2, "y0": '10%', "y1": '5%' },
    { "x": 3, "y0": '15%', "y1": '15%' },
    { "x": 4, "y0": '5%', "y1": '20%' },
    { "x": 5, "y0": '0%', "y1": '15%' },
    { "x": 6, "y0": '0%', "y1": '10%' },
  ];

  function calculateProbability(probabilityType, selectedColumn) {
    switch (probabilityType) {
      case 'joint':
        return priorProb * likelihood;
      case 'marginal':
        return sumColumnValues(selectedColumn);
      case 'conditional':
        // Have to implement the conditional probability calculation here
        return 0; 
      default:
        return 0;
    }
  }

  function sumColumnValues(column) {
    let sum = 0;
    tableData.forEach(curr => {
      const value = parseFloat(curr[column].replace('%', '')) / 100;
      sum += isNaN(value) ? 0 : value;
    });
    return sum;
  }

  onMount(() => {
    renderTable();
  });

  afterUpdate(() => {
    renderTable();
  });

  function renderTable() {
  const columns = ["x", "y0", "y1"];

  const headerNames = {
    "x": "X",
    "y0": "Y = 0",
    "y1": "Y = 1"
  };
  
  d3.select("#visualization").selectAll("*").remove(); 
  const table = d3.select("#visualization").append("table").style("width", "100%");
  const thead = table.append("thead");
  const tbody = table.append("tbody");


  const headerRow = thead.append("tr");
  columns.forEach(column => {
    headerRow.append("th")
      .text(headerNames[column])
      .style("background-color", "#673AB7") 
      .style("color", "white")
      .style("padding", "12px")
      .style("border", "2px solid #4A148C")
      .style("text-align", "left");
  });
  

  const rows = tbody.selectAll("tr")
    .data(tableData)
    .enter().append("tr");

  rows.selectAll("td")
    .data(row => columns.map(column => ({ value: row[column], column, x: row.x })))
    .enter()
    .append("td")
      .text(d => d.value)
      .style("background-color", function(d) {
        if (selectedProbabilityType === 'conditionalPXGivenY' && `y${selectedY - 1}` === d.column) {
          if (parseInt(selectedX) === d.x) return "#FFEB3B"; 
          return "#64B5F6"; 
        }
        if (selectedProbabilityType === 'conditionalPYGivenX' && parseInt(selectedX) === d.x) {
          if (`y${selectedY - 1}` === d.column) return "#FFEB3B"; 
          return "#64B5F6"; 
        }
        return "#9575CD"; 
      })
      .style("color", "white")
      .style("border", "2px solid #4A148C")
      .style("padding", "12px")
      .style("text-align", "left");
}

  function handleProbabilityTypeChange(type) {
    selectedProbabilityType = type;
    selectedDimension = 'none';

  }

  function handleColumnSelection(column) {
    selectedColumn = column;
  }
  
  function handleSelectionChange(dimension) {
  selectedDimension = dimension;
  if (dimension === 'column') {
    selectedColumn = 'none';
  } else {
    selectedX = null;
  }
}

function calculateMarginalProbabilityForRow() {
  if (selectedX === null) return; 

  const row = tableData[parseInt(selectedX)];
  const total = Object.keys(row)
                .filter(key => key.startsWith('y')) 
                .reduce((sum, key) => sum + parseFloat(row[key].replace('%', '')) / 100, 0);

  calculatedValue = total;
}

  function calculatePXGivenY() {
    selectedProbabilityType = 'conditionalPXGivenY';

    const yColumn = selectedY === '1' ? 'y0' : 'y1';

    const selectedRow = tableData.find(row => row.x === parseInt(selectedX));
    if (!selectedRow) {
      console.error('Selected X row not found');
      return;
    }

    const valueXY = parseFloat(selectedRow[yColumn].replace('%', '')) / 100;
    
    const totalY = tableData.reduce((sum, row) => sum + parseFloat(row[yColumn].replace('%', '')) / 100, 0);

    const probabilityPXGivenY = valueXY / totalY;

    calculatedValue = probabilityPXGivenY;
    console.log(`P(X=${selectedX}|Y=${selectedY}) = ${calculatedValue}`);
  }

  function calculatePYGivenX() {
    selectedProbabilityType = 'conditionalPYGivenX';
    const yColumn = selectedY === '1' ? 'y0' : 'y1';

    const selectedRow = tableData.find(row => row.x === parseInt(selectedX));
    if (!selectedRow) {
      console.error('Selected X row not found');
      return;
    }

    const valueYX = parseFloat(selectedRow[yColumn].replace('%', '')) / 100;

    const totalXRow = Object.keys(selectedRow)
                        .filter(key => key !== 'x') 
                        .reduce((sum, key) => sum + parseFloat(selectedRow[key].replace('%', '')) / 100, 0);

    const probabilityPYGivenX = valueYX / totalXRow;

    calculatedValue = probabilityPYGivenX;
    console.log(`P(Y=${selectedY}|X=${selectedX}) = ${calculatedValue}`);
  }

</script>

<style>
  .buttons button, .column-selection button, .conditional-selection button {
    background-color: #303F9F; 
    color: white;
    border: 2px solid transparent;
    padding: 10px 20px;
    margin: 5px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s, border-color 0.3s;
  }

  .buttons button:hover, .column-selection button:hover, .conditional-selection button:hover,
  .buttons button:focus, .column-selection button:focus, .conditional-selection button:focus {
    background-color: #5C6BC0;
    border-color: #FFEE58;
    outline: none
  }

  select {
    background-color: #673AB7; 
    color: white;
    padding: 10px 20px;
    margin: 5px;
    border-radius: 5px;
    border: 2px solid transparent; 
    cursor: pointer;
    transition: background-color 0.3s, border-color 0.3s;
  }

  select:hover, select:focus {
    background-color: #9575CD; 
    border-color: #FFEE58; 
    outline: none;
  }
</style>


<h2>Bayes' Rule Visualization</h2>
<div class="buttons">
  <button on:click={() => handleProbabilityTypeChange('marginal')}>Marginal Probability</button>
  <button on:click={() => handleProbabilityTypeChange('conditional')}>Conditional Probability</button>
</div>

{#if selectedProbabilityType === 'marginal'}
  <div class="selection">
    <button on:click={() => handleSelectionChange('column')}>Column</button>
    <button on:click={() => handleSelectionChange('row')}>Row</button>
  </div>

  {#if selectedDimension === 'column'}
    <div class="column-selection">
      <button on:click={() => handleColumnSelection('y0')}>Column Y0</button>
      <button on:click={() => handleColumnSelection('y1')}>Column Y1</button>
    </div>
  {/if}

  {#if selectedDimension === 'row'}
    <div class="row-selection">
      <select bind:value={selectedX}>
        {#each Array(tableData.length) as _, i}
          <option value={i}>{i}</option>
        {/each}
      </select>
    </div>
  {/if}
{/if}

{#if selectedProbabilityType === 'conditional'}
  <div class="conditional-selection">
    <select bind:value={selectedX}>
      {#each Array(7) as _, i}
        <option value={i}>{i}</option>
      {/each}
    </select>
    <select bind:value={selectedY}>
      <option value="1">Y1</option>
      <option value="2">Y2</option>
    </select>
    <button on:click={calculatePXGivenY}>Calculate P(X|Y)</button>
    <button on:click={calculatePYGivenX}>Calculate P(Y|X)</button>
  </div>
{/if}

<div id="formula">
  <p>Selected Probability: {selectedProbabilityType.charAt(0).toUpperCase() + selectedProbabilityType.slice(1)}</p>
  <p>Calculated Value: {calculatedValue * 100}%</p>
</div>

<div id="visualization"></div>
