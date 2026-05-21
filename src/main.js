import { createApp, h } from 'vue'
import videoPlayerComponent from './components/videoPlayer.vue'
import Hls from 'hls.js'

const witPlayer = {
  install(app) {
    app.component('videoPlayer', videoPlayerComponent)
  },
  
  async create(options) {
    const { container, src, ...props } = options
    
    const containerEl = typeof container === 'string' 
      ? document.querySelector(container) 
      : container
    
    if (!containerEl) {
      console.error('witPlayer: container not found')
      return null
    }
    
    const app = createApp({
      render() {
        return h(videoPlayerComponent, { src, ...props })
      }
    })
    
    const instance = app.mount(containerEl)
    
    return {
      play: () => instance.$el?.querySelector('video')?.play(),
      pause: () => instance.$el?.querySelector('video')?.pause(),
      stop: () => {
        const video = instance.$el?.querySelector('video')
        if (video) {
          video.pause()
          video.currentTime = 0
        }
      },
      seek: (time) => {
        const video = instance.$el?.querySelector('video')
        if (video) {
          video.currentTime = time
        }
      },
      setVolume: (vol) => {
        const video = instance.$el?.querySelector('video')
        if (video) {
          video.volume = Math.max(0, Math.min(1, vol))
        }
      },
      destroy: () => {
        app.unmount()
      }
    }
  }
}

export default witPlayer
