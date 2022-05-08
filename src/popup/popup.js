import { 
  refreshTemp,
  generateSnapObj,
  saveDatas
} from "data.js";
import { 
  createItemElement,
  openWindow,
  modeChangeUI,
  updateItem,
  createItem
} from "ui.js";

let data;
let lastIdx;
let temp;
let mode = "open"; // "open" | "delete"
let toDelete = [];

window.addEventListener("load", async (e) => {
  let curWin = await chrome.windows.getCurrent();
  let curWinIdStr = curWin.id + "";
  let storageAll = await chrome.storage.local.get();
  let list = document.getElementById("list");
  
  data = storageAll.data;
  lastIdx = storageAll.lastIdx;
  temp = storageAll.temp;
  
  console.log("first fetched temp:");
  console.log(Object.assign({}, temp));
  temp = refreshTemp(temp);
  console.log("updated temp. now temp is ");
  console.log(temp);
  console.log("fetched all data from storage.");
  console.log({
    data,
    lastIdx,
    curWin
  });

  document.querySelector("nav.open").style.display = "true";
  document.querySelector("nav.edit").style.display = "none";
  document.querySelector("nav.delete").style.display = "none";
  
  Object.keys(storageAll.data)
    .sort((a, b) => (moment(storageAll.data[a].lastUpdate).isBefore(moment(storageAll.data[b].lastUpdate))) ? 1 : -1)
    .forEach((idx) => {
      list.appendChild(createItemElement(data[idx].titles[0], data[idx].urls.length, data[idx].lastUpdate, idx));
    });
  
  if (isOpened(curWinIdStr, temp)) {
    let idx = temp[curWinIdStr];
    document.querySelector(`[data-idx="${idx}"]`).classList.add("current");
  }

  // delete mode
  let deleteIcon = document.getElementById("deleteIcon");
  deleteIcon.addEventListener("click", () => {
    // change nav contents
    mode = "delete";
    modeChangeUI("delete");
    toDelete = [];
  });
  
  let exitIcon = document.getElementsByClassName("exitIcon");
  Array.from(exitIcon).forEach((elem) => {
    elem.addEventListener("click", () => {
      mode = "open";
      modeChangeUI("open");
    });
  });
});
  // input reset button
  // let input = document.getElementById("searchInput");
  // let inputReset = document.getElementById("inputReset");
  // document.addEventListener("keyup", (e) => {
  //   if (document.activeElement === input) {
  //     if (input.value === "") {
  //       inputReset.style.visibility = "hidden";
  //     } else {
  //       inputReset.style.visibility = "visible";
  //     }
  //   }
  // });
  // inputReset.addEventListener("click", (e) => {
  //   input.value = "";
  //   inputReset.style.visibility = "hidden";
  //   input.focus();
  // });

// save | update | delete item
let btn = document.getElementById("btn");
btn.addEventListener("click", async () => {
  let curWin = await chrome.windows.getCurrent();
  console.log({
    mode,
    temp,
    curWin
  });
  let curWinIdStr = curWin.id + "";

  if (mode === "open") {
    console.log("open mode.");
    let tabs = await chrome.tabs.query({ currentWindow: true });
    let newSnap = generateSnapObj(tabs);
    
    let toUpdate = data[idx];
    if (toUpdate === undefined) {
      createItem(newSnap, tabs, idx);
    } else {
    }
    
    if (isOpened(curWinIdStr, temp)) {
      let currIdx = temp[curWinIdStr];
      
      updateItem(newSnap, tabs, currIdx).then(saveDatas);
    } else {
      data[idx] = newSnap;
      createItem(newSnap, tabs, ++lastIdx).then(saveDatas);
      temp[curWinIdStr] = idx;
    }
  } else if (mode === "delete") {
    console.log("delete mode.");
    if (toDelete.length > 0) {
      console.log("start deleting.");
      Array.from(document.querySelectorAll(`.item.selected`)).forEach(elem => {
        elem.remove();
      });
      toDelete.forEach((idx) => {
        delete data[idx];
      });
      toDelete = [];
      chrome.storage.local.set({ data: data })
        .then(() => {
          console.log("datas deleted successfully.");
        });
      mode = "open";
      modeChangeUI("open");
    }
  }
});