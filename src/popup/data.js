import {
  data,
  temp
} from "./popup.js";

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
      for (let i = 0; i < tabs.length; i++) {
        chrome.tabs.update(tabs[i].id, { url: snapToOpen.urls[i] });
      }
      for (let i = tabs.length; i < snapToOpen.urls.length; i++) {
        chrome.tabs.create({ url: snapToOpen.urls[i], windowId: currWin.id });
      }
    } else {
      for (let i = 0; i < snapToOpen.urls.length; i++) {
        chrome.tabs.update(tabs[i].id, { url: snapToOpen.urls[i] });
      }
      for (let i = snapToOpen.urls.length; i < tabs.length; i++) {
        chrome.tabs.remove(tabs[i].id);
      }
    }
  }
}

async function refreshTemp(temp) {
  let windows = await chrome.windows.getAll();
  let openWinIds = windows.map(window => window.id + "");
  console.log("refreshing Temp.");
  // console.log({
  //   temp,
  //   openWinIds
  // });
  Object.keys(temp).forEach(winId => {
    if (!openWinIds.includes(winId)) {
      console.log(`delete ${winId} from temp because it is closed.`);
      delete temp[winId];
    }
  });
  // console.log("deleting complete. now temp is: ");
  // console.log(temp);

  chrome.storage.local.set({ temp: temp })
    .then(() => {
      console.log("temp is refreshed.");
      console.log({ temp });

      return temp;
    })
    .catch((error) => {
      console.log("error occured at saving temp.");
      console.error(error);
      console.log("returning empty temp..");
      return {};
    });
}

// function addToTemp(temp, winId, idx) {
//   temp[winId + ""] = parseInt(idx);

//   chrome.storage.local.set({ temp: temp }, () => {
//     console.log(`${winId} : ${idx} added to temp.`);
//     return temp;
//   });
// }

// function removeFromTemp(temp, winId) {
//   delete temp[winId + ""];
//   chrome.storage.local.set({ temp: temp }, () => {
//     console.log(`${winId} deleted from temp.`);
//     return temp;
//   });
// }

function generateSnapObj(tabs) {
  return {
    tags: [],
    folderStack: [],
    lastOpened: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    urls: tabs.map(tab => tab.url),
    titles: tabs.map(tab => tab.title)
  };
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

function isOpened(winId, temp) {
  if (temp === undefined || temp === null) {
    console.log(`isOpened : temp is ${temp}..`);
    return false;
  } else {
    return Object.keys(temp).includes(winId);
  }
}

export {
  openWindow,
  refreshTemp,
  generateSnapObj,
  saveDatas,
  isOpened
};