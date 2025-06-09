// src/utils/initGapi.js

export const initGapi = () => {
  return new Promise((resolve, reject) => {
    window.gapi.load("client:auth2", async () => {
      try {
        await window.gapi.client.init({
          apiKey: "AIzaSyA_SjJzEWQQbOhfKbKZDNy2WDuPigz3nEg",
          clientId: "1084578781393-683s9nlb2n7jkdhg9j82lgpnl7n5v30k.apps.googleusercontent.com",
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
          ],
          scope: "https://www.googleapis.com/auth/calendar.events"
        });
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
};
