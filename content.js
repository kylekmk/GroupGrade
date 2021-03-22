chrome.runtime.onMessage.addListener(function (request) {

   var text_areas = document.getElementsByTagName('textarea');
   var comments = new Array();
   var i;
   console.log(text_areas);

   for (i = 0; i < text_areas.length; i++){
      var curr_text = text_areas[i];

      if (!(curr_text.id == 'criterion_comments_textarea' || curr_text.id == 'rating_form_description' || curr_text.id == 'speed_grader_comment_textarea' || curr_text.className == 'long_description' || curr_text.className == 'description')){
         comments.push(curr_text);
      }
   }

   console.log(comments);

   for (i = 0; i < comments.length; i++){
      comments[i].value = request;
   }
   
});