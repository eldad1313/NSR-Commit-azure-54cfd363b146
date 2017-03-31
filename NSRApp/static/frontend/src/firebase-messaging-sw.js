/**
 * This is a service worker that handles all communication with firebase-cloud-messaging (FCM).
 * When the app is active (the active tab) it will send all messages to the app. Otherwise, it
 * defines a background message handler. And handles the messages itself. The app handles all
 * FCM messages through the FcmService.
 */

// these scripts are needed for FCM to work.
importScripts('https://www.gstatic.com/firebasejs/3.6.10/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.6.10/firebase-messaging.js');

const NOTIFICATION_LIFE_IN_MILLISECONDS = 5000;
let registrationMap = {};    // { topic: token }

// start-up the FCM
firebase.initializeApp({ messagingSenderId: '364711707890' });
const messaging = firebase.messaging();

// define the behavior of the service-worker when a message is received.
messaging.setBackgroundMessageHandler(payload => {
    let notificationPromise = clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(windowClients => sendMessageToClients(windowClients, payload))
        .then(() => openNotification(payload));
    notificationPromise.then(() => closeAllNotifications(NOTIFICATION_LIFE_IN_MILLISECONDS));
    return notificationPromise;
});

// All client API calls pass through this callback
self.addEventListener('fetch', event => {
    // save the topic registration request
    let topicRegistration = event.request.url.match(/^https:\/\/iid.googleapis.com\/iid\/v1\/(.*?)\/rel\/topics\/(.*)$/);
    if (topicRegistration) {
        const token = topicRegistration[1];
        const topic = topicRegistration[2];
        registrationMap[topic] = token;
    }

    // Pass along the request to the server and return the server response
    event.respondWith(
        fetch(event.request).then(res => res).catch(err => err)
    );
});

// Occasionally check if no client is active and unregister from all topics.
// This is needed in order to prevent background messages from appearing.
setInterval(() => {
    clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then(clients => {
        if (clients.length === 0) {
            for (let topic in registrationMap) {
                unregisterFromTopic(topic, registrationMap[topic])
                    .then(res => console.log('SW: UNREGISTERED FROM TOPIC AFTER CLOSING TAB'))
                    .catch(err => console.log('SW: fetch error while unregistering from topic:', err));
                delete registrationMap[topic];
            }
        }
    });
}, 1000);



function closeAllNotifications(timeoutTime) {
    timeoutTime = timeoutTime || 0;
    self.registration.getNotifications().then(notifications => {
        setTimeout(() => {
            notifications.forEach(notification => notification.close());
        }, timeoutTime);
    });
}

function sendMessageToClients(windowClients, payload) {
    windowClients.forEach(client => {
        client.postMessage({
            'firebase-messaging-msg-type': 'push-msg-received',
            'firebase-messaging-msg-data': payload
        });
    });
}

function openNotification(payload) {
    const title = 'Background FCM message handler';
    const options = { body: payload.data.notification };
    return self.registration.showNotification(title, options);
}

function unregisterFromTopic(topic, token) {
    return fetch('https://iid.googleapis.com/iid/v1:batchRemove', {
        method: 'post',
        headers: new Headers({
            Authorization: 'key=AAAAVOqDBPI:APA91bEfeKisA-pcFtO_JngPIplN0MxYOXHJRGx9R7JjrmRV5B1sqes04353yzVCSpJHiheQoSc7ci_5TFr539ZGh2_bXW71-dYkR7V1ItIZSsBK2im8-AwIcNdF1ryn1ak78q9NW45T',
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            to: `/topics/${topic}`,
            registration_tokens: [token]
        })
    });
}
