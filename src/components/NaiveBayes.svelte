<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  let svg;
  let data_to_chart = [];
  let selectedWords = ["", "", ""];
  let selectedRange = [-1, -1, -1];
  let naiveBayesResult = { spam: 0, ham: 0 };

  let ranges = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  let words = [
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

  let data = null;
  
  //needed by histogram binning
  $: x = d3.scaleLinear()
      .domain([0, 1])     
      .range([0, 1]);

  onMount(async () => {
    data = await d3.csv("tidif_counts.csv");
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

  function handleRangeChange(event, index) {
    selectedRange[index] = parseInt(event.target.value)
    calculateNaiveBayes();
    updateChart();
  }

  function calculateNaiveBayes() {
    let p_words_given_spam = 1;
    let p_words_given_ham = 1;
    let selectedWordsFiltered = selectedWords.filter(word => word !== "");

    console.log("fliter", selectedWordsFiltered)
    data_to_chart = selectedWordsFiltered.map((word, index) => {
      console.log(word)

      if (word == "") return ;

      if (selectedRange[index] == -1) {
        const wordData = words.find(d => d.word === word);
        console.log(wordData)
        p_words_given_spam *= wordData["spamProbability"];
        p_words_given_ham *= wordData["spamProbability"];
        console.log("success")
        return {
          "word": word, 
          "spamProbability": wordData["spamProbability"], 
          "hamProbability": wordData["spamProbability"]
        };
      }
      

      let bin_data = data.filter(function(d){ return (d[word] > 0)})

      let histogram = d3.histogram()
        .value(function(d) { return d[word]; })   
        .domain(x.domain())  
        .thresholds(x.ticks(10));

      let emails_in_range = histogram(bin_data)[selectedRange[index]]
      let total_range = emails_in_range.length
      let total_spam_in_range = emails_in_range.filter(function(d){ return (d.label == "spam")}).length
      let total_ham_in_range = emails_in_range.filter(function(d){ return (d.label == "ham")}).length
      
      
      p_words_given_spam *= total_spam_in_range/total_range;
      p_words_given_ham *= total_ham_in_range/total_range;

      console.log("range selected", total_ham_in_range, {
          "word": word, 
          "spamProbability":  total_spam_in_range/total_range, 
          "hamProbability": total_ham_in_range/total_range
        })
      return {
          "word": word, 
          "spamProbability":  total_spam_in_range/total_range, 
          "hamProbability": total_ham_in_range/total_range
        };
    });

    console.log("data to chart" , data_to_chart)

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
    let chartData = data_to_chart

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

//https://stackoverflow.com/questions/68992663/d3-round-number-from-nest-and-sum
//javascript why
function round(x, position) {
  return Math.round(x*(10**position))/(10**position)
}

</script>

<div class="word-selectors">
  {#each selectedWords as _, index}
    <div>
      <label for={`word-select-${index}`}>Word {index + 1}:</label>
      <select id={`word-select-${index}`} on:change={event => handleWordChange(event, index)}>
        <option value="">...</option>
        {#each words as { word }}
          <option value="{word}">{word}</option>
        {/each}
      </select>
    </div>
  {/each}
</div>
<div class="word-selectors">
  {#each selectedWords as _, index}
    <div>
      <label for={`word-select-${index}-range`}>range for Word {index + 1}:</label>
      <select id={`word-select-${index}-range`} on:change={event => handleRangeChange(event, index)}>
        <option value={-1}>no range</option>
        {#each ranges as range }
          <option value={range}>{round(range * 0.1, 1)} - {round((range + 1) * 0.1, 1)}</option>
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
