const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $('.cd');
const heading = $('header h2')
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "We Don't Talk Anymore",
      singer: "Charlie Puth",
      path: "./assets/music/song1.mp3",
      image: "https://i.ytimg.com/vi/A3TKxux17ZA/sddefault.jpg"
    },
    {
      name: "SummerTime",
      singer: "K 391",
      path: "./assets/music/song2.mp3",
      image:
        "https://i.ytimg.com/vi/25N1pdzvp4c/0.jpg"
    },
    {
      name: "Believer",
      singer: "Imagine Dragons",
      path:
        "./assets/music/song3.mp3",
      image: "https://i.ytimg.com/vi/7wtfhZwyrcc/0.jpg"
    },
    {
      name: "Monsters",
      singer: "Kaite Sky",
      path: "./assets/music/song4.mp3",
      image:
        "https://i.ytimg.com/vi/xHWIhCUnfOE/0.jpg"
    },
    {
      name: "The Nights",
      singer: "Avicii",
      path: "./assets/music/song5.mp3",
      image:
        "https://i.ytimg.com/vi/UtF6Jej8yb4/0.jpg"
    },
    {
      name: "Shappe Of You",
      singer: "Ed Sheeran",
      path:
        "./assets/music/song6.mp3",
      image:
        "https://i.ytimg.com/vi/JGwWNGJdvx8/0.jpg"
    },
    {
      name: "Waiting For Love",
      singer: "Avicii",
      path: "./assets/music/song7.mp3",
      image:
        "https://i.ytimg.com/vi/cHHLHGNpCSA/0.jpg"
    },
    {
      name: "Despacito",
      singer: "Luis Fonsi",
      path: "./assets/music/song8.mp3",
      image:
        "https://i.ytimg.com/vi/kJQP7kiw5Fk/0.jpg"
    },
    {
      name: "Pretty Girl",
      singer: "Maggie Lindemann",
      path: "./assets/music/song9.mp3",
      image:
        "https://i.ytimg.com/vi/WEFJnYMz0Ec/0.jpg"
    },
    {
      name: "Some Thing Just Like This",
      singer: "The Chainsmokers & Coldplay",
      path: "./assets/music/song10.mp3",
      image:
        "https://i.ytimg.com/vi/FM7MFYoylVs/0.jpg"
    }
  ],

  render: function () {
    const htmls = this.songs.map((song, index) =>
      `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index= "${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
    )
    playlist.innerHTML = htmls.join('')
  },

  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex];
      }
    })
  },

  loadCurrentSong: function () {

    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0
    }
    this.loadCurrentSong()
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1
    }
    this.loadCurrentSong()
  },

  randomSong: function () {
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * this.songs.length)
    } while (newIndex === this.currentIndex)
    this.currentIndex = newIndex
    this.loadCurrentSong();
  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }, 200)
  },

  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    const cdThumbAnimate = cdThumb.animate([
      { transform: 'rotate(360deg)' }
    ], {
      duration: 10000,
      interations: Infinity
    })

    cdThumbAnimate.pause();

    document.onscroll = function () {
      const scrollTop = document.documentElement.scrollTop || window.scrollY;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    }

    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    }

    audio.onplay = function () {
      _this.isPlaying = true
      player.classList.add('playing')
      cdThumbAnimate.play()

    }

    audio.onpause = function () {
      _this.isPlaying = false
      player.classList.remove('playing')
      cdThumbAnimate.pause()
    }

    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.value = progressPercent
      }
    }

    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play()
      } else {
        nextBtn.click();
      }
    }

    progress.onchange = function (e) {
      const seekTime = e.target.value * audio.duration / 100;
      audio.currentTime = seekTime;
    }

    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong()
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();

    }

    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong()
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();

    }

    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle('active', _this.isRandom)
    }

    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle('active', _this.isRepeat)
    }

    playlist.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active)')
      if (songNode || e.target.closest('.option')){
        
        if (songNode) {
          _this.currentIndex = Number(songNode.getAttribute('data-index'));
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
      }
    }
  },

  start: function () {
    this.defineProperties();

    this.handleEvents();

    this.loadCurrentSong();

    this.render();

  }


}

app.start();