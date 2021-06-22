importScripts('https://www.gstatic.com/firebasejs/6.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.2.0/firebase-messaging.js');
firebase.initializeApp({
    apiKey: "AIzaSyBs51W_gUG4kyKNIU71nXQoSI0vjmeq2mo",
    authDomain: "truckbuddy-in.firebaseapp.com",
    databaseURL: "https://truckbuddy-in.firebaseio.com",
    projectId: "truckbuddy-in",
    storageBucket: "truckbuddy-in.appspot.com",
    messagingSenderId: "835258143479",
    appId: "1:835258143479:web:25014d81159beed32db9f2",
    measurementId: "G-EX67FL17P4",
    
  });

const messaging = firebase.messaging();