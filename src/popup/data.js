async function openWindow(idx) {
  let currWin = await chrome.windows.getCurrent({ populate: true });
  let tabs = currWin.tabs;
  /*
  chrome.runtime.sendMessage({
    where: "popup.js openWindow",
    currWin,
    tabs,
    idx,
    idxType: typeof idx
  });
*/
  let currData = data[idx];
  if (currData !== undefined) {
    /*
    chrome.runtime.sendMessage({
      currData,
      urls: currData.urls
    });
    */
    addToTemp(currWin.id.toString(), idx);

    if (tabs.length <= currData.urls.length) {
      for (let i = 0; i < tabs.length; i++) {
        chrome.tabs.update(tabs[i].id, { url: currData.urls[i] });
      }
      for (let i = tabs.length; i < currData.urls.length; i++) {
        chrome.tabs.create({ url: currData.urls[i], windowId: currWin.id });
      }
    } else {
      for (let i = 0; i < currData.urls.length; i++) {
        chrome.tabs.update(tabs[i].id, { url: currData.urls[i] });
      }
      for (let i = currData.urls.length; i < tabs.length; i++) {
        chrome.tabs.remove(tabs[i].id);
      }
    }
  }
}

function refreshTemp(temp) {
  chrome.windows.getAll((windows) => {
    let openWinIds = windows.map(window => window.id);
    console.log(openWinIds);
    Object.keys(temp).forEach(winId => {
      if (!openWinIds.includes(winId.toString())) {
        console.log(`delete ${winId} from temp because it is closed.`);
        delete temp[winId];
      }
    });
    console.log("deleting complete. now temp is: ");
    console.log(temp);

    chrome.storage.local.set({ temp: temp })
      .then(() => {
        console.log("temp is saved to storage.");
        console.log({ temp });

        return temp;
      });
  });
}

function addToTemp(temp, winId, idx) {
  temp[winId + ""] = parseInt(idx);

  chrome.storage.local.set({ temp: temp }, () => {
    console.log(`addToTemp > ${winId} : ${idx} added.`);
    return temp;
  });
}

function removeFromTemp(temp, winId) {
  delete temp[winId + ""];
  return temp;
}

function generateSnapObj(tabs) {
  return {
    tags: [],
    pathStack: [],
    lastOpened: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    urls: tabs.map(tab => tab.url),
    titles: tabs.map(tab => tab.title)
  };
}

async function saveDatas(data, lastIdx) {
  // save datas
  chrome.storage.local.set({
    data: data,
    lastIdx: lastIdx,
  }).then(async () => {
    console.log("data, lastIdx is saved.");
    console.log({
      data,
      lastIdx
    });
  });
}

function isOpened(winId, temp) {
  return Object.keys(temp).includes(winId);
}

export { 
  openWindow,
  refreshTemp,
  addToTemp,
  removeFromTemp,
  generateSnapObj,
  saveDatas,
  isOpened
};