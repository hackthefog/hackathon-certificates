function error() {
	console.log("loaded error");
	loadMessage("messages/error.html");
	hideDownload();
}

function loadMessage(path) {
	let request = new XMLHttpRequest();
	request.open("GET", path, true);
	request.onload = function() {
		if(request.status >= 200 && request.status < 400) {
			let resp = request.responseText;
			let message = document.createElement("div");
			message.className = "message";
			message.innerHTML = resp;
			document.querySelector("#certWrapper").innerHTML = "";
			document.querySelector("#certWrapper").appendChild(message);
		} else if(path !== "messages/error.html") {
			error();
		}
	};
	request.send();
}

function hideDownload() {
	let downloadButton = document.querySelector("#downloadButton");
	downloadButton.style.display = "none";
}

function download() {
	html2canvas(document.querySelector("#cert"), {
		scale: 4,
	}).then(canvas => {
		let imgData = canvas.toDataURL("image/jpeg", 1);
		let doc = new jsPDF("l", "in", "letter");
		doc.addImage(imgData, "JPEG", 0, 0, 11, 8.5);
		doc.save("Hackathon Certificate.pdf");
	});
}

function certResize() {
	let headerHeight;
	let additionalMargin;
	headerHeight = document.querySelector("nav").offsetHeight;
	additionalMargin = parseFloat(
		getComputedStyle(document.documentElement).getPropertyValue(
			"--additional-margin"
		)
	);
	document.documentElement.style.setProperty(
		"--header-height",
		headerHeight + "px"
	);

	let windowWidth = window.innerWidth;
	let windowHeight = window.innerHeight;
	let newRootSize =
		Math.min(
			windowWidth,
			(windowHeight - headerHeight - additionalMargin) * 1.29411764706
		) /
		800 +
		"px";
	document.getElementsByTagName("html")[0].style.fontSize = newRootSize;
}

window.onresize = function() {
	certResize();
};
window.addEventListener
	? window.addEventListener("load", certResize, false)
	: window.attachEvent && window.attachEvent("onload", certResize);