document.addEventListener('DOMContentLoaded', function () {

    var comments = new Array();
    var grades = new Array();
    var rubric_obj = {
        'comments': [],
        'grades': []
    };
    var num_criteria;

    getCurrentRubric();
    // applyTables();

    console.log(JSON.stringify(rubric_obj));

    var rubric_table = document.getElementById('rubric-table');
    var input = document.getElementById('comments');

    document.getElementById('autofill').onclick = function () { setValue(); };
    document.getElementById('clear').onclick = function () { clearInputs();};
    // document.getElementById('criteria').onchange = function () {

    //     addCriteria();
    //     num_criteria = document.getElementById('criteria').value;
    //     chrome.storage.sync.set({ 'num_criteria': num_criteria }, function(){
    //         console.log ("'num_criteria set to: " + num_criteria);
    //     });

    // };

    // temp code
    var i;
    for (i = 0; i < 9; i++) {
        addCriteria();
    }
    // temp code ^^^



    function setValue() {
        console.log('set to ' + JSON.stringify(rubric_obj));
        chrome.tabs.query({ currentWindow: true, active: true },
            function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, rubric_obj);
            });
    }

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

    function saveGrades() {
        var grade_arr = new Array();
        for (i = 0; i < grades.length; i++) {
            grade_arr.push(grades[i].value);
        }

        rubric_obj.grades = grade_arr;

        localStorage['grades'] = grade_arr;
    }

    function saveComments() {
        var comment_arr = new Array();
        for (i = 0; i < comments.length; i++) {
            comment_arr.push(comments[i].value);
        }

        rubric_obj.comments = comment_arr;

        localStorage['comments'] = comment_arr;
    }

    function getCurrentRubric() {
        var saved = true;

        if (localStorage['grades'] != undefined) {
            rubric_obj.grades = localStorage['grades'].split(',');
        }

        if (localStorage['comments'] != undefined) {
            rubric_obj.comments = localStorage['comments'].split(',');
        }

    }

    function addCriteria() {
        var newComment = document.createElement('textarea');
        var newGrade = document.createElement('textarea');
        var div = document.createElement('div');
        div.className = 'criteria holder'

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


    // // EXAMPLE CODE
    // chrome.storage.sync.set({ 'criteria': rubric_obj }, function () {
    //     console.log('Value is set to ', rubric_obj);
    // });

    // // EXAMPLE CODE
    // chrome.storage.sync.get('criteria', function (result) {
    //     console.log('Value is currently ' + result.criteria.comments);
    // });

     // function applyTables() {
    //     chrome.storage.sync.get('num_criteria', function (result) {
    //         if (result.num_criteria != undefined) {
    //             document.getElementById('criteria').value = result.num_criteria;
    //         }
    //     })
    // }

}, false);