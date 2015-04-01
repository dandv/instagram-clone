Notes = new Mongo.Collection('notes');
Meteor.subscribe('notes');

var cameraOptions = {
  width: 800,
  height: 600
};

// provide the value for `notes` in {{#each notes}} in the HTML
Template.body.helpers({
  notes: function () {
    return Notes.find(
      { },
      {
        sort: { timestamp: -1 }
      }
    );
  }  
});

// Define the event map - http://docs.meteor.com/#/full/eventmaps
Template.body.events({
  'click #take-photo': function () {
    MeteorCamera.getPicture(cameraOptions, function (error, data) {
      Session.set("photo", data);
      if (error) {
        // e.g. camera permission denied, or unsupported browser (Safari on iOS, looking at you)
        console.log(error);
      } else {  
        Notes.insert({
          photo: data,
          timestamp: new Date()
        });
      }  
    });
  },
  
  'submit form': function (event, template) {
    var noteText = template.find('input').value;
    if (noteText) {
      Notes.insert({
        note: noteText,
        timestamp: new Date()
      });
      template.find('input').value = '';  // clear the field after saving
    }
    return false;  // calls preventDefault() to not submit the form
  }
});
