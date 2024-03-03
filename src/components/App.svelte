<script>
  import Scroller from "@sveltejs/svelte-scroller";
  import Tidif_hist from "./Tidif_hist.svelte";
  import EmailCloud from "./EmailCloud.svelte";
  import Email from "./Email.svelte";
  import BayesViz from './BayesViz.svelte';

  let count, index, offset, progress;
  let width, height;
  let word = "call"
  let uncommon_vis = false;
  let common_vis = false;
  //Handle un/common words
  function update_words() {
    
    uncommon_vis = ((index > 5) && (index < 8));
    common_vis = ((index >= 8) && (index < 10));
    
  }
  $: index, update_words();

  $: index, console.log(index);



</script>

<main>
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
      <p>Writeup for the visualization can be found at <a href="https://docs.google.com/document/d/1eYTnn1gy2kM3kDWSwzwQsmsfhe2bzPJaR1SSIHHPOJs/edit?usp=sharing">here</a></p>
      
      <!-- Putting this here temporarly while I fix it up! -->
      
      
      <EmailCloud frame={index}/>


      {#if (index > 5) && (index < 8)}
            <h2  class="email_examples" style="position: absolute; top: 10%;">
              some messages contain words unique to a few number of messages
            </h2>
          {/if}
          {#if (index >= 8) && (index < 10)}
            <h2  class="email_examples" style="position: absolute; top: 10%;">
              Some of the words are commonly found in all messages
            </h2>
          {/if}
          {#if (index >= 10) && (index < 12)}
            <h2  class="email_examples" style="position: absolute; top: 10%;">
              TIDIF can measure how "unique" a word in a given message is compared to an entire document
            </h2>
          {/if}

          {#if (index >= 12) && (index < 13)}
            <h2  class="email_examples" style="position: absolute; top: 40%;">
              What happens if we plot a histogram of tidif values on a histogram?
            </h2>
          {/if}

          {#if (index >= 14) && (index < 15)}
            <h2  class="email_examples" style="position: absolute; top: 40%;">
              You can see that spam emails have diffrent tidif values than ham words.

              This means the probablity of emails is diffrent if you know what the tidif values it's words have

              How can we use this in the context of classification?
            </h2>
          {/if}
      {#if (index > 5) && (index < 12)}
        <div>
            <p 
              class="email_examples"
              style="top: 19%;"
            >
              <span class="uncommon_words" class:visible={uncommon_vis}>"URGENT!</span> <span class="common_words" class:visible={common_vis}>You</span> have won a 1 week FREE membership in our �100,000 Prize Jackpot! Txt the word:  <span class="uncommon_words" class:visible={uncommon_vis}>CLAIM</span> to No: 81010 T&C www.dbuk.net LCCLTD POBOX 4403LDNW1A7RW18"
            </p>
            <p 
              class="email_examples"
              style="top: 31%;"
            >
              "<span class="uncommon_words" class:visible={uncommon_vis}>Urgent</span> UR awarded a complimentary trip to EuroDisinc Trav, Aco&Entry41 Or �1000. To <span class="uncommon_words" class:visible={uncommon_vis}>claim</span> txt DIS to 87121 18+6*�1.50(moreFrmMob. ShrAcomOrSglSuplt)10, LS1 3AJ"
            </p>
            <p 
              class="email_examples"
              style="top: 42%;"
            >
            I've been searching for the right words to thank <span class="common_words" class:visible={common_vis}>you</span> for this breather. I promise i wont take your help for granted and will fulfil my promise. <span class="common_words" class:visible={common_vis}>You</span> have been wonderful and a blessing at all times
            </p>
            <p 
              class="email_examples"
              style="top: 53%;"
            >
            "Oops, I'll let <span class="common_words" class:visible={common_vis}>you</span> know when my roommate's done"
            </p>
            <p 
              class="email_examples"
              style="top: 64%;"
            >
            "Yeah hopefully, if tyler can't do it I could maybe ask around a bit"
            </p>
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

      
    <section>
      Consider emails
      
      <Tidif_hist bind:word={word} class="intro_tidif"/>
      
    </section>


    <section />


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

  .email_examples{
    position: absolute;
    margin-left: 31%;
    margin-right: 25%;
    width: 43%;
    text-align: center;
    align-items: center;
  }

  .common_words{
    color:black;
  }

  .common_words.visible{
    color: blue;
    font-weight: bold;
  }

  .uncommon_words{
    color:black;
  }

  .uncommon_words.visible{
    color: orange;
    font-weight: bold;
  }
</style>

