<script>
  import { onMount, afterUpdate } from 'svelte';
  import * as d3 from 'd3';

  import {reloadLatex} from "./reloadLatex.js";
  let selectedProbabilityType = 'none';
  let selectedColumn = 'none';
  let selectedX = null; 
  let selectedY = null; 
  let selectedDimension = 'none'; 
  let currentFormula = '';

  

 $: currentFormula, () => {
  console.log("Updating formula: ", currentFormula);
  if (window.MathJax) {
    MathJax.typesetPromise().catch(err => console.error('MathJax rendering error:', err));
  }
};


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
    { "word": "Hibiscus", "Ham": '0%', "Spam": '0%' },
    { "word": "Never", "Ham": '5%', "Spam": '0%' },
    { "word": "Membership", "Ham": '10%', "Spam": '5%' },
    { "word": "Password", "Ham": '15%', "Spam": '15%' },
    { "word": "Free", "Ham": '5%', "Spam": '20%' },
    { "word": "SSN", "Ham": '0%', "Spam": '15%' },
    { "word": "Claim", "Ham": '0%', "Spam": '10%' },
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
  // if (typeof window.MathJax === 'undefined') {
    // const script = document.createElement('script');
    // script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    // script.async = true;
    // document.head.appendChild(script);

  //   script.onload = () => {
  //     MathJax.typesetPromise();
  //   };
  // } else {
  //   MathJax.typesetPromise();
  // }
  
  renderTable();
});


  afterUpdate(() => {
    renderTable();
  });

  function renderTable() {
  const columns = ["word", "Ham", "Spam"]; 

  d3.select("#visualization").selectAll("*").remove(); 
  const table = d3.select("#visualization").append("table").style("width", "100%");
  const thead = table.append("thead");
  const tbody = table.append("tbody");

  // Header
  const headerRow = thead.append("tr");
  columns.forEach(column => {
    headerRow.append("th")
      .text(column)
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
    .data(row => columns.map(column => {
      return { value: row[column], column, word: row.word };
    }))
    .enter()
    .append("td")
    .text(d => d.value)
    .style("background-color", function(d) {
      let defaultBgColor = "#9575CD"; //default purple color

      if (d.column === "word") {
        return defaultBgColor; // Keep "word" column background color
      }

      // Conditional highlights
      if (selectedProbabilityType === 'conditionalPXGivenY' && selectedY === d.column) {
        return selectedX === d.word ? "#FFEB3B" : "#64B5F6";
      } else if (selectedProbabilityType === 'conditionalPYGivenX' && selectedX === d.word) {
        return selectedY === d.column ? "#FFEB3B" : "#64B5F6";
      }

      // Marginal highlights
      if (selectedProbabilityType === 'marginal') {
        if (selectedDimension === 'column' && selectedColumn === d.column) {
          return "#64B5F6"; // Highlight column except "word"
        } else if (selectedDimension === 'row' && selectedX === d.word) {
          return "#64B5F6"; // Highlight row except "word"
        }
      }

      return defaultBgColor; 
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

  const row = tableData.find(r => r.word === selectedX);
  if (!row) return;

  const total = ['Ham', 'Spam'].reduce((sum, key) => {
    const value = parseFloat(row[key].replace('%', '')) / 100;
    return sum + (isNaN(value) ? 0 : value);
  }, 0);

  calculatedValue = total;
}

function calculatePXGivenY() {
    selectedProbabilityType = 'conditionalPXGivenY';

    const yColumn = selectedY; 

    const selectedRow = tableData.find(row => row.word === selectedX);
    if (!selectedRow) {
        console.error('Selected word not found');
        return;
    }

    const valueXY = parseFloat(selectedRow[yColumn].replace('%', '')) / 100;
    
    const totalY = tableData.reduce((sum, row) => sum + parseFloat(row[yColumn].replace('%', '')) / 100, 0);

    const probabilityPXGivenY = valueXY / totalY;

    calculatedValue = probabilityPXGivenY; 
    currentFormula = `P(${selectedX} \\, | \\, ${selectedY}) = \\frac{P(${selectedX} \\, \\text{and} \\, ${selectedY})}{${generateSumFormulaForPXGivenY(selectedY)}}`;
    reloadLatex()
}

function generateSumFormulaForPXGivenY(selectedY) {
    let sumFormulaParts = tableData.map(row => `P(${row.word} \\, \\text{and} \\, ${selectedY})`).join(" + ");
    return `\\left( ${sumFormulaParts} \\right)`;
}


function calculatePYGivenX() {
  selectedProbabilityType = 'conditionalPYGivenX';
  const yColumn = selectedY; 

  const selectedRow = tableData.find(row => row.word === selectedX);
  if (!selectedRow) {
    console.error('Selected word not found');
    return;
  }

  const valueYX = parseFloat(selectedRow[yColumn].replace('%', '')) / 100;

  const totalXRow = Object.keys(selectedRow)
                      .filter(key => key !== 'word') // Exclude the 'word' key
                      .reduce((sum, key) => sum + parseFloat(selectedRow[key].replace('%', '')) / 100, 0);

  const probabilityPYGivenX = valueYX / totalXRow;

  calculatedValue = probabilityPYGivenX;
  currentFormula = `P(Y | X) = \frac{P(Y \text{ and } X)}{P(\text{Spam} \text{ and } X) + P(\text{Ham} \text{ and } X)}`;
  reloadLatex()
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
    <button on:click={() => handleColumnSelection('Ham')}>Ham</button>
    <button on:click={() => handleColumnSelection('Spam')}>Spam</button>
  </div>
  {/if}

  {#if selectedDimension === 'row'}
  <div class="row-selection">
    <select bind:value={selectedX}>
      {#each tableData as row}
        <option value={row.word}>{row.word}</option>
      {/each}
    </select>
  </div>
{/if}
{/if}

{#if selectedProbabilityType === 'conditional'}
  <div class="conditional-selection">
    <select bind:value={selectedX}>
      {#each tableData as row, i}
        <option value={row.word}>{row.word}</option>
      {/each}
    </select>
    <select bind:value={selectedY}>
      <option value="Ham">Ham</option>
      <option value="Spam">Spam</option>
    </select>
    <button on:click={calculatePXGivenY}>Calculate P(X|Y)</button>
    <button on:click={calculatePYGivenX}>Calculate P(Y|X)</button>
  </div>
{/if}


<div id="formula">

  <p>Formula: {"$" + currentFormula + "$"}</p>
  <p>Selected Probability: {selectedProbabilityType.charAt(0).toUpperCase() + selectedProbabilityType.slice(1)}</p>
  <p>Calculated Value: {calculatedValue * 100}%</p>
</div>

<div id="visualization"></div>
