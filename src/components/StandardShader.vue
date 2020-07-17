<template>
  <a id="getLocal" href="#" v-on:click="downloadText()">ダウンロードしてね</a>
</template>

<script>
export default {
  name: 'StandardShader',
  computed: {
    unicodePoints: function () {
      var chars = this.$store.state.message.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\s\S]/g) || []
      var points = []
      for (var i = 0; i < chars.length; ++i) {
        points.push(chars[i].codePointAt(0))
      }
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
      var string = this.constructBody()
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
    },
    constructBody: function () {
      return `
head
  unicode points are ${this.unicodePoints}!
  unicode points number is ${this.unicodePoints.length}!
last
`
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
