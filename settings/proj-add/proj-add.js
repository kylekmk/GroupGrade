document.addEventListener('DOMContentLoaded', function () {

    var criteria = new Array();
    var grades = new Array();
    var num_criteria = 0;

    var rubric_table = document.querySelector('#rubric-table');
    var criteria_count = document.querySelector('#num-criteria');
    var save = document.querySelector('#save').onclick = () => saveProject();

    // TEMP CODE
    document.querySelector('#log').onclick = () => log();
    document.querySelector('#delete').onclick = () => deleteStorage();
    //TEMP CODE 
    criteria_count.value = 1;
    appendCriteria();
    totalPoints();

    criteria_count.onchange = () => {
        var i;
        var newCount = parseInt(criteria_count.value);
        var change = newCount - num_criteria;

        // decreasing 
        if (num_criteria > newCount) {
            for (i = 0; i > change; i--) {
                removeLastCriteria();
            }
        } // increasing
        else if (num_criteria < newCount) {
            for (i = 0; i < change; i++) {
                appendCriteria();
            }
        }
        totalPoints();
    }


    // Appends a criteria row on the table
    function appendCriteria() {
        // create html elements
        var newCriteria = document.createElement('textarea');
        var newGrade = document.createElement('textarea');

        newCriteria.className = 'criteria';
        criteria.push(newCriteria);

        newGrade.className = 'grade';
        newGrade.onchange = () => { totalPoints(); };
        grades.push(newGrade);

        // Add to html elements
        var row = rubric_table.querySelector('tbody').insertRow(-1);
        var cell_criteria = row.insertCell(0);
        var cell_grade = row.insertCell(1);
        cell_criteria.appendChild(newCriteria);
        cell_grade.appendChild(newGrade);
        num_criteria++;
    }

    function removeLastCriteria() {
        grades.pop();
        criteria.pop();
        num_criteria--;
        rubric_table.querySelector('tbody').deleteRow(-1);
    }

    function totalPoints() {
        var pointTotal = 0;
        grades.forEach(grade => {
            var val = parseFloat(grade.value);
            pointTotal += isNaN(val) ? 0 : val;
        });
        document.querySelector('#point-total').innerHTML = 'Total Points: ' + pointTotal;
        return pointTotal;
    }

    // save the project obj
    function saveProject() {

        // make criteria title array
        var critNames = new Array();
        criteria.forEach(elem => {
            critNames.push(elem.value);
        });

        // make grade value array
        var gradeVals = new Array();
        grades.forEach(elem => {
            gradeVals.push(elem.value);
        });

        // object to be saved
        var projectObj = {};

        // save essential information
        projectObj.name = document.querySelector('#name').value;
        projectObj.fields = num_criteria;
        projectObj.pointTotal = totalPoints();

        projectObj.gradeVals = gradeVals;
        projectObj.criteria = critNames;

        console.log(projectObj);

        //** save to chrome storage **//

        // Save to projects
        saveProjObj(projectObj);
    }

    function saveProjObj(projObj) {
        var projects = {};
        var nametaken = false;

        chrome.storage.sync.get('projects', data => {
            Object.assign(projects, data.projects);

            // asychronous, so save and check in the callback 
            console.log('post function ', projects)

            if (projects.projArr === undefined) {
                projects.projArr = new Array();
            }

            // check for identical names
            projects.projArr.forEach(elem => {
                if (elem.name === projObj.name) {
                    alert('Name taken, please choose new name');
                    nametaken = true;
                    return;
                }
            });

            // Append project and save
            if (!nametaken) {
                projects.projArr.push(projObj);
                chrome.storage.sync.set({ projects: projects }, () => {
                    console.log('Saved: ', projects);
                });
            }
            document.querySelector('#back').click();
        });
    }

    function log() {
        chrome.storage.sync.get('projects', data => {
            console.log(data.projects);
        });
    }

    function deleteStorage () {
        var none = {};
        chrome.storage.sync.set({ projects: none }, () => { });

    }

}, false);