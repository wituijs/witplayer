<template>
  <div class="app">
    <videoPlayer
      ref="playerRef"
      :src="videoSrc"
      :poster="posterSrc"
      :autoplay="false"
      :muted="false"
      :volume="0.8"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import videoPlayer from './components/videoPlayer.vue'

const playerRef = ref(null)
const videoSrc = 'https://www.w3schools.com/html/mov_bbb.mp4'
const posterSrc = ''
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #000;
  min-height: 100vh;
}

.app {
  width: 100%;
  height: 100vh;
}
</style>
