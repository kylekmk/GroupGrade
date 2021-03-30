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

   // find proper tbody element
   if (table_found) {
      var children = rubric.children;
      var child_found = false;
      var tbody;
      i = 0;

      console.log(children);
      console.log(children.length);

      // grab table body containing inputs and comments
      while (!child_found && children && i < children.length) {
         console.log(children[i].tagName);
         console.log(children[i].tagName);
         if (children[i].tagName == 'TBODY') {
            tbody = children[i];
            child_found = true;
            console.log("FOUND " + children[i].tagName);

         }
         i++;
      }

      console.log(tbody);
      if (tbody) {
         var comments = tbody.getElementsByTagName('textarea');
         var inputs = tbody.getElementsByTagName('input');
         var grades = new Array();

         console.log(comments);
         console.log(inputs);

         // grab grades text boxes
         for (i = 0; i < inputs.length; i++) {
            console.log(inputs[i].type);
            if (inputs[i].type == 'text') {
               grades.push(inputs[i]);
            }
         }
         console.log(grades);

         if (request.comments.length != comments.length || request.grades.length != grades.length) {
            alert("ABORT");
            return;
            // ABORT SOMETHING IS WRONG
         }

         // Add the desired comments
         for (i = 0; i < comments.length; i++) {
            comments[i].value = request.comments[i];
         }

         // Add the desired grades
         for (i = 0; i < grades.length; i++) {
            grades[i].value = request.grades[i];
         }
         console.log("DONE");
      }

   }

   // var text_areas = document.getElementsByTagName('textarea');
   // var comments = new Array();
   // var i;
   // console.log(text_areas);

   // for (i = 0; i < text_areas.length; i++){
   //    var curr_text = text_areas[i];

   //    if (!(curr_text.id == 'criterion_comments_textarea' || curr_text.id == 'rating_form_description' || curr_text.id == 'speed_grader_comment_textarea' || curr_text.className == 'long_description' || curr_text.className == 'description')){
   //       comments.push(curr_text);
   //    }
   // }

   // console.log(comments);

   // for (i = 0; i < comments.length; i++){
   //    comments[i].value = request;
   // }

});