<template>
  <a id="getLocal" href="#" v-on:click="downloadText()">ダウンロードしてね</a>
</template>

<script>
export default {
  name: 'Octgrams',
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
      var title = 'Octgrams.shader'
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
Shader "Custom/Octagrams" {
  Properties {
  }
  SubShader {
    Tags { "RenderType"="Opaque" }
    LOD 200
    cull off

    Pass
    {
      CGPROGRAM
      // Physically based Standard lighting model, and enable shadows on all light types
      #pragma vertex vert_img
      #pragma fragment frag
      // Use shader model 3.0 target, to get nicer looking lighting
      #pragma target 3.0

      #include "UnityCG.cginc"

      //float time = _Time * 30;
      float gTime = 0.;

      float box(fixed2 uv, float size) {
        fixed2 rect = step(-size, uv) * (1.0 - step(size, uv));
        return min(rect.x, rect.y);
      }

      float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
        return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
      }

      // s だけ中心座標を移動
      float sdMvBox(float3 p, float s) {
        p = abs(p) - s;
        return max(max(p.x, p.y), p.z);
      }

      // 回転行列
      float2x2 rot(float a) {
        float c = cos(a), s = sin(a);
        return float2x2(c,s,-s,c);
      }

      float sdBox( fixed3 p, fixed3 b )
      {
        fixed3 q = abs(p) - b;
        return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
      }

      float box(fixed3 pos, float scale) {
        pos *= scale;
        float base = sdBox(pos, fixed3(.4,.4,.1)) * 1.;
        pos.xy = mul(pos.xy,2.);
        //pos.y -= 3.5;
        pos.xy = mul(pos.xy, rot(.75));
        float result = -base;
        return result;
      }

      float box_set(fixed3 pos, float time) {
        fixed3 pos_origin = pos;
        pos = pos_origin;
        pos.y += sin(gTime * 0.4) * 2.5;
        pos.xy =   mul(pos.xy,rot(.8));
        float box1 = box(pos,2. - abs(sin(gTime * 0.4)) * 1.5);
        pos = pos_origin;
        pos.y -=sin(gTime * 0.4) * 2.5;
        pos.xy =   mul(pos.xy,rot(.8));
        float box2 = box(pos,2. - abs(sin(gTime * 0.4)) * 1.5);
        pos = pos_origin;
        pos.x +=sin(gTime * 0.4) * 2.5;
        pos.xy =   mul(pos.xy,rot(.8));
        float box3 = box(pos,2. - abs(sin(gTime * 0.4)) * 1.5);
        pos = pos_origin;
        pos.x -=sin(gTime * 0.4) * 2.5;
        pos.xy =   mul(pos.xy,rot(.8));
        float box4 = box(pos,2. - abs(sin(gTime * 0.4)) * 1.5);
        pos = pos_origin;
        pos.xy =   mul(pos.xy,rot(.8));
        float box5 = box(pos,.5) * 6.;
        pos = pos_origin;
        float box6 = box(pos,.5) * 6.;
        float result = max(max(max(max(max(box1,box2),box3),box4),box5),box6);
        return result;
      }

      float map(fixed3 pos, float time) {
        fixed3 pos_origin = pos;
        float box_set1 = box_set(pos, time);

        return box_set1;
      }

      float rand(float x){
        return frac(sin(x) * 100000.0);
      }

      fixed4 frag (v2f_img i) : SV_TARGET
      {
        // もしもそのままunicode位置を使いたくなったらこれを使う
        // int unicode_points[${this.unicodePoints.length}] = {${this.unicodePoints}};
        float time = _Time * 30;
        float rWeight = ${this.$store.state.rWeight}.;
        float gWeight = ${this.$store.state.gWeight}.;
        float bWeight = ${this.$store.state.bWeight}.;

        fixed2 resolution = _ScreenParams;
        fixed2 p = (i.uv*resolution * 2. - resolution.xy) / min(resolution.x, resolution.y);
        fixed3 ro = fixed3(60.,60., time * 0.5);
        fixed3 ray = normalize(fixed3(p, 1.5));

        float t = 0.01;
        fixed3 col = fixed3(0.,0.,0.);
        float ac = 0.0;

        for (int j = 0; j < 50; j++) {
          float3 pos = ro + ray * t;
          pos = fmod(pos-2, 4.)-2.;
          gTime = time - float(j) * 0.01;
          float d = map(pos,time);
          d = max(abs(d), 0.01);
          ac += exp(-d*23.);
          t += d*.55;
        }
        col = fixed3(ac * 0.02,ac * 0.02,ac * 0.02);
        col += fixed3(rWeight / 255. ,gWeight / 255.,bWeight / 255.);
        return fixed4(col, 1.0);
      }
      ENDCG
    }
  }
}

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
