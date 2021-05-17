document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get('proj_edit', data => {

        // grab potential edit
        var proj_edit = {
            edit: {
                name: "Project Name",
                fields: 1,
                pointTotal: 5,
                gradeVals: [5],
                criteria: ["Criteria"]
            },
            isEditing: false
        };

        Object.assign(proj_edit, data.proj_edit);

        var criteria = new Array();
        var grades = new Array();
        var num_criteria = 0;

        var rubric_table = document.querySelector('#rubric-table');
        var criteria_count = document.querySelector('#num-criteria');
        document.querySelector('#save').onclick = () => saveProject();

        // TEMP CODE
        // document.querySelector('#log').onclick = () => log();
        // document.querySelector('#delete').onclick = () => deleteStorage();

        //TEMP CODE 
        if (!proj_edit.isEditing) {
            criteria_count.value = 1;
            appendCriteria();
        } else {
            var proj = proj_edit.edit;
            criteria_count.value = proj.fields;
            document.querySelector('#name').innerHTML = proj.name;
            for (var i = 0; i < proj.fields; i++) {
                appendCriteria(true, proj.criteria[i], proj.gradeVals[i]);
            }
        }
        totalPoints();


        criteria_count.onchange = () => {
            var i;
            var newCount = parseInt(criteria_count.value);
            var change = newCount - num_criteria;

            if (newCount >= 1) {
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
        }


        // Appends a criteria row on the table
        function appendCriteria(fill, fillCriteria, fillGrade) {
            // create html elements
            var newCriteria = document.createElement('textarea');
            var newGrade = document.createElement('input');
            newGrade.setAttribute('type', 'number');

            newCriteria.className = 'criteria';
            criteria.push(newCriteria);

            newGrade.className = 'grade';
            newGrade.oninput = () => { totalPoints(); };
            newGrade.tabIndex = grades.length + 1
            grades.push(newGrade);

            if (fill) {
                newCriteria.value = fillCriteria;
                newGrade.value = fillGrade;
            }

            // Add to html elements
            var row = rubric_table.querySelector('tbody').insertRow(-1);
            var cell_criteria = row.insertCell(0);
            var cell_grade = row.insertCell(1);
            cell_criteria.appendChild(newCriteria);
            cell_grade.appendChild(newGrade);

            cell_grade.className = 'td-grade';
            cell_criteria.className = 'td-criteria';

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
            var valid = document.querySelector('#name').value.split(' ').join('') !== '';

            // make criteria title array
            var critNames = new Array();
            criteria.forEach(elem => {
                if (elem.value.split(' ').join('') === '') {
                    valid = false;
                    elem.style.borderBottom = '2px solid red';
                } else {
                    elem.style.borderBottom = '';
                }
                critNames.push(elem.value);
            });

            // make grade value array
            var gradeVals = new Array();
            grades.forEach(elem => {
                if (elem.value.split(' ').join('') === '') {
                    valid = false;
                    elem.style.borderBottom = '2px solid red';
                } else {
                    elem.style.borderBottom = '';
                }
                gradeVals.push(elem.value);
            });

            var warning = document.querySelector('#save-box span');
            if (!warning) {
                warning = document.createElement('span');
            }
            console.log(warning);

            if (valid) {
                warning.remove();
            } else {
                warning.innerHTML = 'Some input fields are empty';
                document.querySelector('#save-box').appendChild(warning);
                console.log('added');
                return;
            }

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

            chrome.storage.sync.get('projects', data => {
                Object.assign(projects, data.projects);

                // asychronous, so save and check in the callback 
                console.log('post function ', projects)

                if (projects.projArr === undefined) {
                    projects.projArr = new Array();
                }

                // check for identical names in projArr
                var idx = projects.projArr.findIndex(elem => elem.name === projObj.name);
                var nametaken = idx !== -1;

                if (nametaken) { // cannot add project with the same name
                    if (!proj_edit.isEditing || proj_edit.isEditing && proj_edit.edit.name !== projects.projArr[idx].name) {
                        if (document.querySelector('#save-box span') === null) {
                            var warning = document.createElement('span');
                            warning.innerHTML = 'Name taken, change the project name'
                            document.querySelector('#save-box').appendChild(warning);
                            console.log('added');
                        }
                        return;
                    }


                }

                if (proj_edit.isEditing) { // overwrite
                    var overwrite = projects.projArr.findIndex(elem => elem.name === proj_edit.edit.name);
                    projects.projArr[overwrite] = projObj;
                    console.log('overwrite')
                } else { // all good to add
                    projects.projArr.push(projObj);
                    console.log('pushing');
                }


                projects.selected = projects.projArr.length - 1;
                chrome.storage.sync.set({ projects: projects }, () => {
                    console.log('Saved: ', projects);
                });

                document.querySelector('#back').click();
            });
        }

        function log() {
            chrome.storage.sync.get('projects', data => {
                console.log(data.projects);
            });
        }

        function deleteStorage() {
            var none = {};
            chrome.storage.sync.set({ projects: none }, () => { });

        }
    });
}, false);