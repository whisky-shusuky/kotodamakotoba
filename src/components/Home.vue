<template>
  <div class="home">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <input v-model="message" placeholder="edit me">
    <p>Message is: {{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      message: ''
    }
  }
}

// unicodeの位置が配列で出力される(10進数)
// https://note.kiriukun.com/entry/20180925-charcodeat-vs-codepointat
// Array(8)
// 0: 65
// 1: 66
// 2: 12354
// 3: 12356
// 4: 127813
// 5: 128036
// 6: 33
// 7: 127765
// length: 8
var chars = 'ABあい🍅🐤!🌕'.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\s\S]/g) || []
var points = []
for (var i = 0; i < chars.length; ++i) {
  points.push(chars[i].codePointAt(0))
}
console.log('codePointAt() => ', points)
var decodeResult = []
for (var j = 0; j < points.length; ++j) {
  decodeResult.push(String.fromCodePoint(points[j]))
}
console.log(decodeResult)
console.log(decodeResult.join(''))
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
