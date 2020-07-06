<template>
  <div class="home">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <input v-model="message" placeholder="edit me">
    <p>Message is: {{ this.unicodePoints }}</p>
    <p>Message is: {{ this.decodedUnicodes }}</p>
    <a id="getLocal" href="#" v-on:click="downloadText()">ダウンロードしてね</a>
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
  },
  computed: {
    unicodePoints: function () {
      var chars = this.message.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\s\S]/g) || []
      var points = []
      for (var i = 0; i < chars.length; ++i) {
        points.push(chars[i].codePointAt(0))
      }
      console.log(points)
      return points
    },
    decodedUnicodes: function () {
      var result = []
      for (var j = 0; j < this.unicodePoints.length; ++j) {
        result.push(String.fromCodePoint(this.unicodePoints[j]))
      }
      return result.join('')
    }
  },
  methods: {
    downloadText: function () {
      var string = 'ダウンロードできたかな？'
      var title = 'testfile.txt'
      var blobType = 'text/plain'
      var linkTagId = 'getLocal'
      var linkTag = document.getElementById(linkTagId)
      var linkTagAttr = ['href', 'download']
      var stringObject = new Blob([string], { type: blobType })
      var objectURL = window.URL.createObjectURL(stringObject)
      var UA = window.navigator.userAgent.toLowerCase()
      if (UA.indexOf('msie') !== -1 || UA.indexOf('trident') !== -1) {
        window.navigator.msSaveOrOpenBlob(stringObject, title)
      } else {
        linkTag.setAttribute(linkTagAttr[0], objectURL)
        linkTag.setAttribute(linkTagAttr[1], title)
      }
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
