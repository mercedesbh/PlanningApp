Template.comments.helpers({
	commentsdata: function(){
		return Comments.find({},{sort:{createdAt:-1}, limit:30000});},
	
	
})

Template.comments.events({
	"click .js-submit-comment": function(event){
	   event.preventDefault();
	   //console.dir(event);
	   const comment_text = $(".js-user-comment").val();
	   if (comment_text=="") {
	   	window.alert("you must enter a comment!");
	   	return;
	   }
	   const comment_rating = $(".js-rating-comment").val();
	   const comment_obj =
	   {text: comment_text,
	   	rating:comment_rating,
	    createdAt: new Date(),
	    createdBy: Meteor.userId(),
	    userEmail: Meteor.user().emails[0].address};
	    //console.dir(comment_obj);
	    Comments.insert(comment_obj);
	    $(".js-user-comment").val("");
	    //Router.go('/');
	    console.log("Did we get here????")
	},
});

Template.commentRow.events({
	"click .js-delete-comment": function(event){
		console.log("clicked on the x");
		console.dir(this);
		Comments.remove(this.comment._id);
	},
})