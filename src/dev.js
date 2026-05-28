import witPlayer from './main.js';

window.witplayer = witPlayer;

let player = null;

const sources = {
  mp4: {
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster: 'https://www.w3schools.com/html/mov_bbb.mp4#t=0.1',
    danmaku: true,
    danmakuList: [
      { id: 1, time: 1, text: 'MP4弹幕测试', color: '#fff' },
      { id: 2, time: 2, text: '支持MP4弹幕', color: '#ff5f56' },
      { id: 3, time: 3, text: 'witplayer', color: '#27c93f' },
    ]
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
  player = new witPlayer({
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
