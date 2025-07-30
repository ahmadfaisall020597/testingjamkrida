// // src/notificationHandler.js
// import { messaging } from './firebaseConfig';
// import { getToken, onMessage } from "firebase/messaging";

// export const requestPermission = async () => {
//     // console.log('Requesting permission...');
//     const permission = await Notification.requestPermission();
//     if (permission === 'granted') {
//         console.log('Notification permission granted.');
//         getFCMToken();
//     } else {
//         console.log('Unable to get permission to notify.');
//     }
// };

// const getFCMToken = async () => {
//     try {
//         if (typeof window !== "undefined" && "Notification" in window) {
//             const currentToken = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY });
//             if (currentToken) {
//                 // console.log('FCM Token:', currentToken);
//                 // TODO: Send the token to your server and save it.
//             } else {
//                 console.log('No registration token available. Request permission to generate one.');
//             }
//         }
        
//     } catch (error) {
//         console.error('An error occurred while retrieving token. ', error);
//     }
// };

// export const onMessageListener = () =>
//     new Promise((resolve) => {
//         onMessage(messaging, (payload) => {
//             resolve(payload);
//         });
//     });
