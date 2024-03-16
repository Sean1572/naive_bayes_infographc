<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  let svg;
  let selectedWords = ["", "", ""];
  let naiveBayesResult = { spam: 0, ham: 0 };

  const data = [
    { word: 'ok', spamProbability: 0.0120, hamProbability: 0.9880 },
    { word: 'just', spamProbability: 0.1329, hamProbability: 0.8671 },
    { word: 'ur', spamProbability: 0.4173, hamProbability: 0.5827 },
    { word: 'good', spamProbability: 0.0328, hamProbability: 0.9672 },
    { word: 'know', spamProbability: 0.0917, hamProbability: 0.9083 },
    { word: 'like', spamProbability: 0.0206, hamProbability: 0.9794 },
    { word: 'come', spamProbability: 0.0098, hamProbability: 0.9902 },
    { word: 'need', spamProbability: 0.0508, hamProbability: 0.9492 },
    { word: 'free', spamProbability: 0.7455, hamProbability: 0.2545 },
    { word: 'day', spamProbability: 0.0534, hamProbability: 0.9466 },
    { word: 'text', spamProbability: 0.5132, hamProbability: 0.4868 },
    { word: 'send', spamProbability: 0.2401, hamProbability: 0.7599 },
    { word: 'cheap', spamProbability: 0.5001, hamProbability: 0.4999 },
    { word: 'hungry', spamProbability: 0.5041, hamProbability: 0.4959 },
    { word: 'pass', spamProbability: 0.5045, hamProbability: 0.4955 },
    { word: 'double', spamProbability: 0.5061, hamProbability: 0.4939 },
    { word: 'trip', spamProbability: 0.5109, hamProbability: 0.4891 },
    { word: 'mobile', spamProbability: 0.9671, hamProbability: 0.0329 },
    { word: 'service', spamProbability: 0.9436, hamProbability: 0.0564 },
    { word: '16', spamProbability: 0.9392, hamProbability: 0.0608 }
  ];

  onMount(() => {
    createChart();
  });

  function createChart() {
    const margin = { top: 20, right: 20, bottom: 60, left: 40 },
          width = 600 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    svg = d3.select("#chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
  }

  function handleWordChange(event, index) {
    selectedWords[index] = event.target.value;
    calculateNaiveBayes();
    updateChart();
  }

  function calculateNaiveBayes() {
    let p_words_given_spam = 1;
    let p_words_given_ham = 1;
    let selectedWordsFiltered = selectedWords.filter(word => word !== "");

    selectedWordsFiltered.forEach(word => {
      const wordData = data.find(d => d.word === word);
      p_words_given_spam *= wordData.spamProbability;
      p_words_given_ham *= wordData.hamProbability;
    });

    const total = p_words_given_spam + p_words_given_ham;
    naiveBayesResult.spam = p_words_given_spam / total;
    naiveBayesResult.ham = p_words_given_ham / total;
  }

  function updateChart() {
    // svg update
    d3.select("#chart svg").remove();

    const margin = { top: 20, right: 20, bottom: 60, left: 60 },
          width = 600 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

    // probability processing
    let chartData = selectedWords.filter(word => word).map(word => {
        let { spamProbability, hamProbability } = data.find(d => d.word === word);
        return { word, spamProbability, hamProbability };
    });

    // naive bayes results 
    chartData.push({
        word: 'Naive Bayes',
        spamProbability: naiveBayesResult.spam,
        hamProbability: naiveBayesResult.ham
    });

    // scales
    const xScale = d3.scaleBand()
                     .range([0, width])
                     .domain(chartData.map(d => d.word))
                     .padding(0.1);

    const yScale = d3.scaleLinear()
                     .domain([0, 1])
                     .range([height, 0]);

    // axes
    svg.append("g")
       .attr("transform", `translate(0,${height})`)
       .call(d3.axisBottom(xScale));

    svg.append("g")
       .call(d3.axisLeft(yScale));

    // word grouping
    const wordGroup = svg.selectAll(".word-group")
                         .data(chartData)
                         .enter().append("g")
                         .attr("class", "word-group")
                         .attr("transform", d => `translate(${xScale(d.word)},0)`);

    // spam bars
    wordGroup.append("rect")
             .attr("class", "spam-bar")
             .attr("x", 0)
             .attr("width", xScale.bandwidth() / 2)
             .attr("y", d => yScale(d.spamProbability))
             .attr("height", d => height - yScale(d.spamProbability))
             .attr("fill", "#d95f02");

    // ham bars
    wordGroup.append("rect")
             .attr("class", "ham-bar")
             .attr("x", xScale.bandwidth() / 2)
             .attr("width", xScale.bandwidth() / 2)
             .attr("y", d => yScale(d.hamProbability))
             .attr("height", d => height - yScale(d.hamProbability))
             .attr("fill", "#1b9e77");
}

</script>

<div class="word-selectors">
  {#each selectedWords as _, index}
    <div>
      <label for={`word-select-${index}`}>Word {index + 1}:</label>
      <select id={`word-select-${index}`} on:change={event => handleWordChange(event, index)}>
        <option value="">...</option>
        {#each data as { word }}
          <option value="{word}">{word}</option>
        {/each}
      </select>
    </div>
  {/each}
</div>

<div id="chart"></div>

<p>Naive Bayes Spam Probability: {naiveBayesResult.spam.toFixed(4)}</p> 
<p>Naive Bayes Ham Probability: {naiveBayesResult.ham.toFixed(4)}</p>

<style>
  .word-selectors {
    display: flex;
    justify-content: space-around; 
    align-items: center;
    padding: 20px 0; 
  }
</style>
