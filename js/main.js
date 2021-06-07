const container = document.querySelector(".container"),
    musicImg = container.querySelector('.img img'),
    musicName = container.querySelector('.details .song-name'),
    musicArtist = container.querySelector('.details .song-artist'),
    musicAudio = container.querySelector('#main-audio'),
    playpausebtn = container.querySelector('.play-pause'),
    progressBar = container.querySelector('.line'),
    progressArea = container.querySelector('.song-bar'),
    prevbtn = container.querySelector('#prev'),
    nextbtn = container.querySelector('#next'),
    repeatbtn = container.querySelector('#repeat'),
    musicList = container.querySelector('.music-list'),
    showMorebtn = container.querySelector('#more-music'),
    hideMorebtn = musicList.querySelector('#close'),
    musicCurrentTime = container.querySelector('.run-time'),
    musicDuration = container.querySelector('.rem-time');

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingNow();
});

function loadMusic(indexNumber) {
    musicName.innerText = allMusic[indexNumber - 1].name;
    musicArtist.innerText = allMusic[indexNumber - 1].artist;
    musicImg.src = `img/${allMusic[indexNumber - 1].img}.jpg`;
    musicAudio.src = `music/${allMusic[indexNumber - 1].src}.mp3`;
}

playpausebtn.addEventListener('click', () => {
    const isMusicPaused = container.classList.contains('paused');
    isMusicPaused ? pauseMusic() : playMusic();
});

function playMusic() {
    container.classList.add("paused");
    playpausebtn.querySelector("i").innerText = 'pause';
    musicAudio.play();
}
function pauseMusic() {
    container.classList.remove("paused");
    playpausebtn.querySelector("i").innerText = 'play_arrow';
    musicAudio.pause();
}

nextbtn.addEventListener('click', () => {
    nextMusic();
});
prevbtn.addEventListener('click', () => {
    prevMusic();
});

function nextMusic() {
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
function prevMusic() {
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

musicAudio.addEventListener('timeupdate', (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressBarWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressBarWidth}%`;


    musicAudio.addEventListener("loadeddata", () => {

        // Update TotalTime of song
        let audioDuration = musicAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`
    });

    // Update CurrentTime of song
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener("click", (e) => {
    let progressBarWidthval = progressArea.clientWidth;
    let clickedoffsetX = e.offsetX;
    let songDuration = musicAudio.duration;
    musicAudio.currentTime = (clickedoffsetX / progressBarWidthval) * songDuration;
    playMusic();
    playingNow();
});

repeatbtn.addEventListener('click', () => {
    let getText = repeatbtn.innerText;

    switch (getText) {
        case 'repeat':
            repeatbtn.innerText = 'repeat_one';
            repeatbtn.setAttribute("title", "Song Loop");
            break;
        case 'repeat_one':
            repeatbtn.innerText = 'shuffle';
            repeatbtn.setAttribute("title", "Playback Shuffle");
            break;
        case 'shuffle':
            repeatbtn.innerText = 'repeat';
            repeatbtn.setAttribute("title", "Playlist Loop");
            break;
    }
});

musicAudio.addEventListener('ended', () => {
    let getText = repeatbtn.innerText;

    switch (getText) {
        case 'repeat':
            nextMusic();
            break;
        case 'repeat_one':
            musicAudio.musicCurrentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
        case 'shuffle':
            let randmIndex;
            do {
                randmIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randmIndex);

            musicIndex = randmIndex;
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
    }
});


showMorebtn.addEventListener('click', () => {
    musicList.classList.toggle('show');
});
hideMorebtn.addEventListener('click', () => {
    showMorebtn.click();
});


const ulTag = container.querySelector('ul');
for (let i = 0; i < allMusic.length; i++) {
    let liTag = 
    `<li li-index="${i + 1}">
    <div class="row">
    <span>${allMusic[i].name}</span>
    <p>${allMusic[i].artist}</p>
    </div>
    <span id="${allMusic[i].src}" class="audio-duration"></span>
    <audio class="${allMusic[i].src}" src="music/${allMusic[i].src}.mp3"></audio>
    </li>`;
    ulTag.insertAdjacentHTML('beforeend', liTag);
    
    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener('loadeddata', ()=>{
        // Update TotalTime of song
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}

const allLiTags = ulTag.querySelectorAll('li');
function playingNow(){
    for (let j = 0; j < allLiTags.length; j++) {

        let audioTag = allLiTags[j].querySelector('.audio-duration');

        if(allLiTags[j].classList.contains('playing')){
            allLiTags[j].classList.remove('playing');
            let addDuration = audioTag.getAttribute('t-duration');
            console.log(addDuration);
            audioTag.innerText = addDuration;
        }

        if(allLiTags[j].getAttribute('li-index') == musicIndex){
            allLiTags[j].classList.add('playing');
            audioTag.innerText = "Playing";
        }
        allLiTags[j].setAttribute('onclick', 'clicked(this)');
    }
}

function clicked(e){
    let getLiIndex = e.getAttribute('li-index');
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}