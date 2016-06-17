Meteor.startup(function(){
  if (Rides.find().count()==0) {
	// create these fixtures ....
	Rides.insert({offeredBy:"Tim",days:[1,2,3,4,5], times:[9,15], to:"Brookline"});
	Rides.insert({offeredBy:"Dewar",days:[2,3,5], times:[9,15], to:"Waltham"});
	Rides.insert({offeredBy:"Marie",days:[1,3,4], times:[9,15], to:"Belmont"});
  }
})