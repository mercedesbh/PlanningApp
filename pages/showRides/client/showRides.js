Template.showRides.helpers({
	rides:function(){
		return Rides.find({});
	}
})

Template.showRides.events({
	"click .js-addRide": function(event){
		console.log("hey you clicked the button");
		// read in the values of the input fields and store in variables
		const name = $(".js-name").val();
		const dest = $(".js-dest").val();
		const am = $(".js-am").val();
		const pm = $(".js-pm").val();
		const mon = $(".js-mon").val();
		const tue = $(".js-tue").val();
		const wed = $(".js-wed").val();
		const thu = $(".js-thu").val();
		const fri = $(".js-fri").val();
		const ride =
		{offeredBy:name, to:dest, times:[am,pm],days:[1,3,4]};
		console.dir(ride);
		Rides.insert(ride);
		
	}
})