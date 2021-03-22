document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('btn').onclick = function() { setValue(); };

    var input = document.getElementById('comments');

    function setValue() {
        text = input.value;
        console.log('called with ' + text);
        chrome.tabs.query({ currentWindow: true, active: true },
            function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, text);
            });
    }

}, false);