<script>
  import Scroller from "@sveltejs/svelte-scroller";
  let count, index, offset, progress;

</script>

<main>
  <h1>Svelte template</h1>

  <Scroller
  top={0.0}
  bottom={1}
  threshold={0.5}
  bind:count
  bind:index
  bind:offset
  bind:progress
>
  <div class="background" slot="background">

  </div>

  <div class="foreground" slot="foreground">
    <section>
      <h1>Introduction</h1>
      Introduce idea and dataset, do some eda to help user understand, introduce data transformation
    </section>
    <section>
      <h1>intutiton</h1>
      <p>
        Show the distrbutions of a given column
      </p>
      <h1>MLE</h1>
      <p>
        Why we need it to MLE 
      </p>
    </section>

    <section>Formula Baseline</section>
    <section>Interactive example with email spam (allow user to play with the embedding types, columns, data transofrmations etc)</section>
    <section>Variants _ Visualization</section>
    <section>Interactive example with email spam (allow user to play with the embedding types, columns, data transofrmations etc)</section>
    <section>Refrences</section>

  </div>
</Scroller>
</main>

<style>
  /* Write your CSS here */
</style>
