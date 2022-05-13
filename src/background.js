// temp: {
//   windowId: idx
// }
// data: {
//   idx: {
//     lastOpened: Date().toISOString(),
//     lastUpdated: Date().toISOString(),
//     urls: ["url1", "url2"],
//     titles: ["title1", "title2"]
//   }
// }


chrome.runtime.onInstalled.addListener(() => {
  console.log("onInstalled.");
  chrome.storage.local.get()
    .then((res) => {
      if (Object.keys(res).length === 0) {
        let storageInit = {
          data: {},
          lastIdx: 0,
          temp: {}
        };
        chrome.storage.local.set(storageInit)
          .then(() => {
            console.log("storage set.");
            console.log(storageInit);
          });
      }
    });
});

chrome.runtime.onMessage.addListener((req, sender, sendRes) => {
  console.log("message!");
  if (Object.keys(req).includes("tempChanged")) {
    console.log(req.tempChanged);
  } else {
    console.log(req);
  }
});