<script>
  import Scroller from "@sveltejs/svelte-scroller";
  import Tidif_hist from "./Tidif_hist.svelte";
  import EmailCloud from "./EmailCloud.svelte";
  import Email from "./Email.svelte";
  import { min } from "d3";
  import { onMount } from 'svelte';
  import BayesViz from './BayesViz.svelte';
  import BayesGauss from './BayesGauss.svelte'
  import GuassVis from "./GuassVis.svelte";

 

  let count, index, offset, progress;
  let width, height;
  let word = "call"
  let uncommon_vis = false;
  let common_vis = false;
  let its_go_time = false

  onMount( async () => { 
    console.log("hello?")
    its_go_time = true;

  })

  //Handle un/common words
  function update_words() {
    
    uncommon_vis = ((index > 5) && (index < 8));
    common_vis = ((index >= 8) && (index < 10));
    
  }
  $: index, update_words();

  //https://javascript.plainenglish.io/how-to-get-the-height-of-the-entire-document-with-javascript-199a7e0a8299
  // function get_doc_height() {

  //   if (!its_go_time) {
  //     return 0.0
  //   }
  //   try {
  //     const body = document.body;
  //     const html = document.documentElement;
  //     const height = Math.max(body.scrollHeight, body.offsetHeight,
  //       html.clientHeight, html.scrollHeight, html.offsetHeight);
  //     console.log(height) 
  //     return height
  //   } catch (error) {
  //     return 0.0
  //   }
    
    
  // }
 
  // As you approch the bounds, it start changing the opacity
  function change_opacity(opacity, upper_bound=14, lower_bound=13) {
    if (index > upper_bound) {
      let distance_to_upper = ((upper_bound+1) / count) - progress
      distance_to_upper /= ((upper_bound+1) / count) - ((upper_bound) / count)
      return Math.max(distance_to_upper + 0.5, 0)
    }
    else if (index < lower_bound) {
      let distance_to_lower = progress  - ((lower_bound-1) / count)
      distance_to_lower /= ((lower_bound) / count) - ((lower_bound-1) / count) 
      return Math.max(distance_to_lower + 0.5, 0) //Seemed needed to fix timing, maybe offset for index?
    } else {
      return 1
    }
  }
  let email_example_opacity = 0.3
  let histogram_opacity = 0.0
  $: index, email_example_opacity  = index + offset - 0.5 - 6
  $: progress, histogram_opacity  =  change_opacity(histogram_opacity, 14)

  //$: progress, console.log(window.screen)
  
  // let screen_y = 0.0
  // $: progress, screen_y = get_doc_height()*progress
    //<p>Writeup for the visualization can be found at <a href="https://docs.google.com/document/d/1eYTnn1gy2kM3kDWSwzwQsmsfhe2bzPJaR1SSIHHPOJs/edit?usp=sharing">here</a></p>
    //<p>Writeup for the visualization can be found at <a href="https://docs.google.com/document/d/1eYTnn1gy2kM3kDWSwzwQsmsfhe2bzPJaR1SSIHHPOJs/edit?usp=sharing">here</a></p>
</script>
 
<main>
  
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
      
      
      <!-- Putting this here temporarly while I fix it up! -->
      
      {#if (index < 10)}
        <EmailCloud frame={index} csv_path={"intro_vis.csv"} custom_class="content"/>
      {/if}
      <div style="opacity: {email_example_opacity}">
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
            <h2  class="email_examples" style="position: absolute; top: 2%;">
              The TIDIF values of words depends on if that word is in a spam email or not
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

  </div>

  <div class="foreground" slot="foreground">
    
      <!-- {#if (index < 25 ) && (index < 16)} -->

        <div 
          class="interactables-histogram-a"
          style="opacity: {histogram_opacity}"
        >
          <Tidif_hist bind:word={word} class_name="interactables-histogram-a"/>
        </div>
      <!-- {/if} -->
  
    
    
    <section>
      <h1>We get a lot of emails</h1>

      <p style="font-weight: 100;">scroll to read</p>
    </section>
    <section />
    <section />
    <section>
      <h1>A LOT of emails</h1>
    </section>
    <section />
    <section>
      <h1>And plently of it is Spam</h1>
    </section>
    <h1>Is there anything we can do?</h1>
    <section />
    <section />
    <section />
    <section />
    <section />
    <section />
    <section />

      
    <section>
    </section>
    <section />

    <section />
    <section>
      <h1>Formula Baseline</h1>
      <p> Conditional probablities: Given some information, the probabaltiy of an event changes </p>
      
      <img src="conditional_explaination_1.png">

      <p> 
        But what happens if we want to consider more than one word? 
        How do we compute the probablity of spam given the tidifs of a collection of words 
      </p>
      
      

      

     </section>
     <section>
      <p> 
        P(class=spam | word_tf-idf=x) = P(spam | words): given a list of TF-IDF values from words, what is the probablity of the class being spam
      </p>
      <img src="Thomas_Bayes.gif">
      <p> 
        SOLUTION: BAYES THEORM
        P(spam | words) = P(spam) * P(words | spam)/p(words):
      </p>
      <p> 
        Lets break this down!
      </p>
    </section>
      <section>

     
      <h1>P(spam) = # spam / total emails</h1>

      {#if (index > 10)}
        <div class="spam_prob" style="width: 60%; margin: auto;">
        <EmailCloud 
          frame={1} 
          csv_path="spam_probablity.csv", 
          exit_opacity={1.0},
          custom_class="spam_prob"/>
        </div>
      {/if}
      
      <p>How likely is the class to exist?</p>

      <h1>P(words) = frequency of the obsreved TF-IDF for each word</h1>

      <div 
        class="interactables-histogram-b"
       
      >
        <Tidif_hist bind:word={word} class_name="interactables-histogram-b"  spam_split={false}/>
      </div>
     
    </section>
    <section>
    </section>
    <h1> P(words | class) </h1>
      <img src="conditional_explaination_2.png">
      <p>knowing what the class is changes the probablity we would see the word</p>
      <p>This however, allows us to expand this to consider the probablity of more than one word!</p>

      <section>
        <h1> Aside Indepdence </h1>
      <img src="no_indepedence.gif">
      </section>
   
      <section>
      
      
      <img src="indepedence.gif">
      <p>If the TF-IDF values are not indepdenent it implies that the probablitys of the TF-IDF of urgent are influnced by the word free</p>
      <p style="font-weight: bold;">Naive Bayes Assumes (Naively) Indepdence!</p>
      <p>TODO ADD VISUALIZATION FOR THIS SPEFIFIC BIT Therefore P(words | class) = P(word 1 | class)P(word 2 | class)P(word 3 | class) ...</p>
      <p>Notation $PIP(word i | class)$ = P(word 1 | class)P(word 2 | class)P(word 3 | class) ...</p>
    </section>

    

    <section>
      <h1>Formula Revisted</h1>
      <p>P(spam | words) = P(spam) * P(words | spam)/p(words)</p>
      <BayesViz/>
    </section>
    <section>
    <div class="foreground">
      <BayesGauss/>
      <GuassVis/>
    </div>
    </section>

    <section/>
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
    min-width: 750px;  /* adjust at will */
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

  .interactables {
    width: 100%;
    position: fixed; 
    min-width: 750px; 
    margin: auto; 
    height: 90%;
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

  .interactables-histogram-b{
    position: relative;
    
  }

  .interactables-histogram-a{
    position: fixed;
    top:0;
    bottom: 0;
    margin: auto;
    margin-top: auto;
    width: 100%;
    height: max-content;
    
    
  }

</style>

