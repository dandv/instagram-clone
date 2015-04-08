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
    var noteText = template.find('#message-input').value;
    if (noteText) {
      Notes.insert({
        note: noteText,
        timestamp: new Date()
      });
      template.find('#message-input').value = '';  // clear the field after saving
    }
    return false;  // calls preventDefault() to not submit the form
  }
  
});


Meteor.startup(function() {
  GoogleMaps.load();
});

Template.body.helpers({
  exampleMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(31.24227, 121.49695),
        zoom: 8
      };
    }
  }
});

Template.body.onCreated(function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('exampleMap', function(map) {
    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
  });
});

