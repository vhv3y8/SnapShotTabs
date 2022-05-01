chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    data:
      [
        {
          time: new Date('December 17, 1995 03:24:00').toISOString().replace("T", " ").slice(0, -5),
          urls: ["https://developer.chrome.com/docs/extensions/reference/storage/", "https://developer.chrome.com/docs/extensions/mv3/service_workers/"]
        },
        {
          time: new Date().toISOString().replace("T", " ").slice(0, -5),
          urls: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date"]
        }
      ]
  }, function () {
    console.log("onInstalled event - data is set.");
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

var hihi = "asdfadf";