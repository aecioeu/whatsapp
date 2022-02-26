var els = document.querySelectorAll(".lazy");
for (var i = 0; i < els.length; i++) {
  var image = els[i].getAttribute("data-src");
  //els[i].setAttribute("src", img);
  var img = new Image();
  img.src = image;
}
window.addEventListener("load", function () {
  for (var i = 0; i < els.length; i++) {
    var image = els[i].getAttribute("data-src");
    els[i].setAttribute("src", image);
  }
  var prev_connected = document.getElementsByClassName("load");
  for (var i = prev_connected.length - 1; i >= 0; i--) {
    prev_connected[i].classList.remove("load", "load-rouded");
    //console.log(i, prev_connected[i - 1]);
  }
});

window.onload = function () {
  document.body.oncontextmenu = function () {
    return false;
  };
  window.addEventListener("selectstart", function (e) {
    e.preventDefault();
  });
  document.addEventListener(
    "keydown",
    function (e) {
      if (
        e.keyCode == 83 &&
        (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    false
  );
};
