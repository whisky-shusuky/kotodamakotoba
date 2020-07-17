<template>
  <div class="home">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <input v-model="message" placeholder="edit me">
    <p>
      <StandardShader></StandardShader>
    </p>
  </div>
</template>

<script>
import StandardShader from './StandardShader.vue'

export default {
  name: 'Home',
  components: {
    StandardShader
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  computed: {
    message: {
      get () { return this.$store.state.message },
      set (val) { this.$store.commit('setMessage', val) }
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
