<template>
  <div class="home">
    <p>
      <rotate-box :key="this.$store.state.rotateBoxResetKey"></rotate-box>
    </p>
    <textarea v-model="message" placeholder="シェーダーにメッセージをこめよう！"></textarea>
    <p>
      <Octgrams></Octgrams>
    </p>
    <p>
      <UploadFile @setMessage="setMessage"></UploadFile>
    </p>
    <li>
      <a class='twitter' :href="this.$store.state.twitterUrl" target ="_blank"><img src="../../src/assets/twitter.png"></a>
    </li>
  </div>
</template>

<script>
import Octgrams from './Octgrams.vue'
import UploadFile from './UploadFile.vue'
import RotateBox from './RotateBox.vue'

export default {
  name: 'Home',
  components: {
    Octgrams,
    UploadFile,
    RotateBox
  },
  computed: {
    message: {
      get () { return this.$store.state.message },
      // TODO: 一緒にmessage以外もsetしているが密結合な感じがして不安
      set (val) {
        this.$store.commit('setMessage', val)
        var chars = val.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\s\S]/g) || []
        var points = []
        var pointsTotal = 0
        for (var i = 0; i < chars.length; ++i) {
          points.push(chars[i].codePointAt(0))
          pointsTotal += chars[i].codePointAt(0)
        }
        this.$store.commit('setUnicodePoints', points)
        this.$store.commit('setRWeight', this.surplusTwoFiveFive(pointsTotal, 3, -3))
        this.$store.commit('setGWeight', this.surplusTwoFiveFive(pointsTotal, 4, -4))
        this.$store.commit('setBWeight', this.surplusTwoFiveFive(pointsTotal, 5, -5))
        this.$store.commit('setTwitterUrl', this.createTwitterUrl())
        this.$store.commit('incrementRotateBoxResetKey')
      }
    }
  },
  methods: {
    surplusTwoFiveFive: function (number, minimumDigits, startIndex) {
      return parseInt(number.toString().substr(startIndex)) % 255
    },
    setMessage: function (val) {
      this.message = val
    },
    createTwitterUrl: function () {
      return 'https://twitter.com/intent/tweet?text=test'
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
img.twitter {
  width: 3em;
  height: 3em;
}
</style>
