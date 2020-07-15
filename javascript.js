function checkCert() {
   const urlParams = new URLSearchParams(window.location.search);

   //mandatory params
   const type = urlParams.get("type");
   const hash = urlParams.get("key");

   var allParams = [];
   var flattenedParams = [];
   for (var entry of urlParams.entries()) {
      if (entry[0] != "key") {
         allParams.push(entry);
         flattenedParams.push(entry[0]);
         flattenedParams.push(entry[1]);
      }
   }

   var correctHash = keyHash(flattenedParams);

   if (!(type || hash)) {
      console.log("no params");
      window.addEventListener
         ? window.addEventListener("load", homePage, false)
         : window.attachEvent && window.attachEvent("onload", homePage);
   } else if (hash == correctHash) {
      //wait until elements exist
      var observer = new MutationObserver(function (mutations, me) {
         var elements = [document.getElementById("cert")];
         var missing = false;
         for (var i = 0; i < elements.length; i++) {
            if (!elements[i]) {
               missing = true;
            }
         }
         if (!missing) {
            var path = "" + type + ".html";

            var request = new XMLHttpRequest();
            request.open("GET", path, true);
            request.onload = function () {
               if (request.status >= 200 && request.status < 400) {
                  var resp = request.responseText;
                  var temp = document.createElement("div");
                  temp.innerHTML = resp;
                  document.querySelector("#cert").innerHTML = resp;
                  // document.querySelector("#cert").appendChild(temp);
                  for (var entry of allParams) {
                     var elements = document.querySelectorAll(
                        "[cert-replace=" + entry[0] + "]"
                     );
                     for (var element of elements) {
                        element.innerText = entry[1];
                     }
                  }
                  certResize();
                  snapshot();
               } else {
                  error();
               }
            };
            request.send();

            me.disconnect();
            return;
         }
      });

      observer.observe(document, {
         childList: true,
         subtree: true,
      });
   } else {
      console.log("invalid cert");
      window.addEventListener
         ? window.addEventListener("load", invalidCert, false)
         : window.attachEvent && window.attachEvent("onload", invalidCert);
   }

   function keyHash(params) {
      //[key1, value1, key2, value2, ...]
		console.log(params);

      if (params.length % 2 != 0) {
         return (
            "ERROR: odd number of arguments (" +
            params.length +
            ") [" +
            Math.random() +
            "]"
         ); //random number prevents correct hash
      }
      var correctHash = 0;
      for (var i = 0; i < params.length; i += 2) {
         correctHash +=
            parseInt(hashParam(params[i] + "|" + params[i + 1])) /
            params.length;
      }
      correctHash = hashParam(correctHash);
      return correctHash;

      function hashParam(input) {
         input += ""; //convert to string
         var output = 0;
         if (input.length != 0) {
            for (var i = 0; i < input.length; i++) {
               var char = input.charCodeAt(i);
               output = (output << 5) - output + char;
               output = output & output;
            }
         }
         return output;
      }
   }
}

function homePage() {
   console.log("loaded home");
   loadMessage("messages/home.html");
   hideDownload();
}

function invalidCert() {
   console.log("loaded invalidCert");
   loadMessage("messages/invalidCert.html");
   hideDownload();
}

function error() {
   console.log("loaded error");
   loadMessage("messages/error.html");
   hideDownload();
}

function loadMessage(path) {
   var request = new XMLHttpRequest();
   request.open("GET", path, true);
   request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
         var resp = request.responseText;
         var message = document.createElement("div");
         message.className = "message";
         message.innerHTML = resp;
         document.querySelector("#certWrapper").innerHTML = "";
         document.querySelector("#certWrapper").appendChild(message);
      } else if (path != "messages/error.html") {
         error();
      }
   };
   request.send();
}

function hideDownload() {
   var downloadButton = document.querySelector("#downloadButton");
   downloadButton.style.display = "none";
}

function download() {
   if (canvasSnapshot) {
      var imgData = canvasSnapshot.toDataURL("image/jpeg", 1);
      var doc = new jsPDF("l", "in", "letter");
      doc.addImage(imgData, "JPEG", 0, 0, 11, 8.5);
      doc.save("synHacks Certificate.pdf");
   }
}

var canvasSnapshot;
function snapshot() {
   html2canvas(document.querySelector("#cert"), {
      scale: 4,
   }).then((canvas) => {
      canvasSnapshot = canvas;
   });
}

function certResize() {
   var headerHeight;
   var additionalMargin;
   headerHeight = document.querySelector("nav").offsetHeight;
   additionalMargin = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
         "--additional-margin"
      ),
      10
   );
   document.documentElement.style.setProperty(
      "--header-height",
      headerHeight + "px"
   );

   var windowWidth = window.innerWidth;
   var windowHeight = window.innerHeight;
   var newRootSize =
      Math.min(
         windowWidth,
         (windowHeight - headerHeight - additionalMargin) * 1.29411764706
      ) /
         800 +
      "px";
   document.getElementsByTagName("html")[0].style.fontSize = newRootSize;
}

window.onresize = function () {
   certResize();
};
window.addEventListener
   ? window.addEventListener("load", certResize, false)
   : window.attachEvent && window.attachEvent("onload", certResize);

checkCert();
