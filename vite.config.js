import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs'

const inlineCssPlugin = () => ({
  name: 'inline-css',
  enforce: 'post',
  closeBundle() {
    const distDir = resolve(__dirname, 'dist')
    const cssFile = resolve(distDir, 'witplayer.css')
    const jsFile = resolve(distDir, 'witplayer.js')
    
    if (existsSync(cssFile) && existsSync(jsFile)) {
      const css = readFileSync(cssFile, 'utf-8')
      let js = readFileSync(jsFile, 'utf-8')
      
      const styleInjection = `(function(){var s=document.createElement('style');s.textContent=${JSON.stringify(css)};document.head.appendChild(s)})();`
      
      js = styleInjection + js
      
      writeFileSync(jsFile, js)
      unlinkSync(cssFile)
    }
  }
})

const transformHtmlPlugin = () => ({
  name: 'transform-html',
  enforce: 'post',
  closeBundle() {
    const distDir = resolve(__dirname, 'dist')
    const htmlFile = resolve(distDir, 'index.html')
    
    if (existsSync(htmlFile)) {
      let html = readFileSync(htmlFile, 'utf-8')
      
      html = html.replace(
        /<script type="module" src="\/src\/dev\.js"><\/script>/g,
        '<script src="./witplayer.js"></script>'
      )
      
      writeFileSync(htmlFile, html)
    }
  }
})

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      plugins: [vue()],
      define: {
        'process.env.NODE_ENV': JSON.stringify('development')
      }
    }
  }
  
  return {
    plugins: [vue(), inlineCssPlugin(), transformHtmlPlugin()],
    define: {
      'process.env.NODE_ENV': JSON.stringify('production')
    },
    build: {
      lib: {
        entry: resolve(__dirname, 'src/main.js'),
        name: 'witplayer',
        fileName: () => 'witplayer.js',
        formats: ['umd']
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log']
        },
        mangle: {
          toplevel: true,
          safari10: true
        },
        format: {
          comments: false
        }
      },
      rollupOptions: {
        output: {
          globals: {},
          exports: 'default',
          compact: true,
          assetFileNames: 'witplayer.[ext]'
        }
      }
    }
  }
})
