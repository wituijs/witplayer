<template>
  <div 
    ref="containerRef"
    class="wit-container"
    :class="containerClasses"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    @contextmenu.prevent="handleContextMenu"
  >
    <video
      ref="videoRef"
      class="wit-video"
      :preload="preload"
      :autoplay="autoplay"
      :loop="loop"
      :muted="muted"
      playsinline
      webkit-playsinline
      x5-video-player-type="h5"
      x5-video-player-fullscreen="true"
      @click="togglePlay"
    >
      <source v-if="!isHls" :src="src" :type="videoType">
    </video>

    <div 
      v-if="poster && !hasStarted"
      class="wit-poster"
      :style="{ backgroundImage: `url(${poster})` }"
      @click="togglePlay"
    >
      <div class="wit-poster-play">
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </div>
    </div>

    <div v-if="isLoading" class="wit-loading">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" viewBox="0 0 18 18" class="wit-loading-spinner">
        <path d="M9 1.5v3" class="wit-spinner-segment" opacity="0.5" style="--wit-spinner-delay:0s"></path>
        <path d="m14.5 3.5-2 2" class="wit-spinner-segment" opacity="0.45" style="--wit-spinner-delay:0.125s"></path>
        <path d="M16.5 9h-3" class="wit-spinner-segment" opacity="0.4" style="--wit-spinner-delay:0.25s"></path>
        <path d="m14.5 14.5-2-2" class="wit-spinner-segment" opacity="0.35" style="--wit-spinner-delay:0.375s"></path>
        <path d="M9 16.5v-3" class="wit-spinner-segment" opacity="0.3" style="--wit-spinner-delay:0.5s"></path>
        <path d="m3.5 14.5 2-2" class="wit-spinner-segment" opacity="0.25" style="--wit-spinner-delay:0.625s"></path>
        <path d="M1.5 9h3" class="wit-spinner-segment" opacity="0.15" style="--wit-spinner-delay:0.75s"></path>
        <path d="m3.5 3.5 2 2" class="wit-spinner-segment" opacity="0.1" style="--wit-spinner-delay:0.875s"></path>
      </svg>
    </div>

    <div v-if="isLive" class="wit-live-badge">
      <span class="wit-live-dot"></span>
      直播
    </div>

    <button 
      v-if="showBigPlay"
      class="wit-big-play" 
      aria-label="播放"
      @click.stop="togglePlay"
      @touchstart.stop
      @touchend.stop
    >
      <svg v-if="isEnded" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 18 18">
        <path d="M9 1a7.98 7.98 0 0 0-6.132 2.867l-1.441-1.44A.25.25 0 0 0 1 2.604V6.75c0 .138.112.25.25.25h4.146a.25.25 0 0 0 .177-.427L4.29 5.29A5.99 5.99 0 0 1 9 3a6 6 0 1 1-6 6H1a8 8 0 1 0 8-8"></path>
        <path d="m11.61 9.639-3.331 2.07a.826.826 0 0 1-1.15-.266.86.86 0 0 1-.129-.452V6.849C7 6.38 7.374 6 7.834 6c.158 0 .312.045.445.13l3.331 2.071a.858.858 0 0 1 0 1.438"></path>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 18 18">
        <path d="m14.051 10.723-7.985 4.964a1.98 1.98 0 0 1-2.758-.638A2.06 2.06 0 0 1 3 13.964V4.036C3 2.91 3.895 2 5 2c.377 0 .747.109 1.066.313l7.985 4.964a2.057 2.057 0 0 1 .627 2.808c-.16.257-.373.475-.627.637"></path>
      </svg>
    </button>

    <div v-if="controls" class="wit-controls" :style="controlsStyle">
      <div class="wit-controls-bar">
        <div class="wit-left-controls">
          <button class="wit-btn wit-play-btn" aria-label="播放" @click="togglePlay">
            <svg v-if="isEnded" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 18 18">
              <path d="M9 1a7.98 7.98 0 0 0-6.132 2.867l-1.441-1.44A.25.25 0 0 0 1 2.604V6.75c0 .138.112.25.25.25h4.146a.25.25 0 0 0 .177-.427L4.29 5.29A5.99 5.99 0 0 1 9 3a6 6 0 1 1-6 6H1a8 8 0 1 0 8-8"></path>
              <path d="m11.61 9.639-3.331 2.07a.826.826 0 0 1-1.15-.266.86.86 0 0 1-.129-.452V6.849C7 6.38 7.374 6 7.834 6c.158 0 .312.045.445.13l3.331 2.071a.858.858 0 0 1 0 1.438"></path>
            </svg>
            <svg v-else-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 18 18">
              <path d="m14.051 10.723-7.985 4.964a1.98 1.98 0 0 1-2.758-.638A2.06 2.06 0 0 1 3 13.964V4.036C3 2.91 3.895 2 5 2c.377 0 .747.109 1.066.313l7.985 4.964a2.057 2.057 0 0 1 .627 2.808c-.16.257-.373.475-.627.637"></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 18 18">
              <rect width="5" height="14" x="2" y="2" rx="2.5"></rect>
              <rect width="5" height="14" x="11" y="2" rx="2.5"></rect>
            </svg>
          </button>

          <button v-if="!isLive" class="wit-btn wit-seek-btn wit-seek-btn--backward" aria-label="后退10秒" @click="seekBackward">
            <span class="wit-seek-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 18 18" style="transform: scaleX(-1)">
                <path d="M9 1a7.98 7.98 0 0 1 6.132 2.867l1.441-1.44a.25.25 0 0 1 .427.177V6.75a.25.25 0 0 1-.25.25h-4.146a.25.25 0 0 1-.177-.427L13.71 5.29A5.99 5.99 0 0 0 9 3a6 6 0 0 0-4.242 10.242l-1.415 1.415A8 8 0 0 1 9 1"></path>
              </svg>
              <span class="wit-seek-label">10</span>
            </span>
          </button>

          <button v-if="!isLive" class="wit-btn wit-seek-btn wit-seek-btn--forward" aria-label="前进10秒" @click="seekForward">
            <span class="wit-seek-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 18 18">
                <path d="M9 1a7.98 7.98 0 0 1 6.132 2.867l1.441-1.44a.25.25 0 0 1 .427.177V6.75a.25.25 0 0 1-.25.25h-4.146a.25.25 0 0 1-.177-.427L13.71 5.29A5.99 5.99 0 0 0 9 3a6 6 0 0 0-4.242 10.242l-1.415 1.415A8 8 0 0 1 9 1"></path>
              </svg>
              <span class="wit-seek-label">10</span>
            </span>
          </button>
        </div>

        <div v-if="!isLive" class="wit-progress-wrap wit-progress-wrap--mobile">
          <span class="wit-time wit-time-current">{{ formatTime(isDragging ? dragTime : currentTime) }}</span>
          <div 
            ref="progressRef"
            class="wit-progress"
            @click="onProgressClick"
            @mousedown="startDrag"
            @touchstart.passive="startDrag"
            @mousemove="updateTooltip"
            @mouseleave="hideTooltip"
          >
            <div class="wit-progress-buffer" :style="{ width: `${bufferedPercent}%` }"></div>
            <div class="wit-progress-fill" :style="{ width: `${progressPercent}%` }"></div>
            <div class="wit-progress-thumb" :style="{ left: `${progressPercent}%` }"></div>
            <div class="wit-tooltip" :style="{ left: `${tooltipPercent}%`, opacity: tooltipVisible ? 1 : 0 }">
              {{ tooltipTime }}
            </div>
          </div>
          <span class="wit-time wit-time-duration">{{ formatTime(duration) }}</span>
        </div>

        <div v-if="!isLive" class="wit-progress-wrap wit-progress-wrap--desktop">
          <span class="wit-time wit-time-current">{{ formatTime(isDragging ? dragTime : currentTime) }}</span>
          <div 
            class="wit-progress"
            @click="onProgressClick"
            @mousedown="startDrag"
            @touchstart.passive="startDrag"
            @mousemove="updateTooltip"
            @mouseleave="hideTooltip"
          >
            <div class="wit-progress-buffer" :style="{ width: `${bufferedPercent}%` }"></div>
            <div class="wit-progress-fill" :style="{ width: `${progressPercent}%` }"></div>
            <div class="wit-progress-thumb" :style="{ left: `${progressPercent}%` }"></div>
            <div class="wit-tooltip" :style="{ left: `${tooltipPercent}%`, opacity: tooltipVisible ? 1 : 0 }">
              {{ tooltipTime }}
            </div>
          </div>
          <span class="wit-time wit-time-duration">{{ formatTime(duration) }}</span>
        </div>

        <div class="wit-right-controls">
          <div class="wit-volume-wrap">
            <button class="wit-btn" aria-label="音量" @click="toggleMute">
              <svg v-if="currentVolume === 0 || isMuted" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 18 18">
                <path d="M.714 6.008h3.072l4.071-3.857c.5-.376 1.143 0 1.143.601V15.28c0 .602-.643.903-1.143.602l-4.071-3.858H.714c-.428 0-.714-.3-.714-.752V6.76c0-.451.286-.752.714-.752M14.5 7.586l-1.768-1.768a1 1 0 1 0-1.414 1.414L13.085 9l-1.767 1.768a1 1 0 0 0 1.414 1.414l1.768-1.768 1.768 1.768a1 1 0 0 0 1.414-1.414L15.914 9l1.768-1.768a1 1 0 0 0-1.414-1.414z"></path>
              </svg>
              <svg v-else-if="currentVolume < 0.5" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 18 18">
                <path d="M.714 6.008h3.072l4.071-3.857c.5-.376 1.143 0 1.143.601V15.28c0 .602-.643.903-1.143.602l-4.071-3.858H.714c-.428 0-.714-.3-.714-.752V6.76c0-.451.286-.752.714-.752m10.568.59a.91.91 0 0 1 0-1.316.91.91 0 0 1 1.316 0c1.203 1.203 1.47 2.216 1.522 3.208q.012.255.011.51c0 1.16-.358 2.733-1.533 3.803a.7.7 0 0 1-.298.156c-.382.106-.873-.011-1.018-.156a.91.91 0 0 1 0-1.316c.57-.57.995-1.551.995-2.487 0-.944-.26-1.667-.995-2.402"></path>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 18 18">
                <path d="M15.6 3.3c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4C15.4 5.9 16 7.4 16 9s-.6 3.1-1.8 4.3c-.4.4-.4 1 0 1.4.2.2.5.3.7.3.3 0 .5-.1.7-.3C17.1 13.2 18 11.2 18 9s-.9-4.2-2.4-5.7"></path>
                <path d="M.714 6.008h3.072l4.071-3.857c.5-.376 1.143 0 1.143.601V15.28c0 .602-.643.903-1.143.602l-4.071-3.858H.714c-.428 0-.714-.3-.714-.752V6.76c0-.451.286-.752.714-.752m10.568.59a.91.91 0 0 1 0-1.316.91.91 0 0 1 1.316 0c1.203 1.203 1.47 2.216 1.522 3.208q.012.255.011.51c0 1.16-.358 2.733-1.533 3.803a.7.7 0 0 1-.298.156c-.382.106-.873-.011-1.018-.156a.91.91 0 0 1 0-1.316c.57-.57.995-1.551.995-2.487 0-.944-.26-1.667-.995-2.402"></path>
              </svg>
            </button>
            <div class="wit-volume-slider">
              <div class="wit-volume-value">{{ Math.round(currentVolume * 100) }}</div>
              <input 
                type="range" 
                class="wit-volume-range" 
                min="0" 
                max="1" 
                step="0.05" 
                :value="currentVolume"
                @input="setVolume"
                orient="vertical"
              >
            </div>
          </div>

          <div class="wit-speed-wrap" v-if="!isLive">
            <button class="wit-btn wit-speed-btn" aria-label="播放速度" @click="toggleSpeedMenu">
              {{ playbackRate }}x
            </button>
            <div class="wit-speed-menu" :class="{ 'wit-speed-menu--visible': showSpeedMenu }">
              <button 
                v-for="rate in playbackRates" 
                :key="rate"
                class="wit-speed-item"
                :class="{ 'wit-active': playbackRate === rate }"
                @click="setPlaybackRate(rate)"
              >
                {{ rate }}x
              </button>
            </div>
          </div>

          <button class="wit-btn" aria-label="画中画" @click="togglePiP" v-if="supportsPiP">
            <svg v-if="!isPiP" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 18 18">
              <path d="M13 2a4 4 0 0 1 4 4v2.036A3.5 3.5 0 0 0 16.5 8H15V6.273C15 5.018 13.96 4 12.679 4H4.32C3.04 4 2 5.018 2 6.273v5.454C2 12.982 3.04 14 4.321 14H6v1.5q0 .255.036.5H4a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z"></path>
              <rect width="10" height="7" x="8" y="10" rx="2"></rect>
              <path d="M7.129 5.547a.6.6 0 0 0-.656.13L3.677 8.473A.6.6 0 0 0 4.102 9.5h2.796c.332 0 .602-.27.602-.602V6.103a.6.6 0 0 0-.371-.556"></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 18 18">
              <path d="M13 2a4 4 0 0 1 4 4v2.036A3.5 3.5 0 0 0 16.5 8H15V6.273C15 5.018 13.96 4 12.679 4H4.32C3.04 4 2 5.018 2 6.273v5.454C2 12.982 3.04 14 4.321 14H6v1.5q0 .255.036.5H4a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z"></path>
              <rect width="10" height="7" x="8" y="10" rx="2"></rect>
              <path d="M4.871 10.454a.6.6 0 0 0 .656-.131l2.796-2.796A.6.6 0 0 0 7.898 6.5H5.102a.603.603 0 0 0-.602.602v2.795a.6.6 0 0 0 .371.556"></path>
            </svg>
          </button>

          <button v-if="props.danmaku" class="wit-btn" aria-label="弹幕" @click="toggleDanmaku">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 18 18">
              <path d="M3 3h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m0 2v8h12V5zm2 2h3v2H5zm0 3h5v2H5zm6-3h2v2h-2z"/>
            </svg>
          </button>

          <button class="wit-btn" aria-label="全屏" @click="toggleFullscreen">
            <svg v-if="!isFullscreen" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 18 18">
              <path d="M9.57 3.617A1 1 0 0 0 8.646 3H4c-.552 0-1 .449-1 1v4.646a.996.996 0 0 0 1.001 1 1 1 0 0 0 .706-.293l4.647-4.647a1 1 0 0 0 .216-1.089m4.812 4.812a1 1 0 0 0-1.089.217l-4.647 4.647a.998.998 0 0 0 .708 1.706H14c.552 0 1-.449 1-1V9.353a1 1 0 0 0-.618-.924"></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 18 18">
              <path d="M7.883 1.93a.99.99 0 0 0-1.09.217L2.146 6.793A.998.998 0 0 0 2.853 8.5H7.5c.551 0 1-.449 1-1V2.854a1 1 0 0 0-.617-.924m7.263 7.57H10.5c-.551 0-1 .449-1 1v4.646a.996.996 0 0 0 1.001 1.001 1 1 0 0 0 .706-.293l4.646-4.646a.998.998 0 0 0-.707-1.707z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="hasError" class="wit-error">
      <svg class="wit-error-icon" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      <div class="wit-error-text">{{ errorMessage }}</div>
      <button class="wit-retry-btn" @click="retry">重试</button>
    </div>

    <div class="wit-toast" :class="{ 'wit-show': toastVisible }">
      {{ toastMessage }}
    </div>

    <div v-if="contextMenuVisible" class="wit-context-menu" :style="contextMenuStyle">
      <div class="wit-context-menu-item" @click="copyVideoUrl">复制视频地址</div>
      <div class="wit-context-menu-item" @click="showVersion">版本信息</div>
    </div>

    <div v-if="danmakuEnabled" class="wit-danmaku-container" ref="danmakuContainer">
      <div 
        v-for="item in visibleDanmakus" 
        :key="item.id"
        class="wit-danmaku-item"
        :style="item.style"
      >{{ item.text }}</div>
    </div>

    <div v-if="danmakuInputVisible" class="wit-danmaku-input">
      <input 
        v-model="danmakuText" 
        placeholder="发送弹幕..."
        @keyup.enter="sendDanmaku"
        @blur="closeDanmakuInput"
        ref="danmakuInputRef"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import Hls from 'hls.js'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    default: ''
  },
  autoplay: {
    type: Boolean,
    default: false
  },
  loop: {
    type: Boolean,
    default: false
  },
  muted: {
    type: Boolean,
    default: false
  },
  volume: {
    type: Number,
    default: 1
  },
  playbackRates: {
    type: Array,
    default: () => [0.5, 0.75, 1, 1.25, 1.5, 2]
  },
  controls: {
    type: Boolean,
    default: true
  },
  preload: {
    type: String,
    default: 'auto'
  },
  isLive: {
    type: Boolean,
    default: false
  },
  isM3u8: {
    type: Boolean,
    default: false
  },
  codec: {
    type: String,
    default: ''
  },
  danmaku: {
    type: Boolean,
    default: false
  },
  danmakuList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['play', 'pause', 'ended', 'timeupdate', 'error', 'fullscreenchange', 'loadstart', 'canplay'])

const containerRef = ref(null)
const videoRef = ref(null)
const progressRef = ref(null)

const isPlaying = ref(false)
const isMuted = ref(props.muted)
const isFullscreen = ref(false)
const isPiP = ref(false)
const isEnded = ref(false)
const isLoading = ref(true)
const hasError = ref(false)
const hasStarted = ref(false)
const isHls = ref(false)
const hlsInstance = ref(null)
const supportsPiP = ref(false)
const isDragging = ref(false)

const currentTime = ref(0)
const duration = ref(0)
const bufferedPercent = ref(0)
const currentVolume = ref(props.volume)
const playbackRate = ref(1)
const errorMessage = ref('视频加载失败')

const controlsVisible = ref(false)
const hideControlsTimeout = ref(null)
const touchStartTime = ref(0)

const toastVisible = ref(false)
const toastMessage = ref('')

const contextMenuVisible = ref(false)
const contextMenuStyle = ref({})

const danmakuEnabled = ref(props.danmaku)
const danmakuInputVisible = ref(false)
const danmakuText = ref('')
const danmakuInputRef = ref(null)
const danmakuContainer = ref(null)
const visibleDanmakus = ref([])
const danmakuId = ref(0)
const danmakuQueue = ref([])

const tooltipVisible = ref(false)
const tooltipPercent = ref(0)
const tooltipTime = ref('00:00')
const dragTime = ref(0)
const showSpeedMenu = ref(false)

const progressPercent = computed(() => {
  if (!duration.value) return 0
  if (isDragging.value) return (dragTime.value / duration.value) * 100
  return (currentTime.value / duration.value) * 100
})

const videoType = computed(() => {
  if (props.codec) return props.codec
  if (props.src.includes('.mp4')) return 'video/mp4; codecs="hvc1"'
  if (props.src.includes('.webm')) return 'video/webm'
  if (props.src.includes('.ogg')) return 'video/ogg'
  return 'video/mp4'
})

const containerClasses = computed(() => ({
  'wit-paused': !isPlaying.value,
  'wit-ended': isEnded.value,
  'wit-waiting': isLoading.value,
  'wit-error': hasError.value,
  'wit-fullscreen': isFullscreen.value,
  'wit-live': props.isLive,
  'wit-touch': 'ontouchstart' in window
}))

const showBigPlay = computed(() => {
  return (!isPlaying.value || isEnded.value) && !hasError.value
})

const controlsStyle = computed(() => ({
  opacity: controlsVisible.value ? 1 : 0,
  visibility: controlsVisible.value ? 'visible' : 'hidden',
  transform: controlsVisible.value ? 'translateY(0)' : 'translateY(100%)'
}))

const formatTime = (seconds) => {
  if (isNaN(seconds) || !isFinite(seconds)) return '00:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const showToast = (message) => {
  toastMessage.value = message
  toastVisible.value = true
  setTimeout(() => {
    toastVisible.value = false
  }, 1500)
}

const handleContextMenu = (e) => {
  contextMenuVisible.value = true
  contextMenuStyle.value = {
    left: `${e.clientX}px`,
    top: `${e.clientY}px`
  }
}

const hideContextMenu = () => {
  contextMenuVisible.value = false
}

const copyVideoUrl = () => {
  if (props.src) {
    navigator.clipboard.writeText(props.src).then(() => {
      showToast('视频地址已复制')
    }).catch(() => {
      showToast('复制失败')
    })
  }
  hideContextMenu()
}

const showVersion = () => {
  showToast('witplayer v1.0.0')
  hideContextMenu()
}

const toggleDanmaku = () => {
  danmakuEnabled.value = !danmakuEnabled.value
  showToast(danmakuEnabled.value ? '弹幕已开启' : '弹幕已关闭')
}

const openDanmakuInput = () => {
  danmakuInputVisible.value = true
  nextTick(() => {
    danmakuInputRef.value?.focus()
  })
}

const closeDanmakuInput = () => {
  danmakuInputVisible.value = false
  danmakuText.value = ''
}

const sendDanmaku = () => {
  if (!danmakuText.value.trim()) {
    closeDanmakuInput()
    return
  }
  
  const colors = ['#fff', '#ff5f56', '#ffbd2e', '#27c93f', '#007aff', '#ff2d55', '#af52de', '#ff9500']
  const color = colors[Math.floor(Math.random() * colors.length)]
  
  addDanmaku({
    text: danmakuText.value,
    color: color
  })
  
  closeDanmakuInput()
}

const addDanmaku = (item) => {
  const container = danmakuContainer.value
  if (!container) return
  
  const id = danmakuId.value++
  const top = Math.random() * (container.offsetHeight - 30)
  
  const danmakuItem = {
    id,
    text: item.text,
    style: {
      top: `${top}px`,
      color: item.color || '#fff',
      transform: 'translateX(100%)'
    }
  }
  
  visibleDanmakus.value.push(danmakuItem)
  
  setTimeout(() => {
    visibleDanmakus.value = visibleDanmakus.value.filter(d => d.id !== id)
  }, 8000)
}

const processDanmakuQueue = () => {
  if (!videoRef.value || !danmakuEnabled.value) return
  
  const currentTime = videoRef.value.currentTime
  
  props.danmakuList.forEach(item => {
    if (Math.abs(item.time - currentTime) < 0.5 && !danmakuQueue.value.includes(item.id)) {
      danmakuQueue.value.push(item.id)
      addDanmaku(item)
    }
  })
}

const initHls = () => {
  if (!videoRef.value) return
  
  const isHlsSource = props.isM3u8
  
  if (isHlsSource) {
    isHls.value = true
    
    if (videoRef.value.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.value.src = props.src
    } else if (Hls.isSupported()) {
      if (hlsInstance.value) {
        hlsInstance.value.destroy()
      }
      
      hlsInstance.value = new Hls({
        enableWorker: true,
        lowLatencyMode: props.isLive,
        backBufferLength: props.isLive ? 4 : 60
      })
      
      hlsInstance.value.loadSource(props.src)
      hlsInstance.value.attachMedia(videoRef.value)
      
      hlsInstance.value.on(Hls.Events.MANIFEST_PARSED, () => {
        if (props.autoplay) {
          videoRef.value.play().catch(() => {})
        }
      })
      
      hlsInstance.value.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              errorMessage.value = '网络错误，请检查网络连接'
              hlsInstance.value.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              errorMessage.value = '媒体错误'
              hlsInstance.value.recoverMediaError()
              break
            default:
              hasError.value = true
              break
          }
        }
      })
    } else {
      hasError.value = true
      errorMessage.value = '您的浏览器不支持HLS播放'
    }
  } else {
    isHls.value = false
    videoRef.value.src = props.src
  }
}

const togglePlay = () => {
  if (!videoRef.value) return
  
  if (isEnded.value) {
    videoRef.value.currentTime = 0
    isEnded.value = false
  }
  
  if (videoRef.value.paused) {
    videoRef.value.play().catch(e => {
      if (e.name === 'NotAllowedError') {
        showToast('请点击播放')
      }
    })
  } else {
    videoRef.value.pause()
  }
}

const seek = (e) => {
  if (!videoRef.value || props.isLive) return
  const target = e.currentTarget || e.target
  if (!target) return
  const rect = target.getBoundingClientRect()
  const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0)
  const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  return percent * duration.value
}

const onProgressClick = (e) => {
  if (props.isLive) return
  const time = seek(e)
  if (time !== undefined && videoRef.value) {
    videoRef.value.currentTime = time
  }
}

const startDrag = (e) => {
  if (props.isLive) return
  e.preventDefault()
  isDragging.value = true
  
  const progressEl = e.currentTarget
  const rect = progressEl.getBoundingClientRect()
  const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0)
  const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  dragTime.value = percent * duration.value
  
  const onMove = (moveEvent) => {
    if (!isDragging.value) return
    moveEvent.preventDefault()
    const rect = progressEl.getBoundingClientRect()
    const clientX = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0] ? moveEvent.touches[0].clientX : 0)
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    dragTime.value = percent * duration.value
  }
  
  const onEnd = () => {
    if (isDragging.value && videoRef.value) {
      currentTime.value = dragTime.value
      videoRef.value.currentTime = dragTime.value
    }
    setTimeout(() => {
      isDragging.value = false
    }, 50)
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onEnd)
    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('touchend', onEnd)
  }
  
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onEnd)
  document.addEventListener('touchmove', onMove, { passive: false })
  document.addEventListener('touchend', onEnd)
}

const updateTooltip = (e) => {
  if (!duration.value || props.isLive) return
  const target = e.currentTarget || e.target
  if (!target) return
  const rect = target.getBoundingClientRect()
  const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  tooltipPercent.value = percent * 100
  tooltipTime.value = formatTime(percent * duration.value)
  tooltipVisible.value = true
}

const hideTooltip = () => {
  tooltipVisible.value = false
}

const seekBackward = () => {
  if (!videoRef.value || props.isLive) return
  videoRef.value.currentTime = Math.max(0, videoRef.value.currentTime - 10)
  showToast('后退 10秒')
}

const seekForward = () => {
  if (!videoRef.value || props.isLive) return
  videoRef.value.currentTime = Math.min(duration.value, videoRef.value.currentTime + 10)
  showToast('前进 10秒')
}

const toggleMute = () => {
  if (!videoRef.value) return
  isMuted.value = !isMuted.value
  videoRef.value.muted = isMuted.value
  showToast(isMuted.value ? '已静音' : '已取消静音')
}

const setVolume = (e) => {
  const value = parseFloat(e.target.value)
  currentVolume.value = value
  if (videoRef.value) {
    videoRef.value.volume = value
    videoRef.value.muted = value === 0
    isMuted.value = value === 0
  }
}

const setPlaybackRate = (rate) => {
  if (!videoRef.value || props.isLive) return
  videoRef.value.playbackRate = rate
  playbackRate.value = rate
  showSpeedMenu.value = false
  showToast(`播放速度: ${rate}x`)
}

const toggleSpeedMenu = () => {
  showSpeedMenu.value = !showSpeedMenu.value
}

const handleDocumentClick = (e) => {
  if (showSpeedMenu.value && !e.target.closest('.wit-speed-wrap')) {
    showSpeedMenu.value = false
  }
}

const togglePiP = async () => {
  if (!videoRef.value || !supportsPiP.value) return
  
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture()
      isPiP.value = false
    } else {
      await videoRef.value.requestPictureInPicture()
      isPiP.value = true
    }
  } catch (err) {
    console.error('PiP error:', err)
  }
}

const toggleFullscreen = async () => {
  if (!containerRef.value) return
  
  try {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (containerRef.value.requestFullscreen) {
        await containerRef.value.requestFullscreen()
      } else if (containerRef.value.webkitRequestFullscreen) {
        await containerRef.value.webkitRequestFullscreen()
      } else if (containerRef.value.webkitEnterFullscreen) {
        await containerRef.value.webkitEnterFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen()
      }
    }
  } catch (err) {
    console.error('Fullscreen error:', err)
  }
}

const retry = () => {
  hasError.value = false
  if (hlsInstance.value) {
    hlsInstance.value.recoverMediaError()
  } else if (videoRef.value) {
    videoRef.value.load()
  }
}

const showControls = () => {
  controlsVisible.value = true
  clearTimeout(hideControlsTimeout.value)
  
  hideControlsTimeout.value = setTimeout(() => {
    controlsVisible.value = false
  }, 3000)
}

const handleMouseMove = () => {
  if ('ontouchstart' in window) return
  showControls()
}

const handleMouseLeave = () => {
  if ('ontouchstart' in window) return
  clearTimeout(hideControlsTimeout.value)
  controlsVisible.value = false
}

const handleTouchStart = () => {
  touchStartTime.value = Date.now()
}

const handleTouchEnd = () => {
  const touchDuration = Date.now() - touchStartTime.value
  if (touchDuration < 200) {
    if (controlsVisible.value) {
      clearTimeout(hideControlsTimeout.value)
      controlsVisible.value = false
    } else if (isPlaying.value) {
      showControls()
    }
  }
}

const handleKeyDown = (e) => {
  if (!videoRef.value) return
  
  switch (e.key.toLowerCase()) {
    case ' ':
    case 'k':
      e.preventDefault()
      togglePlay()
      break
    case 'arrowleft':
    case 'j':
      e.preventDefault()
      seekBackward()
      break
    case 'arrowright':
    case 'l':
      e.preventDefault()
      seekForward()
      break
    case 'arrowup':
      e.preventDefault()
      currentVolume.value = Math.min(1, currentVolume.value + 0.1)
      videoRef.value.volume = currentVolume.value
      showToast(`音量: ${Math.round(currentVolume.value * 100)}%`)
      break
    case 'arrowdown':
      e.preventDefault()
      currentVolume.value = Math.max(0, currentVolume.value - 0.1)
      videoRef.value.volume = currentVolume.value
      showToast(`音量: ${Math.round(currentVolume.value * 100)}%`)
      break
    case 'm':
      toggleMute()
      break
    case 'f':
      toggleFullscreen()
      break
    case 'escape':
      if (isFullscreen.value) {
        toggleFullscreen()
      }
      break
    default:
      if (/^[0-9]$/.test(e.key) && !props.isLive) {
        const percent = parseInt(e.key) * 10
        videoRef.value.currentTime = (percent / 100) * duration.value
        showToast(`跳转到 ${percent}%`)
      }
  }
}

const onPlay = () => {
  isPlaying.value = true
  hasStarted.value = true
  isEnded.value = false
  isLoading.value = false
  emit('play')
  
  if ('ontouchstart' in window) {
    showControls()
  }
}

const onPause = () => {
  isPlaying.value = false
  emit('pause')
  
  if ('ontouchstart' in window) {
    clearTimeout(hideControlsTimeout.value)
    controlsVisible.value = false
  }
}

const onEnded = () => {
  isPlaying.value = false
  isEnded.value = true
  emit('ended')
}

const onTimeUpdate = () => {
  if (!videoRef.value || isDragging.value) return
  currentTime.value = videoRef.value.currentTime
  emit('timeupdate', currentTime.value)
  processDanmakuQueue()
}

const onProgress = () => {
  if (!videoRef.value || !videoRef.value.buffered.length) return
  const buffered = videoRef.value.buffered.end(videoRef.value.buffered.length - 1)
  bufferedPercent.value = (buffered / duration.value) * 100
}

const onLoadedMetadata = () => {
  if (!videoRef.value) return
  duration.value = videoRef.value.duration
}

const onWaiting = () => {
  isLoading.value = true
}

const onPlaying = () => {
  isLoading.value = false
}

const onCanPlay = () => {
  isLoading.value = false
  emit('canplay')
}

const onLoadStart = () => {
  isLoading.value = true
  emit('loadstart')
}

const onError = () => {
  hasError.value = true
  isLoading.value = false
  emit('error')
}

const onFullscreenChange = () => {
  isFullscreen.value = !!(document.fullscreenElement || document.webkitFullscreenElement)
  emit('fullscreenchange', isFullscreen.value)
}

onMounted(async () => {
  if (!videoRef.value) return
  
  supportsPiP.value = 'pictureInPictureEnabled' in document && document.pictureInPictureEnabled
  
  videoRef.value.addEventListener('play', onPlay)
  videoRef.value.addEventListener('pause', onPause)
  videoRef.value.addEventListener('ended', onEnded)
  videoRef.value.addEventListener('timeupdate', onTimeUpdate)
  videoRef.value.addEventListener('progress', onProgress)
  videoRef.value.addEventListener('loadedmetadata', onLoadedMetadata)
  videoRef.value.addEventListener('waiting', onWaiting)
  videoRef.value.addEventListener('playing', onPlaying)
  videoRef.value.addEventListener('canplay', onCanPlay)
  videoRef.value.addEventListener('loadstart', onLoadStart)
  videoRef.value.addEventListener('error', onError)
  
  document.addEventListener('fullscreenchange', onFullscreenChange)
  document.addEventListener('webkitfullscreenchange', onFullscreenChange)
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('click', hideContextMenu)
  
  videoRef.value.volume = currentVolume.value
  if (props.muted) {
    videoRef.value.muted = true
    isMuted.value = true
  }
  
  await nextTick()
  initHls()
})

onBeforeUnmount(() => {
  if (!videoRef.value) return
  
  videoRef.value.removeEventListener('play', onPlay)
  videoRef.value.removeEventListener('pause', onPause)
  videoRef.value.removeEventListener('ended', onEnded)
  videoRef.value.removeEventListener('timeupdate', onTimeUpdate)
  videoRef.value.removeEventListener('progress', onProgress)
  videoRef.value.removeEventListener('loadedmetadata', onLoadedMetadata)
  videoRef.value.removeEventListener('waiting', onWaiting)
  videoRef.value.removeEventListener('playing', onPlaying)
  videoRef.value.removeEventListener('canplay', onCanPlay)
  videoRef.value.removeEventListener('loadstart', onLoadStart)
  videoRef.value.removeEventListener('error', onError)
  
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('click', handleDocumentClick)
  
  if (hlsInstance.value) {
    hlsInstance.value.destroy()
    hlsInstance.value = null
  }
  
  clearTimeout(hideControlsTimeout.value)
})

watch(() => props.src, () => {
  if (hlsInstance.value) {
    hlsInstance.value.destroy()
    hlsInstance.value = null
  }
  hasStarted.value = false
  isEnded.value = false
  hasError.value = false
  initHls()
})

defineExpose({
  play: () => videoRef.value?.play(),
  pause: () => videoRef.value?.pause(),
  stop: () => {
    if (videoRef.value) {
      videoRef.value.pause()
      videoRef.value.currentTime = 0
    }
  },
  seek: (time) => {
    if (videoRef.value) {
      videoRef.value.currentTime = time
    }
  },
  setVolume: (vol) => {
    currentVolume.value = vol
    if (videoRef.value) {
      videoRef.value.volume = vol
    }
  }
})
</script>

<style>
.wit-container {
  --wit-primary: #fff;
  --wit-accent: #fff;
  --wit-surface: rgba(15, 15, 20, 0.85);
  --wit-surface-hover: rgba(25, 25, 35, 0.9);
  --wit-border: rgba(255, 255, 255, 0.08);
  --wit-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  --wit-radius: 9999px;
  --wit-icon-size: 18px;
  --wit-transition: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 13px;
  line-height: 1.5;
  overflow: hidden;
  outline: 2px solid transparent;
  outline-offset: -4px;
  border-radius: 1rem;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  isolation: isolate;
}

.wit-container * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.wit-container:focus-visible {
  outline: 2px solid var(--wit-accent);
  outline-offset: 2px;
}

.wit-video {
  width: 100%;
  height: 100%;
  display: block;
  background: #000;
  object-fit: contain;
}

.wit-poster {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: 1;
  cursor: pointer;
}

.wit-poster-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4.5rem;
  height: 4.5rem;
  background: var(--wit-surface);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(0.75rem);
  -webkit-backdrop-filter: blur(0.75rem);
  box-shadow: var(--wit-shadow);
  border: 0.0625rem solid var(--wit-border);
  transition: transform var(--wit-transition), background var(--wit-transition);
}

.wit-poster-play svg {
  width: 1.75rem;
  height: 1.75rem;
  fill: var(--wit-primary);
  margin-left: 0.125rem;
}

.wit-poster-play:hover {
  transform: translate(-50%, -50%) scale(1.05);
}

.wit-poster-play:active {
  transform: translate(-50%, -50%) scale(0.98);
}

.wit-big-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 64px;
  height: 64px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  z-index: 10;
  display: none;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: transform 0.15s ease-out, background 0.15s ease-out;
  outline: 2px solid transparent;
  outline-offset: -2px;
}

.wit-big-play svg {
  width: 24px;
  height: 24px;
  fill: #fff;
  margin-left: 2px;
}

.wit-big-play:hover {
  transform: translate(-50%, -50%) scale(1.05);
  background: rgba(0, 0, 0, 0.5);
}

.wit-big-play:active {
  transform: translate(-50%, -50%) scale(0.98);
}

.wit-big-play:focus-visible {
  outline-color: rgba(255, 255, 255, 0.25);
  outline-offset: 2px;
}

.wit-container.wit-paused .wit-big-play,
.wit-container.wit-ended .wit-big-play {
  display: flex;
}

.wit-container.wit-ended .wit-big-play svg {
  margin-left: 0;
}

.wit-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 15;
  display: none;
  color: #fff;
}

.wit-loading-spinner {
  width: 1.125rem;
  height: 1.125rem;
}

.wit-spinner-segment {
  animation: wit-spinner-fade 1s linear infinite;
  animation-delay: var(--wit-spinner-delay);
}

@keyframes wit-spinner-fade {
  0% { opacity: 1; }
  to { opacity: 0; }
}

.wit-container.wit-waiting .wit-loading {
  display: block;
}

.wit-live-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: #e53935;
  color: #fff;
  padding: 0.25rem 0.625rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  z-index: 25;
}

.wit-live-dot {
  width: 0.375rem;
  height: 0.375rem;
  background: #fff;
  border-radius: 50%;
  animation: wit-pulse 1.5s ease-in-out infinite;
}

@keyframes wit-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.wit-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 12px 12px;
  z-index: 20;
  opacity: 0;
  visibility: hidden;
  transform: translateY(100%);
  transition: opacity 0.5s ease, visibility 0.5s ease, transform 0.5s ease;
}

.wit-progress-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 80px;
  flex: 1;
  min-height: 32px;
}

.wit-progress-wrap--mobile {
  display: none;
}

.wit-progress-wrap--desktop {
  display: flex;
}

.wit-progress {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
  cursor: pointer;
  position: relative;
  transition: height 0.15s ease-out;
  min-width: 40px;
}

.wit-progress:hover {
  height: 5px;
}

.wit-progress-buffer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  transition: width 0.25s ease-out;
}

.wit-progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--wit-primary);
  border-radius: 9999px;
}

.wit-progress-thumb {
  position: absolute;
  top: 50%;
  width: 10px;
  height: 10px;
  background: var(--wit-primary);
  border-radius: 9999px;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.15s ease-out, width 0.15s ease-out, height 0.15s ease-out;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.15);
  outline: 4px solid transparent;
  outline-offset: -4px;
}

.wit-progress:hover .wit-progress-thumb,
.wit-progress-thumb:focus {
  opacity: 1;
}

.wit-progress:active .wit-progress-thumb {
  width: 12px;
  height: 12px;
}

.wit-progress-thumb:focus-visible {
  outline-color: rgba(255, 255, 255, 0.25);
  outline-offset: 0;
}

.wit-progress-thumb::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: inherit;
  box-shadow: 0 0 0 2px #fff;
  opacity: 0;
  scale: 0.5;
  transition: opacity 0.15s ease-out, scale 0.15s ease-out;
}

.wit-progress-thumb:focus-visible::after {
  opacity: 1;
  scale: 1;
}

.wit-tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.4);
  color: var(--wit-primary);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.wit-controls-bar {
  display: flex;
  align-items: center;
  gap: 3px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 1.5rem;
  padding: 5px 8px;
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
}

.wit-left-controls,
.wit-right-controls {
  display: flex;
  align-items: center;
  gap: 2px;
}

.wit-left-controls {
  flex: none;
}

.wit-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s ease-out, outline-offset 0.15s ease-out, scale 0.15s ease-out;
  color: var(--wit-primary);
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
  position: relative;
  outline: 2px solid transparent;
  outline-offset: -2px;
  will-change: scale;
  aspect-ratio: 1;
  flex-shrink: 0;
}

.wit-btn:hover,
.wit-btn:focus-visible {
  background: rgba(255, 255, 255, 0.1);
}

.wit-btn:focus-visible {
  outline-color: currentColor;
  outline-offset: 2px;
}

.wit-btn:active {
  background: rgba(255, 255, 255, 0.15);
  scale: 0.98;
}

.wit-btn svg {
  width: var(--wit-icon-size);
  height: var(--wit-icon-size);
  fill: currentColor;
  display: block;
  filter: drop-shadow(0 1px 0 rgba(0, 0, 0, 0.15));
}

.wit-seek-btn {
  position: relative;
}

.wit-seek-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wit-seek-label {
  position: absolute;
  right: -1px;
  bottom: -3px;
  font-size: 10px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.wit-seek-btn--backward .wit-seek-label {
  right: auto;
  left: -1px;
}

.wit-play-btn {
  padding: 8px;
}

.wit-volume-wrap {
  display: flex;
  align-items: center;
  position: relative;
}

.wit-volume-wrap::after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 20px;
}

.wit-volume-slider {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border-radius: 9999px;
  padding: 10px 4px;
  margin-bottom: 8px;
  opacity: 0;
  visibility: hidden;
  filter: blur(8px);
  scale: 0.85;
  transition: opacity 0.15s ease-out, visibility 0.15s ease-out, filter 0.15s ease-out, scale 0.15s ease-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transform-origin: bottom center;
  pointer-events: none;
}

.wit-volume-wrap:hover .wit-volume-slider,
.wit-volume-wrap:hover::after,
.wit-volume-slider:hover {
  opacity: 1;
  visibility: visible;
  filter: blur(0);
  scale: 1;
  pointer-events: auto;
}

.wit-volume-value {
  color: var(--wit-primary);
  font-size: 12px;
  font-weight: 500;
  min-width: 32px;
  text-align: center;
}

.wit-volume-range {
  width: 4px;
  height: 80px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  cursor: pointer;
  writing-mode: vertical-lr;
  direction: rtl;
}

.wit-volume-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  background: var(--wit-primary);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.wit-volume-range::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: var(--wit-primary);
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.wit-time {
  color: var(--wit-primary);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.wit-time-current {
  text-align: left;
}

.wit-time-duration {
  text-align: right;
}

.wit-speed-wrap {
  position: relative;
}

.wit-speed-btn {
  font-size: 13px;
  font-weight: 500;
  width: 34px;
  height: 34px;
  justify-content: center;
  flex-shrink: 0;
}

.wit-speed-menu {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border-radius: 1.25rem;
  padding: 6px 0;
  min-width: 90px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  opacity: 0;
  filter: blur(8px);
  scale: 0.85;
  transition: opacity 0.15s ease-out, filter 0.15s ease-out, scale 0.15s ease-out;
  transform-origin: bottom;
  pointer-events: none;
}

.wit-speed-wrap:hover .wit-speed-menu:not(.wit-speed-menu--visible) {
  opacity: 0;
  filter: blur(8px);
  scale: 0.85;
  pointer-events: none;
}

.wit-speed-menu--visible {
  opacity: 1 !important;
  filter: blur(0) !important;
  scale: 1 !important;
  pointer-events: auto !important;
}

.wit-speed-item {
  display: block;
  width: calc(100% - 0.75rem);
  padding: 0.5rem 1rem;
  text-align: center;
  background: none;
  border: none;
  color: var(--wit-primary);
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 500;
  transition: background-color 0.15s ease-out;
  outline: 0.125rem solid transparent;
  outline-offset: -0.125rem;
  border-radius: 9999px;
  margin: 0.125rem 0.375rem;
  margin-left: auto;
  margin-right: auto;
}

.wit-speed-item:hover,
.wit-speed-item:focus-visible {
  background: rgba(255, 255, 255, 0.08);
}

.wit-speed-item:focus-visible {
  outline-color: currentColor;
  outline-offset: 0;
}

.wit-speed-item.wit-active {
  color: var(--wit-primary);
  background: rgba(255, 255, 255, 0.1);
}

.wit-container.wit-fullscreen {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  border-radius: 0;
}

.wit-container.wit-fullscreen .wit-controls {
  padding: 0 24px 24px;
}

.wit-container.wit-fullscreen .wit-controls-bar {
  padding: 10px 12px;
}

.wit-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--wit-surface);
  padding: 28px 36px;
  border-radius: 12px;
  text-align: center;
  z-index: 30;
  display: none;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: var(--wit-shadow);
  border: 1px solid var(--wit-border);
}

.wit-container.wit-error .wit-error {
  display: block;
}

.wit-error-icon {
  width: 48px;
  height: 48px;
  fill: #ef5350;
  margin-bottom: 12px;
}

.wit-error-text {
  color: var(--wit-primary);
  font-size: 14px;
  margin-bottom: 16px;
}

.wit-retry-btn {
  background: var(--wit-accent);
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background var(--wit-transition);
}

.wit-retry-btn:hover {
  background: #1976d2;
}

.wit-toast {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--wit-surface);
  color: var(--wit-primary);
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  z-index: 25;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--wit-border);
}

.wit-toast.wit-show {
  opacity: 1;
}

.wit-context-menu {
  position: fixed;
  z-index: 9999;
  background: rgba(20, 20, 30, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 6px 0;
  min-width: 150px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.wit-context-menu-item {
  padding: 10px 16px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  transition: all 0.15s;
}

.wit-context-menu-item:hover {
  background: rgba(99, 102, 241, 0.2);
  color: #fff;
}

.wit-danmaku-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 60px;
  overflow: hidden;
  pointer-events: none;
  z-index: 5;
}

.wit-danmaku-item {
  position: absolute;
  white-space: nowrap;
  font-size: 18px;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.8);
  animation: danmaku-move 8s linear forwards;
  pointer-events: none;
}

@keyframes danmaku-move {
  from {
    transform: translateX(100%);
    left: 100%;
  }
  to {
    transform: translateX(-100%);
    left: 0;
  }
}

.wit-danmaku-input {
  position: absolute;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}

.wit-danmaku-input input {
  width: 300px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  outline: none;
}

.wit-danmaku-input input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.wit-danmaku-input input:focus {
  border-color: rgba(99, 102, 241, 0.5);
}

@media (max-width: 768px) {
  .wit-controls {
    padding: 0 8px 8px;
  }
  
  .wit-controls-bar {
    padding: 8px;
    gap: 4px;
    flex-wrap: wrap;
  }
  
  .wit-progress-wrap--mobile {
    display: flex;
    flex: none;
    order: 1;
    width: 100%;
    padding: 0 4px;
    margin-bottom: 0;
  }
  
  .wit-progress-wrap--desktop {
    display: none;
  }
  
  .wit-left-controls {
    flex: 1;
    order: 2;
  }
  
  .wit-right-controls {
    flex: none;
    order: 2;
  }
  
  .wit-btn {
    padding: 6px;
  }
  
  .wit-btn svg {
    width: 20px;
    height: 20px;
  }
  
  .wit-time {
    font-size: 12px;
  }
  
  .wit-volume-slider {
    height: 60px;
    left: auto;
    right: 0;
    transform: none;
    transform-origin: bottom center;
  }
  
  .wit-volume-range {
    height: 60px;
  }
  
  .wit-speed-btn {
    font-size: 12px;
    width: 30px;
    height: 30px;
  }
  
  .wit-big-play,
  .wit-poster-play {
    width: 60px;
    height: 60px;
  }
  
  .wit-big-play svg,
  .wit-poster-play svg {
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 480px) {
  
  .wit-controls-bar {
    padding: 4px 5px;
  }
  
  .wit-btn {
    padding: 5px;
  }
  
  .wit-btn svg {
    width: 18px;
    height: 18px;
  }
  
  .wit-time {
    font-size: 11px;
  }
  
  .wit-speed-wrap {
    display: none;
  }
  
  .wit-volume-slider {
    display: none;
  }
  
  .wit-big-play,
  .wit-poster-play {
    width: 52px;
    height: 52px;
  }
  
  .wit-big-play svg,
  .wit-poster-play svg {
    width: 20px;
    height: 20px;
  }
}

@media (hover: none) {
  .wit-progress-thumb {
    opacity: 1;
    width: 16px;
    height: 16px;
  }
}
</style>
