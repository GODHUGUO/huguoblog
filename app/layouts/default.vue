<!-- app/layouts/default.vue -->
<template>
  <div class="flex flex-col min-h-screen">
    
    <!-- Header commun à toutes les pages -->
   <header_blog/>
      <slot />  
   <footer_blog/>
    
  </div>
</template>

<script setup>

import header_blog from '~/components/header_blog.vue';
import footer_blog from '~/components/footer_blog.vue';

</script>