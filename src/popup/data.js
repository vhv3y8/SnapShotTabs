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
  let snapToOpen = data[idx];

  if (snapToOpen !== undefined) {
    chrome.windows.create({ focused: true, url: snapToOpen.urls })
      .then((createdWin) => {
        temp[createdWin.id + ""] = idx;

        chrome.storage.local.set({ temp }).then(() => {
          console.log("opening new window and added id to temp.");
        });
      });
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