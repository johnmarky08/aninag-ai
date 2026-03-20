<script>
  import Header from "./Header.svelte";
  import { minimize } from "../../Utilities.js";

</script>

<div class="shadow rounded-[15px] ">
  <Header />
  <main
    class="py-5 px-6 z-[9999] border-2 bg-white rounded-[15px]
     rounded-t-none border-[#E5E7EB]"
  >
    <slot />
  </main>
</div>
