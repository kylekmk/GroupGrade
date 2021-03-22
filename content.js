chrome.runtime.onMessage.addListener(function (request) {
   var vids = document.getElementsByTagName("video");
   console.log(vids);
   console.log(document.getElementById('player0'));
   vids[0].playbackRate = request;
   
})