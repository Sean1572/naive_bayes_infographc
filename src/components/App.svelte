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
    <section>test</section>

  </div>
</Scroller>
</main>

<style>
  /* Write your CSS here */
</style>
