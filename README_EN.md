# witplayer

A lightweight video player supporting MP4, HLS/M3U8, and live streaming, perfectly adapted for mobile devices.

[中文文档](./README.md) | [Live Demo](https://www.wit-ui.com/witplayer/)

## Features

- 🎬 Multi-format support: MP4, HLS/M3U8, FLV
- 📡 Live streaming: Low-latency HLS live streams
- 📱 Mobile-friendly: Smooth touch interactions, responsive layout
- 🎨 Beautiful UI: Modern interface design with fade animations
- 💬 Danmaku support: Display and send danmaku (bullet comments)
- 🖼️ Poster image: Support for video poster images
- 📋 Context menu: Copy video URL, version info

## Installation

```bash
npm install witplayer
```

## Usage

### Method 1: NPM Import

```js
import witplayer from 'witplayer';

const player = new witplayer({
  container: '#player',
  src: 'https://example.com/video.m3u8',
  isM3u8: true
});
```

### Method 2: CDN / Direct Include

```html
<!DOCTYPE html>
<html>
<head>
</head>
<body>
  <div id="player" style="width: 800px; height: 450px;"></div>
  
  <script src="https://unpkg.com/witplayer/dist/witplayer.js"></script>
  <script>
    const player = new witplayer({
      container: '#player',
      src: 'https://example.com/video.m3u8',
      isM3u8: true
    });
  </script>
</body>
</html>
```

## Configuration Options

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| container | `string \| Element` | - | Player container, required |
| src | `string` | - | Video URL, required |
| poster | `string` | `''` | Video poster image |
| isM3u8 | `boolean` | `false` | Whether it's M3U8 format |
| isLive | `boolean` | `false` | Whether it's a live stream |
| autoplay | `boolean` | `false` | Auto-play |
| muted | `boolean` | `false` | Mute |
| loop | `boolean` | `false` | Loop playback |
| volume | `number` | `1` | Volume (0-1) |
| controls | `boolean` | `true` | Show controls |
| danmaku | `boolean` | `false` | Enable danmaku |
| danmakuList | `array` | `[]` | Preset danmaku list |
| codec | `string` | `''` | Video codec format |

## API Methods

```js
const player = new witplayer({ ... });

player.play();              // Play
player.pause();             // Pause
player.stop();              // Stop (pause and return to start)
player.seek(30);            // Seek to 30 seconds
player.setVolume(0.5);      // Set volume to 50%
player.sendDanmaku('Danmaku text', '#ff0000');  // Send danmaku
player.destroy();           // Destroy player
```

## Danmaku Feature

### Basic Configuration

```js
const player = new witplayer({
  container: '#player',
  src: 'video.m3u8',
  isM3u8: true,
  danmaku: true,  // Enable danmaku feature, shows danmaku button and display area
  danmakuList: [
    { id: 1, time: 1, text: 'Danmaku content', color: '#fff' },
    { id: 2, time: 5, text: 'Another danmaku', color: '#ff5f56' }
  ]
});
```

### Danmaku Button States

- When `danmaku: true` is set, the player controls will display a danmaku button
- The danmaku button has two states:
  - **Enabled**: Shows normal danmaku icon
  - **Disabled**: Shows semi-transparent danmaku icon with a slash
- Click the danmaku button to toggle danmaku display on/off

### Send Real-time Danmaku

```js
// Send real-time danmaku
player.sendDanmaku('Real-time danmaku', '#007aff');
```

### Disable Danmaku Feature

If you don't want to show the danmaku button and feature, simply don't set the `danmaku` parameter or set it to `false`:

```js
const player = new witplayer({
  container: '#player',
  src: 'video.m3u8',
  isM3u8: true,
  danmaku: false  // Don't show danmaku button and feature
});
```

## H.265 Support

```js
const player = new witplayer({
  container: '#player',
  src: 'video.mp4',
  codec: 'video/mp4; codecs="hvc1"'  // H.265 codec
});
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Publish to NPM

```bash
# Login to npm
npm login

# Publish
npm publish
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## License

MIT
