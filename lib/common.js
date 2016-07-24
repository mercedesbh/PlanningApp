hashCode = function(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

intToRGB = function(i) {
    var c = (i & 0x00FFFFFF).toString(16).toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
}

first = function() {
  var y = Tasks.find({createdBy: Meteor.userId()}).fetch();
  // console.log(y);
  var p = y.concat(Goals.find({createdBy: Meteor.userId()}).fetch(), Texts.find({createdBy: Meteor.userId()}).fetch());
  // var v = p.concat(Texts.find({createdBy: Meteor.userId()}).fetch());
  return p;
}
