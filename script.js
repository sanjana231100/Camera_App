let videoPlayer = document.querySelector("video");
console.log("reaching the script");
let recordButton = document.querySelector("#record");
let captureButton = document.querySelector("#capture")
let body = document.querySelector("body");
let filter=""
let mediaRecorder;
let chunks=[];
let isRecording=false;
let zoom=1;
let galleryBtn = document.querySelector("#gallery")
galleryBtn.addEventListener("click",function()
{
    location.assign("gallery.html");
})
let zoomIn = document.querySelector(".in");
let zoomOut = document.querySelector(".out");
zoomIn.addEventListener("click",function()
{
    zoom = zoom+0.1;
    if(zoom>3)
    {
        zoom=3;
    }
    videoPlayer.style.transform=`scale(${zoom})`;
}) 

zoomOut.addEventListener("click",function()
{
    zoom = zoom-0.1;
    if(zoom<1)
    {
        zoom=1;
    }
    videoPlayer.style.transform=`scale(${zoom})`;
}) 
let filters  = document.querySelector(".filters")
let allfilters = document.querySelectorAll(".filter")
for(let i=0; i<allfilters.length; i++)
{
    allfilters[i].addEventListener("click",function(e)
    {
        let previousFilter = document.querySelector(".filter-div")
        if(previousFilter) previousFilter.remove();
        let color = e.currentTarget.style.backgroundColor;
        filter = color;
        let filterDiv = document.createElement("div");
        filterDiv.classList.add("filter-div")
        filterDiv.style.backgroundColor = color;
        body.append(filterDiv)

    })
}

recordButton.addEventListener("click",function()
{
    let recordSpan = recordButton.querySelector("span")

    let previousFilter = document.querySelector(".filter-div");

    if (previousFilter) previousFilter.remove();

  filter = "";

    if(isRecording)
    {
        //stop the recording and save
        mediaRecorder.stop();
        filters.style.pointerEvents="auto";
        recordSpan.classList.remove("record-animation");
        isRecording=false;
    }
    else{
        mediaRecorder.start();
        filters.style.pointerEvents="none";
        recordSpan.classList.add("record-animation");
        isRecording=true;
        // start recording
     }

})
captureButton.addEventListener("click",function(e)
{
    let captureSpan = captureButton.querySelector("span");
    captureSpan.classList.add("capture-animation");
    setTimeout(function(){
        captureSpan.classList.remove("capture-animation");
    },1000)
    let canvas = document.createElement('canvas');
    canvas.height = videoPlayer.videoHeight;
    canvas.width = videoPlayer.videoWidth;
    let tool = canvas.getContext("2d");
    tool.translate(canvas.width/2,canvas.height/2)
    tool.scale(zoom,zoom)
    tool.translate(-canvas.width/2,-canvas.height/2)
    tool.drawImage(videoPlayer,0,0);
    tool.fillStyle=filter;
    tool.fillRect(0,0,canvas.width,canvas.height)
    let url = canvas.toDataURL();
    saveMedia(url);

})

let promiseToUseCamera = navigator.mediaDevices.getUserMedia({
video:true,
audio:true
})
promiseToUseCamera.then(function(mediaStream)
{
    videoPlayer.srcObject=mediaStream;
    mediaRecorder = new MediaRecorder(mediaStream);
    console.log("permission granted")
    mediaRecorder.addEventListener("dataavailable",function(e)
    {
        console.log("new chunk pushed")
        chunks.push(e.data);
    });
    mediaRecorder.addEventListener("stop",function(e)
    {
        let blob = new Blob(chunks,{type: "video/mp4"});
        chunks=[];
        saveMedia(blob);
        });
})
.catch(function()
{
    console.log("not granted")
})