document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get('projects', data => {

        // get data for projects
        var projectFile = {};
        Object.assign(projectFile, data.projects);

        // SETUP PAGE  
        console.log(projectFile);
        var select = document.querySelector('#projects');
        populateDropdown();

        select.oninput = () => {
            projectFile.selected = select.value;
            chrome.storage.sync.set({ projects: projectFile }, () => {
                console.log('Saved: ', projects);
            });
            console.log(projectFile.selected);
        }



        function populateDropdown() {
            var projects = projectFile.projArr === undefined ? [] : projectFile.projArr;
            var i = 0;
            projects.forEach(elem => {
                var option = document.createElement('option');
                option.value = i;
                option.text = elem.name;
                select.add(option);
                i++;
            });
        }
    });
});

