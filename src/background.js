chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({data: JSON.stringify([])}, function() {
    console.log("onStartup Event. data is [].");
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