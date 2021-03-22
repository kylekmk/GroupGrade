document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('btn').onclick = function() { setValue(); };

    var input = document.getElementById('comments');
    var obj = {
        comments: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9'],
        grades: ['9', '8', '7', '6', '5', '4', '3', '2', '1']
    }

    function setValue() {
        text = input.value;
        console.log('called with ' + text);
        chrome.tabs.query({ currentWindow: true, active: true },
            function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, obj);
            });
    }

}, false);