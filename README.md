





# Instagram clone in ~50 lines of code

Sample Meteor app showing cross-platform photo taking. Instagram in 50 lines of JavaScript.

Uses the [mdg:camera](https://github.com/meteor/mobile-packages/tree/master/packages/mdg:camera) package.


## Demo

http://huawei.meteor.com


## Features

* Take pictures from Chrome (works on desktop (Windows, OS X) and Android with some limitations) or Firefox and Opera. [Safari and IE unfortunately don't support camera access](http://caniuse.com/#search=getusermedia).

* The browser limitations aren't a problem, because from this same codebase we can create Android and iOS apps.

* Upload photo to cloud (visit the http://huawei.meteor.com instance)

* Reverse chronological photo sorting

* The photostream is automatically synchronized across all connected clients - open http://huawei.meteor.com in two browser tabs and take a new photo - it will instantly appear in both tabs. The sort order will also be kept.

* Responsive (photos automatically fit the browser viewport)

* If you run the app locally (`meteor run`) and change any of the source files, the change will automatically be reflected in all connected clients ("hot code push"). Try [adding a CSS rule](client/photochat.css) to change the background.


## Hybrid mobile app

From this codebase, we can generate hybrid Android/iOS apps. First, [install Meteor](http://meteor.com/install).

To run this app in the iOS simulator on a Mac:

        meteor install-sdk ios
        meteor add-platform ios
        meteor run ios

To run it on an iOS device (requires Apple developer account): `meteor run ios-device`

It also works as a hybrid app on Android. To run it in the Android emulator:

        meteor install-sdk android
        meteor add-platform android
        meteor run android

To run the app on Android devices (make sure USB debugging is enabled and quit the Android emulator): `meteor run android-device`


## Meteor

To install Meteor: https://www.meteor.com/install

Tutorial for building a collaborative TODO list app in one hour with Meteor: https://www.meteor.com/try

Why choose Meteor in the first place: [Why Meteor?](http://wiki.dandascalescu.com/essays/why_meteor)


## Conclusion

Not bad for ~50 lines of JavaScript and ~15 lines of HTML (as of the [first commit](https://github.com/dandv/instagram-clone/commit/8a9ff33353b9f657540030813be25fb6fa887118)).

## TODO

* better UI styling
* show how easy it is to add accounts, but get the API keys for Weib and Wechat first, which requires a Chinese phone number apparently
* store the navigator position with each photo
* plot the pictures on the map
* use Baidu Map if possible, but see https://en.wikipedia.org/wiki/Baidu_Maps#Coordinate_system
* implement "shake to undo the last note" feature
* implement voice commands
* REST API to return the notes
* Yelp integration (extra credit)
