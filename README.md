# Instagram clone in ~50 lines of code

Sample Meteor app showing cross-platform photo and note taking. Instagram in 50 lines of JavaScript (as of the [first commit](https://github.com/dandv/instagram-clone/commit/8a9ff33353b9f657540030813be25fb6fa887118)) and 250 lines with extra features (shake to undo, real-time photo markers on the map, REST API).


## Demo

https://huawei.meteor.com


## Screenshots

![Android screenshot](https://cloud.githubusercontent.com/assets/33569/11662322/d7cc9700-9d8a-11e5-9cad-0acb1dedff6b.png)

[More screenshots of the Instagram Clone Android app](https://github.com/dandv/instagram-clone/issues/1).

## Features

* **Cross-platform** iOS, Android (see [Google Play Store listing](play.google.com/store/apps/details?id=com.dandascalescu.huawei.demo)) and web application from a single code base.

* Use **native device features**, such as
  * camera access
  * geolocation (plot pictures on the map where they were taken)
  * accelerometer (shake to undo)

* Photos are stored on the cloud and **synchronized instantly** across all connected clients. For the best effect, open https://huawei.meteor.com in two browser tabs, or in a tab and [on Android](https://play.google.com/store/apps/details?id=com.dandascalescu.huawei.demo), and take a photo - it will instantly appear in both tabs. The reverse chronological sort order will also be kept.

* **OAuth login** with Facebook, Twitter, Google, GitHub, Weibo, with only one line of code

* **Access control** - you can only undo your own notes, and the admin has unrestricted access

* Use **3rd party API** services such as Google Maps, *and* make them reactive in real-time. Again with two tabs open, try dragging a map marker. When you release it, you'll see it automatically move in the other tab. To fully understand how awesome this is, consider what happened behind the scenes:
  * the user dragged the map marker
  * the Google Maps library notified the client of the new position of the marker
  * the client updated the marker position in the local copy of the database collection
  * the position change was synchronized with the server
  * the server published the position change to all connected clients, including the other browser tab
  * the other clients received the change notification and updated the marker position on the map

  *All this required writing about 10 lines of code.*

* **Offline functionality**: even if your device is not online, you can still take pictures and write notes, and they'll be synchronized when connectivity is restored.
 
* **Hot code push**: I can make a change to the app and run `meteor deploy huawei`. Users who are visiting huawei.meteor.com will automatically have the page refresh to reflect the latest changes. Even more interestingly, the Android and iOS apps will also be updated, without having to submit another Play Store/App Store update and wait through the approval cycle. Try this locally by [adding a CSS rule](client/photochat.css) to change the background while the app is `meteor run`ning.

* **Mobile web browser support** (test at https://huawei.meteor.com): take pictures from Chrome (works on desktop (Windows, OS X) and Android with some limitations) or Firefox and Opera. [Safari and IE unfortunately don't support camera access](http://caniuse.com/#search=getusermedia). The browser limitations aren't a problem, because from this same codebase we can create Android and iOS apps.

* **REST API** at `/api/notes/`

* **Responsive** (photos automatically fit the browser viewport) using Twitter Bootstrap

* **Material Design theme**


## Hybrid mobile app

From this codebase, we can generate hybrid Android/iOS apps. First, [install Meteor](http://meteor.com/install).

To run this app in the iOS simulator on a Mac:

        meteor install-sdk ios
        # meteor add-platform ios  # iOS platform already added to the project
        meteor run ios

To run it on an iOS device (requires Apple developer account): `meteor run ios-device`.

It also works as a hybrid app on Android. To run it in the Android emulator:

        meteor install-sdk android
        # meteor add-platform android  # Android platform already added to the project
        meteor run android

To run the app on Android devices (make sure USB debugging is enabled and quit the Android emulator): `meteor run android-device`.


## Meteor

To install Meteor: https://www.meteor.com/install

Tutorial for building a collaborative TODO list app in one hour with Meteor: https://www.meteor.com/try

Why choose Meteor in the first place: [Why Meteor?](http://wiki.dandascalescu.com/essays/why_meteor)


## Conclusion

The very first iteration achieved the core functionality of Instagram in ~50 lines of JavaScript and ~15 lines of HTML (as of the [first commit](https://github.com/dandv/instagram-clone/commit/8a9ff33353b9f657540030813be25fb6fa887118)). For only 200 more lines, we get a real-time reactive map, shake to undo (all cross-platform), access control, responsive layout, material design theme, and a REST API.


## TODO

Features having little to do with Meteor, but adding to the effect:

* plot the pictures in the map markers


Features interesting to a Chinese audience

* use Baidu Map if possible, but see https://en.wikipedia.org/wiki/Baidu_Maps#Coordinate_system
* send message via Weibo


Meteor-specific features

* polish the REST API to return links to the photo notes - blocked by [nimble:restivus issue](https://github.com/kahmali/meteor-restivus/issues/35)


## License

This code is dual licensed:

* GPL license for non-commercial use
* commercial license otherwise; please contact the author at ddascalescu AT gmail.com

Copyright (C) 2015 Dan Dascalescu. Developed for Huawei / Futurewei Technologies Inc.
