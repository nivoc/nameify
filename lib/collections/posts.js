Posts = new Mongo.Collection('posts');

Posts.allow( {
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); }
});
Posts.deny( {
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});
Posts.deny({
  update: function(userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.title || errors.url;
  }
});

validatePost = function(post) {
  var errors = {};
  if (!post.title) {
    errors.title = 'Please fill in a headline';
  }
  if (!post.url) {
    errors.url = 'Please fill in a URL';
  }
  return errors;
};

Meteor.methods({
  voteUp: function(postId) {
    check(this.userId, String);
    check(postId, String);
    var post = Posts.findOne(postId);
    if (!post)
      throw new Meteor.Error('invalid-comment', 'You vote on a post');
    Posts.update(postId, {$inc: {voteCount: 1}});
    return 
  },
  
  postInsert: function(postAttributes) {
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String
    });

    var errors = validatePost(postAttributes);
    if (errors.title || errors.url) {
      throw new Meteor.Error('invalid-post', 'You must set a title and URL for your post');
    }
    var postWithSameLink = Posts.findOne({ url: postAttributes.url });
    if (postWithSameLink) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      };
    }
    // if (Meteor.isServer) {
    //    postAttributes.title += "(server)";
    //    // wait for 5 seconds
    //    Meteor._sleepForMs(5000);
    //  } else {
    //    postAttributes.title += "(client)";
    //  }


    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      commentsCouut: 0,
      voteCount: 0
    });
    var postId = Posts.insert(post);
    return {
      _id: postId
    };
  }
})
