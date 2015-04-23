App.info({
    id: 'com.dandascalescu.huawei.demo',
    name: 'Huawei Meteor demo',
    description: 'Cross-platform Meteor.js app demo for Huawei, by Dan Dascalescu',
    author: 'Dan Dascalescu',
    email: 'ddascalescu+meteor@gmail.com',
    website: 'http://huawei.meteor.com',
    version: '0.1.0'
});

App.icons({
    'android_ldpi': 'public/icon-96x96.png',
    'android_mdpi': 'public/icon-96x96.png',
    'android_hdpi': 'public/icon-96x96.png',
    'android_xhdpi': 'public/icon-96x96.png'
});

App.accessRule('*.google.com/*');
App.accessRule('*.googleapis.com/*');
App.accessRule('*.gstatic.com/*');
App.accessRule('*');
