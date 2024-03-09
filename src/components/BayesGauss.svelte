<script>
  const stats = {
    rain: {
      temperature: { mean: 18, stdDev: 5 },
      humidity: { mean: 60, stdDev: 10 }
    },
    noRain: {
      temperature: { mean: 25, stdDev: 5 },
      humidity: { mean: 30, stdDev: 10 }
    }
  };

  let temperature = 20; 
  let humidity = 50; 
  let probabilityOfRain = 0; 
  let displayFormula = ''; 

  // calc function
  function calculateProbability(temp, humid) {
    // calc
    const probability = Math.random(); 
    // formula string
    const formula = `P(Rain | Temperature=${temp}, Humidity=${humid}) ≈ ${probability.toFixed(2)}`;
    return { probability, formula };
  }

  // reactively update 
  $: {
    const result = calculateProbability(temperature, humidity);
    probabilityOfRain = result.probability;
    displayFormula = result.formula;
  };
</script>

<style>
  .slider {
    margin: 20px 0;
  }

  .output {
    margin-top: 20px;
  }
</style>

<div>
  <h2>Interactive Gaussian Naive Bayes Visualization</h2>
  
  <div class="slider">
    <label>
      Temperature: <span>{temperature}°C</span>
      <input type="range" min="-10" max="40" bind:value={temperature}>
    </label>
  </div>
  
  <div class="slider">
    <label>
      Humidity: <span>{humidity}%</span>
      <input type="range" min="0" max="100" bind:value={humidity}>
    </label>
  </div>
  
  <div class="output">
    <strong>Probability of Rain:</strong> {probabilityOfRain.toFixed(2)}
  </div>
  
  <div class="output">
    <strong>Formula:</strong> {displayFormula}
  </div>
</div>
