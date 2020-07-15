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
	console.log("Correct Hash: " + correctHash);

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
            var path = "external/" + type + ".html";

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

function invalidCert() {
   console.log("loaded invalidCert");
}

function destroyCertTemp() {
  document.getElementById("cert-temp").innerHTML = "";
}

function download() {
  window.print();
}

checkCert();
