# witplayer

轻量级视频播放器，支持 MP4、HLS/M3U8、直播流，完美适配移动端。

[English Documentation](./README_EN.md) | [在线演示](https://www.wit-ui.com/witplayer/)

## 特性

- 🎬 多格式支持：MP4、HLS/M3U8、FLV
- 📡 直播支持：低延迟 HLS 直播流
- 📱 移动端适配：触摸交互流畅，响应式布局
- 🎨 精美 UI：现代化界面设计，淡入淡出动画
- 💬 弹幕功能：支持弹幕显示与发送
- 🖼️ 封面图：支持视频封面图
- 📋 右键菜单：复制视频地址、版本信息

## 安装

```bash
npm install witplayer
```

## 使用方式

### 方式一：NPM 引入

```js
import witplayer from 'witplayer';

const player = new witplayer({
  container: '#player',
  src: 'https://example.com/video.m3u8',
  isM3u8: true
});
```

### 方式二：CDN / 直接引入

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

## 配置选项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| container | `string \| Element` | - | 播放器容器，必填 |
| src | `string` | - | 视频地址，必填 |
| poster | `string` | `''` | 视频封面图 |
| isM3u8 | `boolean` | `false` | 是否为 M3U8 格式 |
| isLive | `boolean` | `false` | 是否为直播流 |
| autoplay | `boolean` | `false` | 自动播放 |
| muted | `boolean` | `false` | 静音 |
| loop | `boolean` | `false` | 循环播放 |
| volume | `number` | `1` | 音量 (0-1) |
| controls | `boolean` | `true` | 显示控制条 |
| danmaku | `boolean` | `false` | 开启弹幕 |
| danmakuList | `array` | `[]` | 预设弹幕列表 |
| codec | `string` | `''` | 视频编码格式 |

## API 方法

```js
const player = new witplayer({ ... });

player.play();              // 播放
player.pause();             // 暂停
player.stop();              // 停止（暂停并回到起点）
player.seek(30);            // 跳转到 30 秒
player.setVolume(0.5);      // 设置音量为 50%
player.sendDanmaku('弹幕内容', '#ff0000');  // 发送弹幕
player.destroy();           // 销毁播放器
```

## 弹幕功能

### 基本配置

```js
const player = new witplayer({
  container: '#player',
  src: 'video.m3u8',
  isM3u8: true,
  danmaku: true,  // 开启弹幕功能，会显示弹幕按钮和弹幕显示区域
  danmakuList: [
    { id: 1, time: 1, text: '弹幕内容', color: '#fff' },
    { id: 2, time: 5, text: '另一条弹幕', color: '#ff5f56' }
  ]
});
```

### 弹幕按钮说明

- 当设置 `danmaku: true` 时，播放器控制栏会显示弹幕按钮
- 弹幕按钮有两种状态：
  - **开启状态**：显示正常弹幕图标
  - **关闭状态**：显示半透明弹幕图标并带斜线
- 点击弹幕按钮可以切换弹幕的显示/隐藏

### 发送实时弹幕

```js
// 发送实时弹幕
player.sendDanmaku('实时弹幕', '#007aff');
```

### 关闭弹幕功能

如果不希望显示弹幕按钮和弹幕功能，只需不设置 `danmaku` 参数或设置为 `false`：

```js
const player = new witplayer({
  container: '#player',
  src: 'video.m3u8',
  isM3u8: true,
  danmaku: false  // 不显示弹幕按钮和弹幕功能
});
```

## H.265 支持

```js
const player = new witplayer({
  container: '#player',
  src: 'video.mp4',
  codec: 'video/mp4; codecs="hvc1"'  // H.265 编码
});
```

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 发布到 NPM

```bash
# 登录 npm
npm login

# 发布
npm publish
```

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## License

MIT
