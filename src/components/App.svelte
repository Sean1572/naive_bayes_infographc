<script>
  import Scroller from "@sveltejs/svelte-scroller";
  import Tidif_hist from "./Tidif_hist.svelte";
  import BayesViz from './BayesViz.svelte';

  let count, index, offset, progress;
  let width, height;
  let word = "call"
</script>

<main>
  <h1>Svelte template</h1>
  <p>Writeup for the visualization can be found at <a href="https://docs.google.com/document/d/1eYTnn1gy2kM3kDWSwzwQsmsfhe2bzPJaR1SSIHHPOJs/edit?usp=sharing">here</a></p>

  <Scroller
    top={0.0}
    bottom={1}
    threshold={0.5}
    bind:count
    bind:index
    bind:offset
    bind:progress
>
  

  <div class="background" slot="background"
    bind:clientWidth={width}
    bind:clientHeight={height}
  >
    <div class="progress-bars">
      <p>TODO REMOVE</p>
      <p>current section: <strong>{index + 1}/{count}</strong></p>
      <progress value={count ? (index + 1) / count : 0} />

      <p>offset in current section</p>
      <progress value={offset || 0} />

      <p>total progress</p>
      <progress value={progress || 0} />
    </div>


    <div class="content">
      {#if index < 2}
        <h1>Introduction</h1>
        One of the famous classical examples of machine learning is naive bayes, today we will explain how it works
        
      {/if}
      {#if (index >= 2) && (index < 4)}
        Consider emails
      {/if}
      {#if (index >= 4) && (index < 5)}
        <div>
        <p>Some of it is "ham" or normal emails</p>
        {#if (index >= 5) && (index < 5)}
          Hello! How's you and how did saturday go? I was just texting to see if you'd decided to do anything tomo. Not that i'm trying to invite myself or anything!
        {/if}
        </div>
      {/if}
      {#if (index >= 5) && (index < 7)}
        <div>
        <p>Of course plently of it is annoying spam</p>
        {#if (index >= 7) && (index < 7)}
        "URGENT! You have won a 1 week FREE membership in our �100,000 Prize Jackpot! Txt the word: CLAIM to No: 81010 T&C www.dbuk.net LCCLTD POBOX 4403LDNW1A7RW18"
        {/if}
        </div>
      {/if}
    </div>

  </div>

  <div class="foreground" slot="foreground">
    <section />
    <section />
    <section />
    <section />
    <section />
    <section />
    <section />
    <section />
    <section />
    <section />
    <section />
    <section />
    <section />
    <section />
    <section />
      
    <section>
      Consider emails
      
      <Tidif_hist bind:word={word}/>
      <h1>intutiton</h1>
      <p>
        Show the distrbutions of a given column
      </p>
      <h1>MLE</h1>
      <p>
        Why we need it to MLE 
      </p>
    </section>

    <section>
      <h1>Formula Baseline</h1>
    </section>


    <section>Interactive example with email spam (allow user to play with the embedding types, columns, data transofrmations etc)</section>
    <section>Variants _ Visualization</section>
    <section>Interactive example with email spam (allow user to play with the embedding types, columns, data transofrmations etc)</section>
    <section>Refrences</section>

  </div>
</Scroller>
</main>


<style>
  .background {
    width: 100%;
    height: 100vh;
    position: relative;
    outline: green solid 3px;
  }

  .foreground {
    width: 50%;
    margin: 0 auto;
    height: auto;
    position: relative;
    outline: red solid 3px;
  }

  .progress-bars {
    position: absolute;
    right: 0;
    background: rgba(170, 51, 120, 0.2) /*  40% opaque */;
    visibility: visible;
  }

  section {
    height: 80vh;
    background-color: rgba(0, 0, 0, 0.2); /* 20% opaque */
    /* color: white; */
    outline: magenta solid 3px;
    text-align: center;
    max-width: 750px; /* adjust at will */
    color: black;
    padding: 1em;
    margin: 0 0 2em 0;
  }

  .content {
    width: 100%;
    height: 100vh; /* check problem when setting width */
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    margin-top: auto;
    margin-bottom: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    text-align: center;
  }
</style>

