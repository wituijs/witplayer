import { createApp, h } from 'vue'
import videoPlayerComponent from './components/videoPlayer.vue'
import Hls from 'hls.js'

// 确保 HLS.js 被打包
if (typeof window !== 'undefined') {
  window.Hls = Hls
}

function witPlayer(options) {
  const { container, src, ...props } = options
  
  let containerEl = typeof container === 'string' 
    ? document.querySelector(container) 
    : container
  
  if (!containerEl) {
    console.error('witPlayer: container not found')
    return null
  }
  
  const wrapper = document.createElement('div')
  wrapper.style.cssText = 'width: 100%; height: 100%;'
  containerEl.appendChild(wrapper)
  
  const app = createApp({
    render() {
      return h(videoPlayerComponent, { src, ...props })
    }
  })
  
  const instance = app.mount(wrapper)
  
  this.play = () => instance.$el?.querySelector('video')?.play()
  this.pause = () => instance.$el?.querySelector('video')?.pause()
  this.stop = () => {
    const video = instance.$el?.querySelector('video')
    if (video) {
      video.pause()
      video.currentTime = 0
    }
  }
  this.seek = (time) => {
    const video = instance.$el?.querySelector('video')
    if (video) {
      video.currentTime = time
    }
  }
  this.setVolume = (vol) => {
    const video = instance.$el?.querySelector('video')
    if (video) {
      video.volume = Math.max(0, Math.min(1, vol))
    }
  }
  this.sendDanmaku = (text, color) => {
    if (instance.sendDanmaku) {
      instance.sendDanmaku(text, color)
    }
  }
  this.destroy = () => {
    app.unmount()
    wrapper.remove()
  }
}

export default witPlayer
