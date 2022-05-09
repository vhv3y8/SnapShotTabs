import {
  refreshTemp,
  generateSnapObj,
  saveDatas,
  existsInTemp
} from "./data.js";
import {
  createItemElement,
  modeChangeUI,
  appendToList,
  setBtnTo
} from "./ui.js";

let data;
let lastIdx;
let temp;
let mode = "open"; // "open" | "delete"
let toDelete = [];

window.addEventListener("load", async (e) => {
  let curWin = await chrome.windows.getCurrent();
  let currWinIdStr = curWin.id + "";
  let storageAll = await chrome.storage.local.get();
  let list = document.getElementById("list");

  data = storageAll.data;
  lastIdx = storageAll.lastIdx;
  temp = storageAll.temp;

  console.log("fetched all data from storage.");
  console.log({
    data,
    lastIdx,
    curWin,
    temp
  });

  console.log("first fetched temp:");
  console.log(Object.assign({}, temp));

  refreshTemp()
    .then(res => {
      console.log("refreshed and getted Temp from popup. now temp is :");
      console.log(temp);
    });

  // console.log("updated temp. now temp is ");
  // console.log({ temp });

  document.querySelector("nav.open").style.display = "true";
  document.querySelector("nav.edit").style.display = "none";
  document.querySelector("nav.delete").style.display = "none";

  Object.keys(storageAll.data)
    .sort((a, b) => (moment(storageAll.data[a].lastUpdated).isBefore(moment(storageAll.data[b].lastUpdated))) ? 1 : -1)
    .forEach((idx) => {
      list.appendChild(createItemElement(data[idx].titles[0], data[idx].urls.length, data[idx].lastUpdated, data[idx].urls, data[idx].titles, idx));
    });

  let btn = document.getElementById("btn");
  if (existsInTemp(currWinIdStr)) {
    let idx = temp[currWinIdStr];
    document.querySelector(`[data-idx="${idx}"]`).classList.add("current");
    document.querySelector(`[data-idx="${idx}"]`).scrollIntoView({ behavior: "smooth", block: "center" });

    setBtnTo("update");
  } else {
    setBtnTo("add");
  }

  // delete mode
  let deleteIcon = document.getElementById("deleteIcon");
  deleteIcon.addEventListener("click", () => {
    // change nav contents
    mode = "delete";
    modeChangeUI("delete");
    setBtnTo("delete");
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
  let currWinIdStr = curWin.id + "";

  if (mode === "open") {
    console.log("open mode.");
    let currTabs = await chrome.tabs.query({ currentWindow: true });
    let newSnap;

    if (existsInTemp(currWinIdStr)) { // update
      let currIdx = temp[currWinIdStr];
      newSnap = data[currIdx]; // this makes updating newSnap update data too?
      newSnap.lastUpdated = new Date().toISOString();
      newSnap.urls = currTabs.map(tab => tab.url);
      newSnap.titles = currTabs.map(tab => tab.title);
      appendToList(newSnap, currIdx, false);
      // updateItem(newSnap, tabs, currIdx).then(saveDatas);
      
    } else { // add
      newSnap = generateSnapObj(currTabs);
      let currIdx = ++lastIdx + "";
      data[currIdx] = newSnap;
      appendToList(newSnap, currIdx, true);
      // createItem(newSnap, tabs, ++lastIdx).then(saveDatas);
      temp[currWinIdStr] = currIdx;

      document.querySelector(`[data-idx="${currIdx}"]`).classList.add("current");
    }
    
    saveDatas(data, lastIdx, temp);
  
    setBtnTo("update");
    // let toUpdate = data[idx];
    // if (toUpdate === undefined) {
    //   createItem(newSnap, currTabs, idx);
    // } else {
    // }

  } else if (mode === "delete") {
    console.log("delete mode.");
    if (toDelete.length > 0) {
      console.log("start deleting.");
      Array.from(document.querySelectorAll(`.item.selected`)).forEach(elem => {
        elem.remove();
      });

      // if current is being delete, remove current window from temp too.
      /*
      if (existsInTemp(currWinIdStr, temp) && toDelete.includes(temp[currWinIdStr])) {
        delete temp[currWinIdStr];
        btn.querySelector("img").src = "../../assets/icons/iconmonstr-plus-2.svg";
        btn.querySelector("span").textContent = "Add Current Window";
        btn.classList.remove("update");

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
      } else {

      }
      */

      toDelete.forEach((idx) => {
        delete data[idx];
        
        if (Object.values(temp).includes(idx)) {
          // delete from temp
          delete temp[Object.fromEntries(Object.entries(temp).map(ent => ent.reverse()))[idx]];
        }
      });
      toDelete = [];
      chrome.storage.local.set({ data: data, temp: temp })
        .then(() => {
          console.log("datas and temp deleted successfully.");
        });
      
      mode = "open";
      modeChangeUI("open");
      setBtnTo((existsInTemp(currWinIdStr, temp)) ? "update" : "add");
    }
  }
});

export { data, lastIdx, temp, mode, toDelete };