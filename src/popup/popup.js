import { parseDate, createTitle } from "../background.js";

window.addEventListener("load", (e) => {
  chrome.storage.sync.get(["data"], function (result) {
    console.log(result.data);
    for (let idx = 0; idx < result.data.length; idx++) {
      document.getElementById("list").appendChild(createItemElement(result.data[idx].title, result.data[idx].time, idx));
    }
  });
});

document.getElementById("buttons").addEventListener("click", async (e) => {
  let winData = await chrome.storage.sync.get(["window"]);
  winData = winData.window;
  let storageData = await chrome.storage.sync.get(["data"]);
  storageData = storageData.data;
  let curWin = await chrome.windows.getCurrent();
  let tabs = await chrome.tabs.query({ currentWindow: true });
  console.log(winData);
  console.log(curWin);
  console.log(tabs);
  let time = new Date();
  time.setHours(time.getHours() + 9);
  let newData = { title: createTitle(tabs[0].title, tabs.length), time: parseDate(time), urls: tabs.map(tab => tab.url) };

  if (!Object.keys(winData).includes(curWin.id)) {
    storageData.push(newData);
    document.getElementById("list").appendChild(createItemElement(createTitle(tabs[0].title, tabs.length), newData.time, storageData.length));
  } else {

  }
  winData[curWin.id.toString()] = newData.urls;
  chrome.storage.sync.set({ window: winData })
    .then(() => {
      console.log("storage 'window' is now set to :");
      console.log({ window: winData });
    });
  chrome.storage.sync.set({ data: storageData })
    .then(() => {
      console.log("storage 'data' is now set to :");
      console.log({ data: storageData });
    });
});

function createItemElement(nameString, timeString, idx = -1) {
  let elem = document.createElement("div");
  elem.classList.add("item");
  elem.dataset.idx = idx;
  let nameTag = document.createElement("p");
  nameTag.classList.add("itemName");
  nameTag.innerHTML = nameString;
  let timeTag = document.createElement("p");
  timeTag.classList.add("itemTime");
  timeTag.innerHTML = `updated: ${timeString}`;
  elem.appendChild(nameTag);
  elem.appendChild(timeTag);
  elem.addEventListener("click", (e) => {

  });
  return elem;
}

