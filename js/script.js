console.log("This is spotify clone");
let currentSong = new Audio();
let songs;
let curFolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  curFolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < as.length; i++) {
    let element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  // Show all the songs in the playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
    songUL.innerHTML=" ";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
                       <img class="invert" src="img/music.svg" alt="">
                       <div class="info">
                           <div>${song.replaceAll("%20", " ")}</div>
                           <div class="artist">Naman Saini</div>
                       </div>
                       <div class="playnow">
                           <span>Play Now</span>
                           <img class="invert" src="img/play2.svg" alt="">
                       </div>
                      </li>`;
  }

  //   Attach event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs;
}

const playMusic = (track, pause = false) => {
  // let audio=new Audio("/Songs/"+ track);
  currentSong.src = `/${curFolder}/` + track;
  if (!pause) {
    currentSong.play();
    playSong.src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

// displayAlbumns Function
async function displayAlbums()
{
  let a=await fetch("/Songs/");
  let response= await a.text();
  console.log(response);
  let div=document.createElement("div");
  div.innerHTML=response;
  let anchors=div.getElementsByTagName("a");
  console.log(anchors);
  let cardContainer=document.querySelector(".cardContainer");
  let array=Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    
  
    if(e.href.includes("/Songs") && !e.href.includes(".htaccess"))
    {
      let folder=e.href.split("/").slice(4)[0];
      let a= await fetch(`/Songs/${folder}/info.json`);
      let response=await a.json();
      console.log(response);
      cardContainer.innerHTML=cardContainer.innerHTML+ `<div data-folder="${folder}" class="cards radius2 ">
      <div class="playbutton">
          <img src="img/playbutton.svg" alt="">
      </div>
      <img src="/Songs/${folder}/cover.jpg" alt="">
      <h2>${response.title}</h2>
      <p>${response.description}</p>
  </div>`;

    }
  }
  // Load the playlist when the card is clicked
  Array.from(document.getElementsByClassName("cards")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      console.log(item, item.currentTarget.dataset);
      songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });

}

async function main() {
 await getSongs("Songs/ncs");
  playMusic(songs[0], true);


  // Display all the albumns on the page
  displayAlbums();

  //   Attach event listener to play button
  playSong.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      playSong.src = "img/pause.svg";
    } else {
      currentSong.pause();
      playSong.src = "img/play2.svg";
    }
  });

  // adding event listener on change of time
  currentSong.addEventListener("timeupdate", () => {
    // making songtime active
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;

    // making seekbar active
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Adding an event Listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Adding an event listener to hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  // Adding an evenet listener to close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // Adding an event listener to previous button
  prevSong.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  // Adding an event listener to next button
  nextSong.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 <= songs.length - 1) {
      playMusic(songs[index + 1]);
    }
  });

  // Adding an event listener to volume button
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log("Setting volume to " + e.target.value + " /100");
      currentSong.volume = parseInt(e.target.value) / 100;
      if(currentSong.volume > 0)
      {
        document.querySelector(".volume>img").src=document.querySelector(".volume>img").src.replace("mute.svg","volume.svg");
      }
    });


    // Adding an event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click",(e)=>{
      if(e.target.src.includes("volume.svg") )
      {
        e.target.src=e.target.src.replace("volume.svg","mute.svg");
        currentSong.volume=0;
        document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value=0;
      }
      else{
        e.target.src=e.target.src.replace("mute.svg","volume.svg");
        currentSong.volume=.4;
        document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value=40;
      }
    })
  
}
main();
