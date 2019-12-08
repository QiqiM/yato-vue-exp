<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <test01 />
  </div>
</template>

<script>
import test01 from './views/test/test01.vue'

export default {
  name: 'app',
  components: {
    test01
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
