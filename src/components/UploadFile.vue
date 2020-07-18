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
      var title = 'TestSurfaceShader.shader'
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
Shader "Custom/TestSurfaceShader"
{
    Properties
    {
        _Color ("Color", Color) = (1,1,1,1)
        _MainTex ("Albedo (RGB)", 2D) = "white" {}
        _Glossiness ("Smoothness", Range(0,1)) = 0.5
        _Metallic ("Metallic", Range(0,1)) = 0.0
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }
        LOD 200

        CGPROGRAM
// Upgrade NOTE: excluded shader from DX11, OpenGL ES 2.0 because it uses unsized arrays
#pragma exclude_renderers d3d11 gles
        // Physically based Standard lighting model, and enable shadows on all light types
        #pragma surface surf Standard fullforwardshadows

        // Use shader model 3.0 target, to get nicer looking lighting
        #pragma target 3.0

        sampler2D _MainTex;

        struct Input
        {
            float2 uv_MainTex;
        };

        half _Glossiness;
        half _Metallic;
        fixed4 _Color;

        // Add instancing support for this shader. You need to check 'Enable Instancing' on materials that use the shader.
        // See https://docs.unity3d.com/Manual/GPUInstancing.html for more information about instancing.
        // #pragma instancing_options assumeuniformscaling
        UNITY_INSTANCING_BUFFER_START(Props)
            // put more per-instance properties here
        UNITY_INSTANCING_BUFFER_END(Props)

        static int array[${this.unicodePoints.length}] = {${this.unicodePoints}};
        void surf (Input IN, inout SurfaceOutputStandard o)
        {
            // Albedo comes from a texture tinted by color
            fixed4 c = tex2D (_MainTex, IN.uv_MainTex) * _Color;
            o.Albedo = c.rgb;
            // Metallic and smoothness come from slider variables
            o.Metallic = _Metallic;
            o.Smoothness = _Glossiness;
            o.Alpha = c.a;
        }
        ENDCG
    }
    FallBack "Diffuse"
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
