//<![CDATA[
if (document.createStyleSheet) {
  document.createStyleSheet("https://cdn.plyr.io/3.5.6/plyr.css");
} else {
  var styles = "@import url('https://cdn.plyr.io/3.5.6/plyr.css');";
  var newSS = document.createElement("link");
  newSS.rel = "stylesheet";
  newSS.href = "data:text/css," + escape(styles);
  document.getElementsByTagName("head")[0].appendChild(newSS);
}

function time_ago(time) {
  switch (typeof time) {
    case "number":
      break;
    case "string":
      time = +new Date(time);
      break;
    case "object":
      if (time.constructor === Date) time = time.getTime();
      break;
    default:
      time = +new Date();
  }
  var time_formats = [
    [60, "segundos", 1], // 60
    [120, "1 munuto atrás", "1 minute from now"], // 60*2
    [3600, "minutos", 60], // 60*60, 60
    [7200, "1 hora atrás", "1 hour from now"], // 60*60*2
    [86400, "horas", 3600], // 60*60*24, 60*60
    [172800, "Ontem", "Amanhã"], // 60*60*24*2
    [604800, "dias", 86400], // 60*60*24*7, 60*60*24
    [1209600, "Semana Passada", "Proxima Semana"], // 60*60*24*7*4*2
    [2419200, "Semanas", 604800], // 60*60*24*7*4, 60*60*24*7
    [4838400, "Last month", "Next month"], // 60*60*24*7*4*2
    [29030400, "months", 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, "Last year", "Next year"], // 60*60*24*7*4*12*2
    [2903040000, "years", 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, "Last century", "Next century"], // 60*60*24*7*4*12*100*2
    [58060800000, "centuries", 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  var seconds = (+new Date() - time) / 1000,
    token = "atrás",
    list_choice = 1;

  if (seconds == 0) {
    return "Just now";
  }
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = "from now";
    list_choice = 2;
  }
  var i = 0,
    format;
  while ((format = time_formats[i++]))
    if (seconds < format[0]) {
      if (typeof format[2] == "string") return format[list_choice];
      else
        return Math.floor(seconds / format[2]) + " " + format[1] + " " + token;
    }
  return time;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

var loss = 0;

const progressBarUpdate = async () => {
  var TotalVideoTime = players.duration;
  var CurrentVideoTime = players.currentTime;

  var percent =
    Math.round((CurrentVideoTime / TotalVideoTime) * 100 * 100) / 100;

  var multiply = 3;
  var progress = 20; // x/100
  var currentProgress = "0%";

  var elProgress = document.querySelectorAll("[id=progress-bar]");

  for (var i = 0, len = elProgress.length; i < len; i++) {
    //work with checkboxes[i]
    if (percent < progress) {
      currentProgress = percent * multiply + "%";
    } else if (percent >= 100) {
      currentProgress = "100%";
    } else if (percent > progress || percent < 99.9) {
      currentProgress = progress * multiply + percent / multiply + "%";
    }
    elProgress[i].style.width = currentProgress;
  }

  /* if (percent < progress) {
    document.getElementById("progress-bar").style.width =
      percent * multiply + "%";
  } else if (percent >= 100) {
    document.getElementById("progress-bar").style.width = "100%";
  } else if (percent > progress || percent < 99.9) {
    document.getElementById("progress-bar").style.width =
      //com 20% do video a barra estara em 60%
      //93.33% 7.66%
      progress * multiply + percent / multiply + "%";
  }*/
  //60%+

  //console.log(`${CurrentVideoTime} de ${TotalVideoTime}`);
  //console.log(percent);

  //document.getElementById("progress-bar").style.width = percent + "%";

  await sleep(1000);
  progressBarUpdate();
};

const creatPlayer = async () => {
  var players = Plyr.setup(".js-player", options);

  var options = {
    autoplay: true,
    clickToPlay: true,
    //showPosterOnEnd: true,
    muted: true,
    //debug: true,
    //volume: 0,
    fullscreen: {
      enabled: false,
      fallback: true,
      iosNative: false,
      container: null,
    },
    controls: ["play", "mute"],
  };

  window.players = players[0];

  players[0].on("ended", function (event) {
    console.log("test");
  });

  players[0].on("ready", (event) => {
    var el = document.getElementById("sound");
    el.classList.remove("none");

    var el = document.getElementById("progress");
    el.classList.remove("none");

    players[0].volume = 0;
    starPlayer();
    progressBarUpdate();
    // players[0].muted = false;
  });

  players[0].on("progress", function (event) {
    //console.log(event);
  });

  players[0].on("playing", function (event) {
    //document.getElementById("sound").remove();
    //
  });

  return players[0];
};

document.querySelectorAll(".sound").forEach((item) => {
  item.addEventListener("click", (event) => {
    starPlayer();
    document.getElementById("sound").remove();
    players.volume = 1;
  });
});
/*
var el = document.getElementById("sound");
el.addEventListener(
  "click",
  function () {
    
    //creatPlayer[0].muted = false;
    //starPlayer();
  },
  false
);*/

function starPlayer() {
  try {
    players.play();
  } catch (error) {
    //  Block of code to handle errors
    console.log("nao deu");
  }
}

if (!!window.IntersectionObserver) {
  let video = document.getElementById("video");
  let isPaused = false; /* flag for auto-pausing of the video */
  let observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio != 1) {
          console.log("Não está vendo o video");
          // nao está vendo o video mais o video já começou
          document.querySelector("#warning").style.display = "block";
          // video.pause();
          isPaused = true;
        } else if (isPaused) {
          document.querySelector("#warning").style.display = "none";
          console.log("Vendo de novo");
          /// video.play();
          // isPaused = false;
        }
      });
    },
    { threshold: 1 }
  );
  observer.observe(video);
} else document.querySelector("#warning").style.display = "block";

window.addEventListener("load", function () {
  var StartTime = 14 * 60 * 1000;

  document.querySelectorAll(".time").forEach(function (button) {
    // Now do something with my button

    button.innerHTML = time_ago(new Date(Date.now() - StartTime));
    StartTime =
      StartTime + (Math.floor(Math.random() * 5) + 1) * 60 * 60 * 1000;
  });

  console.log("Pagina Carregada");
  creatPlayer();
  fetch("https://geolocation-db.com/json/")
    .then((r) =>
      r.json().then((data) => {
        console.log(data.city);

        document.getElementById("city").innerHTML = data.city;
      })
    )
    .catch((error) => {
      document.getElementById("message").remove();
    });
});
