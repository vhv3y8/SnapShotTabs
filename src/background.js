chrome.runtime.onInstalled.addListener(() => {

  let storageInit = {
    data:
      [
        {
          idx: 1,
          title: createTitle("chrome.runtime - Chrome Developers", 2),
          time: parseDate(new Date('December 17, 1995 03:24:00')),
          urls: ["https://developer.chrome.com/docs/extensions/reference/storage/", "https://developer.chrome.com/docs/extensions/mv3/service_workers/"]
        },
        {
          idx: 2,
          title: createTitle("Number.prototype.toString() - JavaScript | MDN", 2),
          time: parseDate(new Date()),
          urls: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date"]
        }
      ],
    lastIdx: 2,
    window: {}
  };
  chrome.storage.sync.set(storageInit)
    .then(() => {
      console.log("storage set.");
      console.log(storageInit);
    });
});

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