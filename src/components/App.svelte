<script>
  import Scroller from "@sveltejs/svelte-scroller";
  import Tidif_hist from "./Tidif_hist.svelte";
  import EmailCloud from "./EmailCloud.svelte";
  import Email from "./Email.svelte";
  import { min } from "d3";
  import { onMount } from 'svelte';
  import BayesViz from './BayesViz.svelte';
  import NaiveBayes from "./NaiveBayes.svelte"
  import Point_Cloud_Demo from "./Point_Cloud_Demo.svelte";
  import MultiplyViz from "./multiplyViz.svelte";


 

  let count, index, offset, progress;
  let width, height;
  let word = "call"
  let uncommon_vis = false;
  let common_vis = false;
  let its_go_time = false
  let showBayesViz = false;


  onMount( async () => { 
 
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
  function change_opacity(opacity, upper_bound=18, lower_bound=13) {
    
    if (index > upper_bound) {
      let distance_to_upper = progress - ((upper_bound+1) / count) 

      return Math.max(1 - distance_to_upper * 20, 0)
    }
    else if (index < lower_bound) {
      //console.log(lower_bound, progress, (lower_bound-1) / count)
      let distance_to_lower = progress  - ((lower_bound-1) / count)
      distance_to_lower /= ((lower_bound) / count) - ((lower_bound-1) / count) 
      return Math.max(distance_to_lower + 0.5, 0) //Seemed needed to fix timing, maybe offset for index?
    } else {
      return 1
    }
  }
  let email_example_opacity = 0.3
  let point_opacity = 0.0
  let histogram_opacity = 0.0
  let no_prob = false;
  $: index, email_example_opacity  = index + offset - 0.5 - 6
  $: progress, histogram_opacity  =  change_opacity(histogram_opacity, 18, 14) //TODO REVERT
  $: progress, point_opacity  =  change_opacity(point_opacity, 31, 23)
  $: index, no_prob = index < 15;

  
  // Z Index Handler
  // recall larger value -> higher up
  let interactions = {
    "tf-idf histogram": 0,
    "tf-idf point cloud": 0,
    "pop up": 0,
    "rest of foreground": 1
  }

  function change_interactions(index, bayes_cond_enable=false)  {
      interactions = {
        "tf-idf histogram": 0,
        "tf-idf point cloud": 0,
        "pop up": 0,
        "rest of foreground": 1
      }
    if ((index <= 21) & (index > 12)) {
      interactions["tf-idf histogram"] = 100
    } else {
      interactions["tf-idf histogram"] = 0
    }

    if ((index <= 31) & (index > 21)) {
      interactions["tf-idf point cloud"] = 100
    } else {
      interactions["tf-idf point cloud"] = 0
    }

    if (!bayes_cond_enable)
      showBayesViz = (index <= 29) & (index > 28)

    if (showBayesViz) {
      interactions["pop up"] = 100
    } else {
      interactions["pop up"] = 0
    }


    
  }

  $: index, change_interactions(index);
  $: showBayesViz, change_interactions(index, true);


  //handle start popup disappearance
  let popup_class = "hide_issues temp"
  async function  hide_popup() {
    //https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
    await new Promise(r => setTimeout(r, 2000));
    
    if (index !== undefined) {
      popup_class = popup_class.replace("temp", "hide")
    }
    
  }
  $: index, hide_popup() 


  // let screen_y = 0.0
  // $: progress, screen_y = get_doc_height()*progress
    //<p>Writeup for the visualization can be found at <a href="https://docs.google.com/document/d/1eYTnn1gy2kM3kDWSwzwQsmsfhe2bzPJaR1SSIHHPOJs/edit?usp=sharing">here</a></p>
    //<p>Writeup for the visualization can be found at <a href="https://docs.google.com/document/d/1eYTnn1gy2kM3kDWSwzwQsmsfhe2bzPJaR1SSIHHPOJs/edit?usp=sharing">here</a></p>
</script>
<main>
  
  
  <div class={popup_class}>
    <h1 class="headerText" style="top: 45%; position: relative;"> 
      Please wait while site loads! Thank you for your time! </h1>
  </div>
  
  <!-- <div class="test_tidif">
    <Point_Cloud_Demo
      bind:word={word}
      bind:no_prob={no_prob} 
      class_name="test_tidif"  
      spam_split={true}/>
  </div> -->
  
  

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
    <!-- <div class="progress-bars">
      <p>TODO REMOVE</p>
      <p>current section: <strong>{index + 1}/{count}</strong></p>
      <progress value={count ? (index + 1) / count : 0} />

      <p>offset in current section</p>
      <progress value={offset || 0} />

      <p>total progress</p>
      <progress value={progress || 0} />
    </div> -->


    <div class="content">
      
      
      <!-- Putting this here temporarly while I fix it up! -->
      
      {#if (index < 10)}
        <EmailCloud frame={index} csv_path={"intro_vis.csv"} custom_class="content"/>
      {/if}
      <div style="opacity: {email_example_opacity}">
      {#if (index > 5) && (index < 8)}
            <h2  class="email_examples_headers" style="position: absolute; top: 10%;">
              Some messages contain words unique to a few number of messages.
            </h2>
          {/if}
          {#if (index >= 8) && (index < 10)}
            <h2  class="email_examples_headers" style="position: absolute; top: 10%;">
              Some of the words are commonly found in all messages.
            </h2>
          {/if}
          {#if (index >= 10) && (index < 12)}
            <h2  class="email_examples_headers" style="position: absolute; top: 10%;">
              TIDIF can measure how "unique" a word in a given message is compared to an entire document.
            </h2>
          {/if}

          {#if (index >= 12) && (index < 13)}
            <h2  class="email_examples_headers" style="position: absolute; top: 40%;">
              What happens if we plot a histogram of tidif values on a histogram?
            </h2>
          {/if}

          {#if (index >= 14) && (index < 15)}
            <h2  class="email_examples_headers" style="position: absolute; top: 2%;">
              The TIDIF values of words depends on if that word is in a spam email or not.
            </h2>
          {/if}
          {#if (index >= 15) && (index < 16)}
            <h2  class="email_examples_headers" style="position: absolute; top: 2%;">
              Note the probability of Spam Emails change as we create a threshold at some TF-IDF Value. (drag line to change)
            </h2>
          {/if}
          {#if (index >= 16) && (index < 17)}
            <h2  class="email_examples_headers" style="position: absolute; top: 2%;">
              Given we know the TF-IDF of a word in an email, the probability of the email being spam changes.
            </h2>
          {/if}
          {#if (index >= 17) && (index < 18)}
            <h2  class="email_examples_headers" style="position: absolute; top: 2%;">
              This is the idea of conditional probability, 
              based on some knowledge you have such as the tidif of a word like "{word}", then the probability of spam changes.
            </h2>
          {/if}
          {#if (index >= 18) && (index < 19)}
            <h2  class="email_examples_headers" style="position: absolute; top: 2%;">
              We denote this as: P(spam | {word}) or P(ham | {word})
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
          style="opacity: {histogram_opacity}; z-index: {interactions["tf-idf histogram"]};"
        >
          <Tidif_hist bind:no_prob={no_prob}  bind:word={word} class_name="interactables-histogram-a"/>
        </div>

        <div 
          class="interactables-histogram-a"
          style="opacity: {point_opacity}; z-index: {interactions["tf-idf point cloud"]};"
        > 
            {#if (index <= 24) & (index > 22)}
            <h2> This visualization shows the same TF-IDF data but instead each email is plotted on this table.</h2>
            {/if}
            {#if (index <= 25) & (index > 24)}
            <h2> First we can compute the probability of any email being spam as the number of spam emails divided by total emails.</h2>
            {/if}
            {#if (index <= 26) & (index > 25)}
            <h2> We can also compute the probability of if a given word in an email has a TF-IDF value in a given range. (Move the red bar around to change the probability!)</h2>
            {/if}
            {#if (index <= 27) & (index > 26)}
            <h2> Finally, we can see what probability of emails is both spam and in range. (try moving the bar to where there are a lot of spam emails)</h2>
            {/if}
            {#if (index <= 30) & (index > 28)}
            <h2> We can also compute conditional probability for spam emails given some TF-IDF range.</h2>
            {/if}
            {#if (index <= 32) & (index > 30)}
            <h2> We can also do the reverse: Given the email is spam, what is the probability it is in the red range?</h2>
            {/if}
            
            <div class="point_cloud">

              <button on:click="{() => showBayesViz = true}">Show BayesViz</button>
              {#if showBayesViz}
              <div class="bayesVizPopup" style="z-index: {interactions["pop up"]};">
                <BayesViz />
                <button on:click="{() => showBayesViz = false}">Close</button>
              </div>
              {/if}


              <Point_Cloud_Demo
                bind:word={word}
                bind:index={index} 
                class_name="point_cloud"
                spam_split={true}
                />
              <p>Click and drag the red region, we can compute probablities in that region</p>
          </div>
        </div>
      <!-- {/if} -->
  
    
    <div class="Foreground Sections!", style="z-index: {interactions["rest of foreground"]};">
    <section>
      <h1 class='headerText'>We get a lot of emails</h1>

      <p style="font-weight: 100;">scroll to read</p>
    </section>
    <section />
    <section />
    <section>
      <h1 class='headerText'>A LOT of emails</h1>
    </section>
    <section />
    <section>
      <h1 class='headerText'>And plently of it is Spam</h1>
    </section>
    <h1 class='headerText'>Is there anything we can do?</h1>
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
    <h1 class='headerText'>Given the TIDIF of a word, we can potentially get a good esimate of the probability its spam</h1>
    <section />
    <h1 class='headerText'>But what if we want to use mutliple words to find spam?</h1>
    <section />
    <h1 class='headerText'>Lets dive a bit deeper into how we compute probabilities!</h1>
  
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

    
    <section >
      <h1 class='headerText'>Bayes Rule</h1>
      <p class='basicText'> We have shown that $P(S|R) = P(S \cup R)/P(R)$ and $P(R|S) = P(S \cup R)/P(S)$. </p>
      <p class='basicText'> Notice they both have $P(S \cup R)$ in the equation! </p>
      <p class='basicText'> We can therefore rewrite it to make them equal each other! </p>
      <p class='basicText'>
         $$P(R|S) = P(S \cup R)/P(S) \rightarrow P(R|S)P(S)= P(S \cup R)$$ 
         $$P(S|R) = P(S \cup R)/P(R) \rightarrow P(S|R) = P(R|S)P(S)/P(R)$$

          This is known as Bayes Theorem. It means we can compute $P(S|R)$ by instead solving for $P(R|S)P(S)/P(R)$. 
          
          And the best part is this allows us to consider the probability of spam given the TF-IDF ranges of mutliple words!

          I.E. we can solve $P(S|R_1, R_2, .... R_n)$ for n ranges of n diffrent words.
      
          To do this, we have to understand an idea called independence and how it affects our probablities. 
      </p>     
    </section>
    <section>
        <h1 class='headerText'> Aside Independence </h1>
      <img src="no_indepedence.gif">
      </section>

    <section>
      
      <img src="indepedence.gif">

      <p class='basicText'> The idea here is by assuming independence without probablities, then given some information, the probability remains unchanged. </p>  
      <p class='basicText'> So with independence, {`$P(\\text{A | B}) = P(A)$`} </p>  
      <p class='basicText'> So with independence, {`$P(\\text{A | B}) = P(A)$`} </p>  
      
      <p class='basicText'>It also means that the probablities of P(A and B) are equal to P(A)P(B)</p>
      <p class='basicText'>Take a look below for why! </p>
    </section>

    <section>
      <div class='foreground'>
        <h3 class='smallerheaderText'>P(A and B) = P(A)P(B) </h3>
        <MultiplyViz/>

        <p class='basicText'> As you can see, knowing A occured doesn't mean B occurs and vice versa because A and B are independent. This means we can simply multiply their probablities.</p>
      </div>

      <p>
      So given this information, let's naively assume that the TF-IDF values of each word are independenent (This is the naive bit of Naive Bayes).

      Now for math!

      Suppose we want to solve $P(S|R_1, R_2, .... R_n)$. Recall that $P(S|R) = P(R|S)P(S)/P(R)$. Therefore:

      $$P(S|R_1, R_2, .... R_n) = P(R_1, R_2, .... R_n|S)P(S)/P(R_1, R_2, .... R_n)$$.

      Let's break this down a bit more. Since we assume independence with respect to each range, then $P(R_1, R_2, .... R_n) = P(R_1)P(R_2)...P(R_n)$.

      Furthermore with independence we are also able to say $P(R_1, R_2, .... R_n|S) = P(R_1|S)P(R_2|S)...P(R_n|S)$.

      All together we have  
      
      {@html `$$P(S|R_1, R_2, .... R_n) = \\frac{P(R_1|S)P(R_2|S)...P(R_n|S)P(S)}{P(R_1)P(R_2)...P(R_n)}$$`}
    </p>
    </section>    
    
    <section>
      <br/>
      <br/>
      <br/>
      <h2 class="headerText">THIS IS THE DEFINITION OF NAIVE BAYES!!!!</h2>
    <p class = 'basicText'>
      We have already shown that for any given range of TF-IDF values for a given word we can find $P(R_i|S)$ and $P(R_i|S)$ simply by looking at the data!


      With these tools together we can take a list of words and the TF-IDF ranges for each word in a given example and get the probability that word is spam!

      So lets implement Naive Bayes!
    </p>
      <div class="foreground" style="width: 100%;">
        <NaiveBayes/>
        <p class='basicText'> After calculations, Naive Bayes simply predicts the class with a higher probability!</p>
      </div>
    </section>
    

    <section/>
    <section>
      <h1 class='headerText'>
      Conclusion and Takeaways
      </h1>

      <p class="basicText">
       Spam classification was one of the first applications of Naive Bayes. Hopefully now you can see why. 

      </p><p class="basicText">
       First we talked about how useful probabilities can be to threshold our TF-IDF values for spam and ham emails and filter out emails if we know what the TF-IDF value of a given word can be.
       This was done by allowing you to see the probabilities on the left and right side of the red threshold bar for ham and spam helping motivating using probability to solve the problem.
      </p><p class="basicText">
       Without needing any complicated machine learning techinques and just simply binning the data together in histograms, 
       you can determine the empirical probablities of spam emails given a range of TF-IDF values. You have seen from our point cloud visualizations how we can determine the probablities for 
       $P(S), P(R), {`P(\\text{S and R})`}$ and $P(R|S)$ by highlighting how we slowly reduce our event space given what we are trying to find the probability of.
      </p><p class="basicText">
      You can also understand with our independence animations, showing how probabilties and finding the intersections of events are impacted by how dependent two events are to each other and why we are able to freely mutliply our probabltiies. By assuming independence, we are allowing Naive Bayes to really shine by considering the TF-IDF values of many words!
    </p><p class="basicText">
      Then once you have the foundations, we introduced Naive Bayes working in practice giving you a chance to experiment and see how changing how "common" a word is in a given document can change the odds the email is spam or not.
      This could help show how some spam detectors potentially work in practice!
    </p><p class="basicText">
      All this is to show that binary classification, the act of identifying if something falls into one of two categories, is really a matter of getting the probability that input falls into a given class. 
      This example is nice because it shows how useful the fundamental ideas of probability are to machine learning, a field frequently dominated by complicated machine learning algorithms, fancy marketing, and hype.
    </p><p class="basicText">
      So despite these complicated problems like email spam detection, as you have seen, at the end of the day its just probability and fundamental mathematics. Nothing more, nothing less.  
      </p>


      <h2 class="headerText"> Refrences </h2>
      <p> DSC 140a</p>
      <p><a href="https://en.wikipedia.org/wiki/Naive_Bayes_classifier">Naive Bayes Wikipedia Page<a> </p>
      <p>Writeup for the visualization can be found at <a href="https://docs.google.com/document/d/1eYTnn1gy2kM3kDWSwzwQsmsfhe2bzPJaR1SSIHHPOJs/edit?usp=sharing">here</a></p>
    </section>
    <br/>
    <br/>
    <br/>
    <br/>
  </div>
  </div>
</Scroller>
</main>


<style>
  .background {
    width: 100%;
    height: 100vh;
    position: relative;
    /* outline: green solid 3px; */
  }

  .foreground {
    width: 50%;
    margin: 0 auto;
    height: auto;
    position: relative;
    /* outline: red solid 3px; */
  }

  .progress-bars {
    position: absolute;
    right: 0;
    /* background: rgba(170, 51, 120, 0.2)   40% opaque ; */
    visibility: visible;
  }

  section {
    height: 80vh;
    /* background-color: rgba(0, 0, 0, 0.2); 20% opaque */
    /* color: white; */
    /* outline: magenta solid 3px; */
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
    font-size: 18px;
  }

  .email_examples_headers{
    position: absolute;
    margin-left: 31%;
    margin-right: 25%;
    width: 43%;
    text-align: center;
    align-items: center;
    font-size: 25px;
  }

  .common_words{
    color:black;
    font-size: 18px;
  }

  .common_words.visible{
    color: blue;
    font-weight: bold;
    font-size: 20px;
  }

  .uncommon_words{
    color:black;
    font-size: 20px;
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

  .headerText{
    font-family: 'Montserrat', sans-serif;
    color: #121212;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    transition: color 0.3s ease;
    font-size: 40px;
  }

  .smallerheaderText{
    font-family: 'Montserrat', sans-serif;
    color: #121212;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    transition: color 0.3s ease;
    font-size: 30px;
  }

  .basicText{
    font-family: 'Roboto', 'sans-serif';
    color: #000000;
    line-height: 1.6;
    font-size: 17px;
  }

  .bayesVizPopup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  }

  img {
    position: relative;
    left: 0;
    width: 100%;
  }

  .hide_issues {
    position: fixed;
    width: 100%;
    height: 100%;
    text-align: center;
    /* align-items: center; */
    z-index: 100;
    opacity: 100;
    background: lightgrey;
  }
  .hide_issues.hide {
    position: fixed;
    width: 100%;
    height: 100%;
    text-align: center;
    /* align-items: center; */
    background: lightgrey;
    z-index: 0;
    opacity: 0;
    transition: opacity 3s;
    
  }

</style>

