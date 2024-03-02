<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
  
    let priorProbability = 0.5;
    let likelihood = 0.5;
    let marginalLikelihood = 0.5;
    let posteriorProbability = (priorProbability * likelihood) / marginalLikelihood;
  
    const calculatePosterior = () => {
      posteriorProbability = (priorProbability * likelihood) / marginalLikelihood;
    };
  
    onMount(() => {
      // Initialization or any D3 specific drawing logic can go here
    });
  </script>
  
  <style>
    .slider-container {
      margin: 20px 0;
    }
    
    .formula {
      font-size: 20px;
      margin-bottom: 20px;
    }
  </style>
  
  <div class="formula">
    <p>Posterior Probability = (Prior Probability × Likelihood) / Marginal Likelihood</p>
  </div>
  
  <div class="slider-container">
    <label for="priorProbability">Prior Probability: {priorProbability}</label>
    <input type="range" min="0" max="1" step="0.01" bind:value={priorProbability} on:change={calculatePosterior}>
  </div>
  
  <div class="slider-container">
    <label for="likelihood">Likelihood: {likelihood}</label>
    <input type="range" min="0" max="1" step="0.01" bind:value={likelihood} on:change={calculatePosterior}>
  </div>
  
  <div class="slider-container">
    <label for="marginalLikelihood">Marginal Likelihood: {marginalLikelihood}</label>
    <input type="range" min="0" max="1" step="0.01" bind:value={marginalLikelihood} on:change={calculatePosterior}>
  </div>
  
  <div class="result">
    <p>Posterior Probability: {posteriorProbability.toFixed(2)}</p>
  </div>
  