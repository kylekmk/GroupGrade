chrome.runtime.onMessage.addListener(function (request) {

   console.log(request);

   let table_parent_const = 'react-rubric';

   var tables = document.getElementsByTagName('table');
   var rubric;
   var table_found = false;
   var i = 0;

   // find table on page
   while (!table_found && tables && i < tables.length) {
      rubric = tables[i]
      if (rubric.parentNode.className = table_parent_const) {
         table_found = true;
      }
      i++;
   }
   console.log(rubric);

   // exit if no table on the page
   if (!table_found) {
      alert('no table, exiting');
      return;
   }

   var children = rubric.children;
   var child_found = false;
   var tbody;
   i = 0;

   // grab table body containing the inputs for grades and comments
   while (!child_found && children && i < children.length) {
      if (children[i].tagName == 'TBODY') {
         tbody = children[i];
         child_found = true;
      }
      i++;
   }

   console.log(tbody);
   if (!tbody) {
      alert('no tbody, exiting');
      return;
   }

   var comments = tbody.querySelectorAll('textarea');
   var grades = tbody.querySelectorAll("input[type='text']");

   console.log(comments);
   console.log(grades);

   if (request.comments.length != comments.length || request.grades.length != grades.length) {
      alert("Rubric uneven, exiting autofill.");
      return;
      // ABORT SOMETHING IS WRONG
   }



   // Add the desired grades
   // Cuts from the comments text area since the grade input functions differently
   for (i = 0; i < grades.length; i++) {
      // makes sure empty fields are copied/pasted
      if (request.grades[i] === "") {
         request.grades[i] = " ";
      }
      comments[i].value = request.grades[i];
      comments[i].select();
      document.execCommand("cut");
      grades[i].select();
      document.execCommand("paste");
   }

   // Add the desired comments
   for (i = 0; i < comments.length; i++) {
      // makes sure empty fields are copied/pasted
      if (request.comments[i] === "") {
         request.comments[i] = " ";
      }
      comments[i].value = request.comments[i];
      comments[i].select();
      document.execCommand("copy");
      document.execCommand("paste");
   }



});