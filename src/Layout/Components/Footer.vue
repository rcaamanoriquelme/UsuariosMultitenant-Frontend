<template>
  <div class="app-footer">
    <div class="app-footer__inner">
      <div class="app-footer-left">
        <!-- <FooterDots /> -->
      </div>
      <div class="app-footer-right">
        <!-- <FooterMenu /> -->
        <FooterInfo />
      </div>
    </div>
  </div>
</template>

<script>

/* import FooterDots from "./Footer/FooterDots";
import FooterMenu from "./Footer/FooterMenu"; */
import FooterInfo from "./Footer/FooterInfo";

//import { library } from "@fortawesome/fontawesome-svg-core";
//import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

//library.add(faEllipsisV);
export default {
  name: "Footer",
  components: {
    FooterInfo,
    /* FooterDots,
    FooterMenu */
  }
};

</script>
