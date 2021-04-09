chrome.runtime.onMessage.addListener(function (request) {

   console.log(request);

   let query_const = '.react-rubric tbody';
   var i = 0;

   // find the rubric table on page
   var tbody = document.querySelector(query_const);

   // confirm if tbody exists
   if (tbody === undefined) {
      alert('no tbody, exiting');
      return;
   }

   var comments = tbody.querySelectorAll('textarea');
   var grades = tbody.querySelectorAll("input[type='text']");

   console.log(comments);
   console.log(grades);

   if (request.comments.length != comments.length || request.grades.length != grades.length || grades.length != comments.length) {
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