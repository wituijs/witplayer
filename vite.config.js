import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'

const inlineCssPlugin = () => ({
  name: 'inline-css',
  enforce: 'post',
  generateBundle(options, bundle) {
    let cssContent = ''
    
    for (const fileName in bundle) {
      if (fileName.endsWith('.css')) {
        cssContent += bundle[fileName].source
        delete bundle[fileName]
      }
    }
    
    if (cssContent) {
      const styleInjection = `const style=document.createElement('style');style.textContent=${JSON.stringify(cssContent)};document.head.appendChild(style);`
      
      for (const fileName in bundle) {
        if (fileName.endsWith('.js')) {
          bundle[fileName].code = styleInjection + bundle[fileName].code
        }
      }
    }
  }
})

const copyHtmlPlugin = () => ({
  name: 'copy-html',
  enforce: 'post',
  closeBundle() {
    const distDir = resolve(__dirname, 'dist')
    const srcHtml = resolve(__dirname, 'index.html')
    const distHtml = resolve(distDir, 'index.html')
    
    if (existsSync(srcHtml)) {
      let html = readFileSync(srcHtml, 'utf-8')
      
      html = html.replace(
        /<script type="module" src="\/src\/dev\.js"><\/script>/g,
        ''
      )
      
      html = html.replace(
        /<\/head>/g,
        '  <script src="./witplayer.js"></script>\n</head>'
      )
      
      const initScript = `
  <script>
    let player = null;
    const sources = {
      mp4: {
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
        poster: 'https://www.w3schools.com/html/mov_bbb.mp4#t=0.1'
      },
      hls: {
        src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        isM3u8: true,
        danmaku: true,
        danmakuList: [
          { id: 1, time: 1, text: '测试弹幕1', color: '#fff' },
          { id: 2, time: 3, text: '这是一条弹幕', color: '#ff5f56' },
          { id: 3, time: 5, text: 'witplayer 弹幕功能', color: '#27c93f' },
          { id: 4, time: 8, text: '支持自定义颜色', color: '#007aff' },
          { id: 5, time: 12, text: '弹幕飘过~', color: '#ff9500' },
        ]
      },
      live: {
        src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        isM3u8: true,
        isLive: true,
        danmaku: true
      }
    };
    
    function initPlayer(type) {
      if (player && player.destroy) {
        player.destroy();
      }
      
      const config = sources[type];
      player = new witplayer({
        container: '#player',
        src: config.src,
        isM3u8: config.isM3u8,
        isLive: config.isLive,
        poster: config.poster,
        danmaku: config.danmaku,
        danmakuList: config.danmakuList,
        autoplay: false,
        muted: false,
        volume: 0.8
      });
    }
    
    document.querySelectorAll('.tab').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        initPlayer(this.dataset.type);
      });
    });
    
    initPlayer('hls');
  </script>`
      
      html = html.replace(
        /<\/body>/g,
        initScript + '\n</body>'
      )
      
      writeFileSync(distHtml, html)
    }
  }
})

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      plugins: [vue()],
      server: {
        host: true
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify('development')
      }
    }
  }
  
  return {
    plugins: [vue(), inlineCssPlugin(), copyHtmlPlugin()],
    define: {
      'process.env.NODE_ENV': JSON.stringify('production')
    },
    build: {
      lib: {
        entry: resolve(__dirname, 'src/main.js'),
        name: 'witplayer',
        fileName: (format) => 'witplayer.js',
        formats: ['iife']
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log']
        },
        mangle: {
          toplevel: false,
          safari10: true
        },
        format: {
          comments: false
        }
      },
      rollupOptions: {
        output: {
          compact: true
        }
      }
    }
  }
})
