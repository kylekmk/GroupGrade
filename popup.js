document.addEventListener('DOMContentLoaded', function () {

    const DELIM = "*!*flag*!*";
    var comments = new Array();
    var grades = new Array();
    var rubric_obj = {
        'comments': [],
        'grades': []
    };
    var num_criteria;

    getCurrentRubric();

    console.log(JSON.stringify(rubric_obj));

    var rubric_table = document.getElementById('rubric-table');
    var input = document.getElementById('comments');

    document.getElementById('autofill').onclick = function () { setValue(); };
    document.getElementById('clear').onclick = function () { clearInputs();};
    // FEATURE TO BE IMPLEMENTED LATER
    // Adjust the amount of criteria in a rubric
    // document.getElementById('criteria').onchange = function () {

    //     addCriteria();
    //     num_criteria = document.getElementById('criteria').value;
    //     chrome.storage.sync.set({ 'num_criteria': num_criteria }, function(){
    //         console.log ("'num_criteria set to: " + num_criteria);
    //     });

    // };

    // TEMPORARY CODE
    // Adds a fixed amount of criteria (9 bc the DM project has 9)
    var i;
    for (i = 0; i < 9; i++) {
        addCriteria();
    }
    // temp code ^^^


    // sends request to Chrome API to autofill the page
    function setValue() {
        window.close();
        console.log('set to ' + JSON.stringify(rubric_obj));
        chrome.tabs.query({ currentWindow: true, active: true },
            function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, rubric_obj);
            });
    }

    // Wipes all text boxes
    function clearInputs () {
        localStorage['grades'] = [];
        localStorage['comments'] = [];
        rubric_obj.comments = [];
        rubric_obj.grades = [];
        for (i = 0; i < comments.length; i++){
            comments[i].value = "";
            grades[i].value = "";
        }
    }

    // Saves grade values on change
    function saveGrades() {
        var grade_arr = new Array();
        for (i = 0; i < grades.length; i++) {
            grade_arr.push(grades[i].value);
        }

        rubric_obj.grades = grade_arr;
        localStorage['grades'] = grade_arr;
    }

    // Saves comment values on change
    function saveComments() {
        var comment_arr = new Array();
        for (i = 0; i < comments.length; i++) {
            comment_arr.push(comments[i].value);
        }

        rubric_obj.comments = comment_arr;
        console.log (comment_arr);
        // Comments may contain commas so a custom delim is necessary
        for (i = 1; i < comment_arr.length; i++){
            comment_arr[i] = DELIM + comment_arr[i];
        }
        localStorage['comments'] = comment_arr;
        console.log (comment_arr);
    }

    // Updates to most recent rubric
    function getCurrentRubric() {
        var saved = true;

        if (localStorage['grades'] != undefined) {
            rubric_obj.grades = localStorage['grades'].split(',');
        }

        if (localStorage['comments'] != undefined) {
            rubric_obj.comments = localStorage['comments'].split(',' + DELIM);
        }

    }

    // Adds two text boxes, comment and grade
    function addCriteria() {
        var newComment = document.createElement('textarea');
        var newGrade = document.createElement('textarea');
        var div = document.createElement('div');
        div.className = 'criteria-holder'

        if (rubric_obj.comments.length > comments.length) {
            newComment.value = rubric_obj.comments[comments.length];
        }
        newComment.className = 'comment';
        newComment.onchange = function () { saveComments(); };
        comments.push(newComment);

        if (rubric_obj.grades.length > grades.length) {
            newGrade.value = rubric_obj.grades[grades.length];
        }
        newGrade.className = 'grade';
        newGrade.onchange = function () { saveGrades(); };
        grades.push(newGrade);

        div.appendChild(newComment);
        div.appendChild(newGrade);
        rubric_table.appendChild(div);
    }

}, false);