

$(document).ready(function() {
   var source = document.getElementById("comment-template").innerHTML;
   var template = Handlebars.compile(source);

   var context = { title: "My New Post", body: "This is my first post!" };

   function make_comment(context) {
      var html = template(context);
      $('#comments').append(html);
   }

   function get_comments() {
      $.get("/api/comments", function( data ) {
         $('#comments').empty();

         console.log(data)
         data.forEach(function (row) {
            make_comment(row);
         })

         $('.upvote').unbind("click").click(function () {
            alert("upvote");
         });

         $('.reply').unbind("click").click(function () {
            $.post("/api/comment", {comment: "I have a mouth and I can scream", name: "Andrew"}, function() {
               get_comments();
            });
         });
      });
   }

   get_comments();
});