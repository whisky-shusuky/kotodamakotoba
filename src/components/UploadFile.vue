<template>
  <div id="upload" class="form-group commonStyle" v-bind:class="{'styleA':styleA, 'styleB':styleB}" @dragover.prevent="changeStyle($event,'ok')" @dragleave.prevent="changeStyle($event,'no')" @drop.prevent="uploadFile($event)">
    <label for="upload_image" class="button">
    <p>シェーダーをドラッグ＆ドロップしてメッセージを読み取ろう！</p>
    <input id="upload_image" type="file" name="img" @change="uploadFile($event)" style="display:none;" accept="image/*">
    </label>
    <div v-show="preview">
      <p>
        このシェーダーに込められたメッセージは
      </p>
      <p>
        {{this.$store.state.message}}
      </p>
      <p>
        です！
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      preview: '',
      name: '',
      givenMessage: '',
      styleA: true,
      styleB: false
    }
  },
  methods: {
    uploadFile: function (event) {
      this.styleA = true
      this.styleB = false
      const files = event.target.files ? event.target.files : event.dataTransfer.files
      const file = files[0]
      const reader = new FileReader()
      reader.onload = event => {
        this.preview = event.target.result

        var lines = reader.result.split('\n')
        var numLines = lines.length
        var unicodePoints = ''
        // TODO: むりやりパースしてシェーダーに書き込んだユニコード位置を抽出しているけどもうちょっときれいに書けそう。
        var variablePattern = /unicode_points/
        for (var i = 0; i < numLines; i++) {
          var line = lines[i]
          if (line.match(variablePattern)) {
            unicodePoints = line
          }
        }
        var unicodesPattern = /\{.+?\}/
        var unicodes = unicodePoints.match(unicodesPattern)
        this.$emit('setMessage', this.decodeUnicodes(unicodes[0].replace(/\{|\}/g, '').split(',')))
      }
      reader.readAsText(file)
      this.name = files[0].name
      document.getElementById('upload_image').files = files
    },
    decodeUnicodes: function (unicodesPoints) {
      var result = []
      for (var j = 0; j < unicodesPoints.length; ++j) {
        result.push(String.fromCodePoint(unicodesPoints[j]))
      }
      return result.join('')
    },
    changeStyle: function (event, flag) {
      if (flag === 'ok') {
        this.styleA = false
        this.styleB = true
      } else {
        this.styleA = true
        this.styleB = false
      }
    }
  }
}

</script>

<style scoped>
  .commonStyle{ padding:30px; text-align:center; margin:30px;}
  .styleA{border:3px dotted gray;}
  .styleB{border:3px dotted rgba(0,200,0,0.7);}
  .button{border:1px solid green; padding:3px; border-radius:5px; background-color:white;}
  .button p {color:green; margin-top:10px; margin-left:10px; margin-right: 10px;}
</style>
