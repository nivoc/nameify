Template.postItem.helpers({
  domain: function() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  },
  ownPost: function() {
    if (this.userId === Meteor.userId()){
      return true;
    } else {
      return false;
    }
  }
});
