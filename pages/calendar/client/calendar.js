Template.calendar.onRendered( function() {

	// $('#calendar').fullCalendar('next'){
  $( '#calendar' ).fullCalendar({



  	dayClick: function(date) {
  		console.log(date);
  		console.log("fullCalendar is " + date);
  		console.log("date format is " +date.format());
  		console.log("new Date is "+ new Date());
  		if(new Date()==date.format()){
console.log("true");
  		}else{
  			console.log("false");
  		}
  		if(new Date() == date){
  			$('#userModal').modal('show');
  		}
  		else if(new Date() > date){
  			Bert.alert( "Not this day!", 'danger' );
  		}else{

  			$('#userModal').modal('show');
  		}

    },

    // dayRender:function(date,cell){
    // 	console.log(date);
    // 	if(date < new Date()){
    // 		$(cell).addClass('disabled');
    // 	}
    // }



  });
});
