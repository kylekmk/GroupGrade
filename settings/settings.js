document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get('projects', data => {

        // get data for projects
        var projectFile = {
            projArr: [],
            selected: 0
        };
        Object.assign(projectFile, data.projects);

        // SETUP PAGE  
        console.log(projectFile);


        var add = document.querySelector('#add');
        var selected = projectFile.selected;

        add.onclick = () => {
            chrome.storage.sync.set({ proj_edit: { edit: {}, isEditing: false } }, () => {
                console.log('Saved: ', projectFile.projArr[projectFile.selected]);
            });
            window.location.replace('../settings/proj-add/proj-add.html');
        };


        var tbody = document.querySelector('tbody');
        populateTable();
        if (projectFile.projArr.length > 0) {
            selectProj(projectFile.selected);
        }

        function populateTable() {
            var projects = projectFile.projArr === undefined ? [] : projectFile.projArr;
            var i = 0;
            projects.forEach(elem => {
                appendProject(elem, i);
                i++;
            });
        }

        function selectProj(idx) {
            // remove check
            var old_row = tbody.rows[projectFile.selected];
            old_row.querySelector('svg').style.fill = 'none';

            // add check
            var row = tbody.rows[idx];
            projectFile.selected = idx;
            chrome.storage.sync.set({ projects: projectFile }, () => {
                console.log('Saved');
                var svg = row.querySelector('svg');
                svg.style.fill = 'green'
            });


        }

        function appendProject(proj, i) {
            var row = tbody.insertRow(-1);

            // add name
            var cell_name = row.insertCell(0)
            var proj_name = document.createElement('span');
            cell_name.appendChild(proj_name);
            proj_name.innerHTML = proj.name;
            cell_name.onclick = () => selectProj(i);

            // add edit button
            var edit = document.createElement('button');
            edit.value = i;
            edit.innerHTML = 'Edit'
            edit.onclick = () => editProj(edit.value);
            var cell_edit = row.insertCell(1);
            cell_edit.appendChild(edit);

            // add delete button
            var dlt = document.createElement('button');
            dlt.value = i;
            dlt.innerHTML = 'Delete'
            dlt.onclick = () => deleteConf('Are you sure you want to delete "' + proj.name + '"', dlt.value);
            var cell_delete = row.insertCell(2);
            cell_delete.appendChild(dlt);

            // selection cell
            var cell_select = row.insertCell(0);
            var svg = document.createElement('svg');
            cell_select.appendChild(svg);
            cell_select.onclick = () => selectProj(i);
            svg.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="bi bi-check" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>'
            svg.style.fill = 'none';
        }

        function editProj(val) {
            projectFile.selected = val;
            chrome.storage.sync.set({ proj_edit: { edit: projectFile.projArr[val], isEditing: true } }, () => {
                console.log('Saved: ', projectFile.projArr[val]);
            });
            console.log(val);
            window.location.replace('../settings/proj-add/proj-add.html');
        }



        function deleteConf(msg, val) {
            dialogConfirm(msg, val);
        }

        function dialogConfirm(msg, val) {
            var div = document.createElement('div');
            div.id = 'overlayDiv'

            var p = document.createElement('p');
            var yes = document.createElement('button');
            var no = document.createElement('button');
            var btns = document.createElement('div');
            var elems = document.createElement('div');

            btns.id = 'btns';
            elems.id = 'elems';

            p.innerHTML = msg;
            yes.innerHTML = 'Yes';
            no.innerHTML = 'No';

            btns.appendChild(yes);
            btns.appendChild(no);
            elems.appendChild(p);
            elems.appendChild(btns);
            div.appendChild(elems);

            yes.onclick = () => {
                deleteProj(val);
                div.remove();
            }

            no.onclick = () => div.remove();


            document.querySelector('body').appendChild(div);
            return false;
        }

        function deleteProj(val) {
            var proj = projectFile.projArr[val];
            console.log(proj);
            projectFile.projArr.splice(val, 1);
            if (projectFile.selected > projectFile.projArr.length - 1){
                projectFile.selected = projectFile.projArr.length - 1;
            }

            chrome.storage.sync.set({ projects: projectFile }, () => {
                console.log('Saved: ', projectFile.projArr[val]);
                tbody.innerHTML = '';
                populateTable();
            });
        }
    });
});

