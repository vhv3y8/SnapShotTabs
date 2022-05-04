// temp: {
//   windowId: idx
// }
// data: {
//   idx: {
//     tags: ["title"],
//     path: ["grandparent folder", "parent folder"],
//     lastOpen: "Date",
//     lastUpdate: "Date",
//     urls: ["url1", "url2"]
//   }
// }


chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get()
    .then((res) => {
      if (Object.keys(res).length === 0) {
        let storageInit = {
          data: {},
          lastIdx: 0,
          temp: {}
        };
        chrome.storage.sync.set(storageInit)
          .then(() => {
            console.log("storage set.");
            console.log(storageInit);
          });
      }
    });
});

// "1": {
//   tags: [createTitle("chrome.runtime - Chrome Developers", 2)],
//   path: [],
//   lastOpen: parseDate(new Date('December 17, 1995 03:24:00')),
//   lastUpdate: parseDate(new Date('December 17, 1995 03:24:00')),
//   urls: ["https://developer.chrome.com/docs/extensions/reference/storage/", "https://developer.chrome.com/docs/extensions/mv3/service_workers/"]
// },
// "2": {
//   tags: [createTitle("Number.prototype.toString() - JavaScript | MDN", 2)],
//   path: [],
//   lastOpen: parseDate(new Date()),
//   lastUpdate: parseDate(new Date()),
//   urls: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date"]
// }

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});

export function parseDate(date) {
  return date.toISOString().replace("T", " ").slice(0, -5);
}

export function createTitle(title, arrLength) {
  if (arrLength == 1) {
    return `${title.slice(0, 35)}`;
  } else {
    return `${title.slice(0, 20)}... and ${arrLength - 1} more`;
  }
}

chrome.runtime.onMessage.addListener((req, sender, sendRes) => {
  console.log("message!");
  console.log(req);
});