document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get('projects', data => {

        // Default Project file
        // Overwritten if data exists
        var projectFile = {
            projArr: [
                {
                    name: 'Default Project',
                    fields: 1,
                    pointTotal: 5,
                    gradeVals: [5],
                    criteria: ['Criteria']
                }
            ],
            selected: 0
        };

        console.log(projectFile);
        console.log(data);

        if (data.projects !== undefined && data.projects.projArr !== undefined && data.projects.projArr.length > 0) {
            Object.assign(projectFile, data.projects);
        }


        const DELIM = '*!*flag*!*';

        var project = projectFile.projArr[projectFile.selected];
        var comments = new Array();
        var grades = new Array();
        var rubric_obj = {
            comments: [],
            grades: [],
            criteria: []
        };

        getCurrentRubric();

        console.log(JSON.stringify(rubric_obj));

        document.querySelector('#proj-name').innerHTML = project.name;
        var rubric_table = document.querySelector('#rubric-table');
        var input = document.querySelector('#comments');
        var points = document.querySelector('#point-total');

        document.querySelector('#autofill').onclick = function () { setValue(); };
        document.querySelector('#clear').onclick = function () { clearInputs(); };

        // add all table rows
        var num_crit;
        for (num_crit = 0; num_crit < project.fields; num_crit++) {
            appendCriteria();
        }
        totalPoints();
        saveComments();
        saveGrades();

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
        function clearInputs() {
            localStorage['grades'] = [];
            localStorage['comments'] = [];

            rubric_obj.comments = [];
            rubric_obj.grades = [];
            for (i = 0; i < comments.length; i++) {
                rubric_obj.comments[i] = '';
                rubric_obj.grades[i] = '';
                comments[i].value = '';
                grades[i].value = '';
            }
            totalPoints();
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
            // deep copy made to create without delims
            rubric_obj.comments = JSON.parse(JSON.stringify(comment_arr));

            // Comments may contain commas so a custom delim is necessary
            for (i = 1; i < comment_arr.length; i++) {
                comment_arr[i] = DELIM + comment_arr[i];
            }
            localStorage['comments'] = comment_arr;
            console.log(rubric_obj.comments);
            console.log(comment_arr);

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

            rubric_obj.criteria = project.criteria;
        }

        // Adds two text boxes, comment and grade
        function appendCriteria() {
            // create html elements
            var newComment = document.createElement('textarea');
            var newGrade = document.createElement('input');
            newGrade.setAttribute('type', 'number');
            var maxPts = document.createElement('span');
            maxPts.innerHTML = project.gradeVals[num_crit];
            maxPts.className = 'maxPts';

            // add comments and grades proper functions and track them

            if (rubric_obj.comments.length > comments.length) {
                newComment.value = rubric_obj.comments[comments.length];
            }
            newComment.className = 'comment';
            newComment.onchange = () => { saveComments(); };
            newComment.tabIndex = comments.length + 1;
            comments.push(newComment);

            if (rubric_obj.grades.length > grades.length) {
                newGrade.value = rubric_obj.grades[grades.length];
            }
            newGrade.className = 'grade';
            newGrade.onchange = () => saveGrades();
            newGrade.oninput = () => totalPoints();
            newGrade.step = .25;
            newGrade.min = 0;
            newGrade.max = project.gradeVals[num_crit];
            newGrade.tabIndex = project.fields + grades.length + 1;
            grades.push(newGrade);

            // Add to html elements
            // insert at end of tbody
            var row = rubric_table.querySelector('tbody').insertRow(-1);
            var cell_criteria = row.insertCell(0);
            var cell_comment = row.insertCell(1);
            var cell_grade = row.insertCell(2);

            cell_criteria.className = 'td-criteria';
            cell_comment.className = 'td-comment';
            cell_grade.className = 'td-grade';

            cell_criteria.innerHTML = rubric_obj.criteria[num_crit];
            cell_criteria.className = 'criteria';
            cell_comment.appendChild(newComment);
            cell_grade.appendChild(newGrade);
            cell_grade.appendChild(maxPts);

        }

        function totalPoints() {
            var pointTotal = 0;
            grades.forEach(grade => {
                var val = parseFloat(grade.value);
                pointTotal += isNaN(val) ? 0 : val;
            });
            document.querySelector('#point-total').innerHTML = pointTotal;
            document.querySelector('#point-max').innerHTML = project.pointTotal;
            return pointTotal;
        }
    });
}, false);