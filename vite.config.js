import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs'

const copyIndexPlugin = () => ({
  name: 'copy-index',
  closeBundle() {
    const distDir = resolve(__dirname, 'dist')
    if (!existsSync(distDir)) {
      mkdirSync(distDir, { recursive: true })
    }
    copyFileSync(
      resolve(__dirname, 'public/index.html'),
      resolve(distDir, 'index.html')
    )
  }
})

const inlineCssPlugin = () => ({
  name: 'inline-css',
  enforce: 'post',
  closeBundle() {
    const distDir = resolve(__dirname, 'dist')
    const cssFile = resolve(distDir, 'wit-player.css')
    const jsFile = resolve(distDir, 'wit-player.js')
    
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

const fixUmdExportPlugin = () => ({
  name: 'fix-umd-export',
  enforce: 'post',
  closeBundle() {
    const distDir = resolve(__dirname, 'dist')
    const jsFile = resolve(distDir, 'wit-player.js')
    
    if (existsSync(jsFile)) {
      let js = readFileSync(jsFile, 'utf-8')
      
      js = js.replace(
        /t\.default=\w+,t\.witPlayer=\w+,Object\.defineProperties\(t,\{__esModule:\{value:!0\},\[Symbol\.toStringTag\]:\{value:"Module"\}\}\)/g,
        't.default=void 0,t.witPlayer=void 0,Object.defineProperties(t,{__esModule:{value:!1}})'
      )
      
      writeFileSync(jsFile, js)
    }
  }
})

export default defineConfig({
  plugins: [vue(), copyIndexPlugin(), inlineCssPlugin(), fixUmdExportPlugin()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: 'witPlayer',
      fileName: () => 'wit-player.js',
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
        assetFileNames: 'wit-player.[ext]'
      }
    }
  }
})
