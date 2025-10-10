<template>
  <div id="app">
    <router-view /> <!-- Aquí se renderizan las vistas -->
    <SessionTimeout />
  </div>
</template>

<script>
import SessionTimeout from '@/components/SessionTimeout.vue'
export default {
  name: "App",
  components: {
    SessionTimeout
  }
};
</script>

<style >

</style>
