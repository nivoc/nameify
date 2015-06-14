Template.errors.helpers({
  errors: function() {
    return Errors.find();
  }
});

Template.error.onRendered(function(){
  var error = this.data;
  if (error === null) {
    return;
  }
  Meteor.setTimeout(function(){
    Errors.remove(error._id);
  }, 4800);
});
