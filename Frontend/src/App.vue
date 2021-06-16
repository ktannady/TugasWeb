<template>
  <div id="app" class="container is-max-desktop">
    <router-link to="/" class="button is-link is-inverted mt-5"> Halaman Auth </router-link>
    &nbsp;
    <router-link to="/todo" class="button is-link is-inverted mt-5"> Halaman Todo </router-link>
    &nbsp;
    <router-link to="/user" class="button is-link is-inverted mt-5"> Halaman User </router-link>    
    <router-view />
  </div>
</template>
 
<script>
export default {
  name: "App",
};
</script>
 
<style>
/* import style bulma */
@import "~bulma/css/bulma.css";
</style>
