import {
  data,
  temp
} from "./popup.js";

function generateSnapObj(tabs) {
  return {
    lastOpened: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    urls: tabs.map(tab => tab.url),
    titles: tabs.map(tab => tab.title)
  };
}

async function openWindow(idx) {
  let currWin = await chrome.windows.getCurrent({ populate: true });
  let currWinIdStr = currWin.id + "";
  let tabs = currWin.tabs;
  let snapToOpen = data[idx];
  if (snapToOpen !== undefined) {
    temp[currWinIdStr] = idx;
    chrome.storage.local.set({ temp }).then(() => {
      console.log("opening new window and added id to temp.");
    });

    if (tabs.length <= snapToOpen.urls.length) {
      chrome.tabs.update(tabs[0].id, { url: snapToOpen.urls[0], active: true });
      for (let i = 1; i < tabs.length; i++) {
        chrome.tabs.update(tabs[i].id, { url: snapToOpen.urls[i], active: false });
      }
      for (let i = tabs.length; i < snapToOpen.urls.length; i++) {
        chrome.tabs.create({ url: snapToOpen.urls[i], windowId: currWin.id, active: false });
      }
    } else {
      chrome.tabs.update(tabs[0].id, { url: snapToOpen.urls[0], active: true });
      for (let i = 1; i < snapToOpen.urls.length; i++) {
        chrome.tabs.update(tabs[i].id, { url: snapToOpen.urls[i], active: false });
      }
      for (let i = snapToOpen.urls.length; i < tabs.length; i++) {
        chrome.tabs.remove(tabs[i].id);
      }
    }
  }
}

function existsInTemp(winId) {
  if (temp === undefined || temp === null) {
    console.log(`existsInTemp : temp is ${temp}..`);
    return false;
  } else {
    return Object.keys(temp).includes(winId);
  }
}

async function refreshTemp() {
  let windows = await chrome.windows.getAll();
  let openWinIds = windows.map(window => window.id + "");
  console.log("refreshing Temp.");

  Object.keys(temp).forEach(winId => {
    if (!openWinIds.includes(winId)) {
      console.log(`delete ${winId} from temp because it is closed.`);
      delete temp[winId];
    }
  });

  chrome.storage.local.set({ temp: temp });
}

async function saveDatas(data, lastIdx, temp) {
  // save datas
  chrome.storage.local.set({
    data: data,
    lastIdx: lastIdx,
    temp: temp
  }).then(async () => {
    console.log("datas are Saved.");
    console.log({
      data,
      lastIdx,
      temp
    });
  });
}

export {
  openWindow,
  refreshTemp,
  generateSnapObj,
  saveDatas,
  existsInTemp
};