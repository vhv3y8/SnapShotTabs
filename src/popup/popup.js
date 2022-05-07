// import { createTitle } from "../background.js";

let data;
let lastIdx;
let temp;
let mode = "open"; // "open" | "edit" | "delete"
let toDelete = [];

window.addEventListener("load", async (e) => {
  document.querySelector("nav.open").style.display = "true";
  document.querySelector("nav.edit").style.display = "none";
  document.querySelector("nav.delete").style.display = "none";
  console.log(moment(new Date().toISOString()).fromNow());

  let curWin = await chrome.windows.getCurrent();
  chrome.storage.local.get()
    .then((res) => {
      data = res.data;
      lastIdx = res.lastIdx;
      temp = res.temp;
      console.log("fetched all data from storage.");
      console.log({
        data,
        lastIdx,
        temp,
        curWin
      });
      console.log(Object.keys(res.data)
        .sort((a, b) => (moment(res.data[b].lastUpdate).isBefore(moment(res.data[a].lastUpdate))) ? -1 : 1));

      Object.keys(res.data)
        .sort((a, b) => (moment(res.data[b].lastUpdate).isBefore(moment(res.data[a].lastUpdate))) ? -1 : 1)
        .forEach((idx) => {
          // let korTime = new Date(data[idx].lastOpen);
          // console.log({
          //   korTime,
          //   type: typeof korTime
          // })
          // korTime.setHours(korTime.getHours() + 9);
          document.getElementById("list").appendChild(createItemElement(data[idx].titles[0], data[idx].urls.length, data[idx].lastUpdate, idx));
        })
    });

  // delete mode
  let deleteIcon = document.getElementById("deleteIcon");
  deleteIcon.addEventListener("click", () => {
    // change nav contents

    modeChangeUI("delete");
    console.log("changed..");
  });
  let exitIcon = document.getElementsByClassName("exitIcon");
  Array.from(exitIcon).forEach((elem) => {
    elem.addEventListener("click", () => {

      modeChangeUI("open");
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

  // let list = document.getElementById("list");
  // edit mode
  // let editIcon = document.getElementById("editIcon");
  // editIcon.addEventListener("click", () => {
  //   // change nav contents

  //   mode = "edit";
  //   document.body.classList.remove("open");
  //   document.body.classList.remove("delete");
  //   document.body.classList.add("edit");

  //   document.querySelector("nav.open").style.display = "none";
  //   document.querySelector("nav.edit").style.display = "";
  //   console.log("changed..");
  // });


});

// https://stackoverflow.com/a/60361626/13692546
// window.addEventListener("beforeunload", async (e) => {
//   e.preventDefault();

//   await chrome.stroage.sync.set({
//     data: data,
//     lastIdx: lastIdx,
//     temp: temp
//   })
//     .then(() => {
//       chrome.runtime.sendMessage({
//         data: data,
//         lastIdx: lastIdx,
//         temp: temp
//       });
//     });
// });

function updateItem(newData, idx) {

  // update element
  // chrome.runtime.sendMessage({ where: "click save button: check if temp includes curWin.id", does: Object.keys(temp).includes(curWin.id.toString()) })

  let toUpdate = data[idx];
  if (toUpdate === undefined) {
    createItem(newData, idx);
  } else {
    console.log("temp includes curWin.id: temp[curWin.id].toString(), TABS");
    // console.log({
    //   temp,
    //   idx,
    //   curWinId: curWin.id.toString(),
    //   toUpdate,
    //   tabs
    // });
    // console.log({
    //   data,
    //   lastIdx,
    //   temp,
    //   curWin
    // });
    console.log({
      temp,
      idx,
      toUpdate,
      newData
    });
    toUpdate.lastUpdate = newData.lastUpdate;
    // toUpdate.lastUpdate.setHours(toUpdate.lastUpdate.getHours() + 9);
    toUpdate.urls = newData.urls;
    toUpdate.titles = newData.titles;
    console.log({
      what: "updating object",
      toUpdate
    });
    document.querySelector(`[data-idx='${idx}']`).replaceWith(createItemElement(tabs[0].title, toUpdate.urls.length, toUpdate.lastUpdate, idx));
    document.querySelector(`[data-idx='${idx}']`).classList.add("blink");
    // document.querySelector(`[data-idx='${currIdx}']`).classList.remove("blink");
    // temp[curWin.id.toString()] = currIdx;
  }
}

function createItem(newData, idx) {
  // add data and new element
  // chrome.runtime.sendMessage({ does: Object.keys(temp).includes(curWin.id.toString()), temp, id: curWin.id });
  // if (data[idx] === undefined) {
  //   c
  // }
  data[idx] = newData;
  console.log("adding new element: current lastIdx, data");
  console.log({
    lastIdx,
    data
  });
  document.getElementById("list").appendChild(createItemElement(newData.titles[0], newData.urls.length, newData.lastUpdate, idx));
  // add or update current window to temp
  temp[curWin.id.toString()] = lastIdx;
}

// save item
let btn = document.getElementById("btn");
btn.addEventListener("click", async () => {
  console.log(mode);
  console.log("hihihihihihihihihihihi");
  switch (mode) {
    case "open": {
      console.log("open mode.");
      let curWin = await chrome.windows.getCurrent();
      let newData = await generateData();
      let tabs = await chrome.tabs.query({ currentWindow: true });

      // console.log(newData);
      // let lastOpen = new Date(newData.lastOpen);
      // let lastUpdate = new Date(newData.lastUpdate);
      // lastOpen.setHours(lastOpen.getHours() + 9);
      // lastUpdate.setHours(lastUpdate.getHours() + 9);
      // console.log(newData);
      console.log("fetched: Object.keys(temp), curWin.id");
      console.log({
        objectKeysTemp: Object.keys(temp),
        id: curWin.id,
        newData
      });

      console.log(temp);
      updateTemp();
      console.log("updated temp. now temp is ");
      console.log(temp);

      if (Object.keys(temp).includes(curWin.id.toString())) {
        let currIdx = temp[curWin.id];
        updateItem(newData, currIdx);
      } else {
        createItem(newData, ++lastIdx);
      }
      // save datas
      // alternative for ignorant about beforeunload
      chrome.storage.local.set({
        data: data,
        lastIdx: lastIdx,
      }).then(() => {
        console.log("data, lastIdx, temp is saved.");
      });
      chrome.storage.local.set({ temp: temp }).then(() => {
        console.log("temp is saved.");
        console.log(temp);
      });

      break;
    };
    case "delete": {
      if (toDelete.length > 0) {
        console.log("delete mode.");
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
          })


        modeChangeUI("open");
      }

      break;
    };
  }
});
// document.getElementById("btn").addEventListener("click", async (e) => {
//   let curWin = await chrome.windows.getCurrent();
//   let newData = await generateData();
//   let tabs = await chrome.tabs.query({ currentWindow: true });
//   // console.log(newData);
//   let lastOpen = new Date(newData.lastOpen);
//   let lastUpdate = new Date(newData.lastUpdate);
//   // lastOpen.setHours(lastOpen.getHours() + 9);
//   // lastUpdate.setHours(lastUpdate.getHours() + 9);
//   // console.log(newData);
//   console.log("fetched: Object.keys(temp), curWin.id");
//   console.log({
//     objectKeysTemp: Object.keys(temp),
//     id: curWin.id
//   })

//   if (Object.keys(temp).includes(curWin.id.toString())) {
//     // update element
//     chrome.runtime.sendMessage({ where: "click save button: check if temp includes curWin.id", does: Object.keys(temp).includes(curWin.id.toString()) })
//     let currIdx = temp[curWin.id];
//     let toUpdate = data[currIdx];
//     console.log("toUpdate is :");
//     console.log(toUpdate);
//     // console.log("temp includes curWin.id: temp[curWin.id].toString(), TABS");
//     // console.log({
//     //   temp,
//     //   currIdx,
//     //   curWinId: curWin.id.toString(),
//     //   toUpdate,
//     //   tabs
//     // });
//     // console.log({
//     //   data,
//     //   lastIdx,
//     //   temp,
//     //   curWin
//     // });
//     toUpdate.lastUpdate = newData.lastUpdate;
//     // toUpdate.lastUpdate.setHours(toUpdate.lastUpdate.getHours() + 9);
//     toUpdate.urls = newData.urls;
//     toUpdate.titles = newData.titles;
//     console.log({
//       what: "updating object",
//       toUpdate
//     });
//     document.querySelector(`[data-idx='${currIdx}']`).remove();
//     let list = document.getElementById("list");
//     list.insertBefore(createItemElement(tabs[0].title, toUpdate.urls.length, toUpdate.lastUpdate, currIdx), list.firstChild);
//     // temp[curWin.id.toString()] = currIdx;
//   } else {
//     // add data and new element
//     // chrome.runtime.sendMessage({ does: Object.keys(temp).includes(curWin.id.toString()), temp, id: curWin.id });
//     data[++lastIdx] = newData;
//     console.log("adding new element: current lastIdx, data");
//     console.log({
//       lastIdx,
//       data
//     });
//     let list = document.getElementById("list");
//     list.insertBefore(createItemElement(newData.titles[0], newData.urls.length, lastUpdate, lastIdx), list.firstChild);
//     // add or update current window to temp
//     temp[curWin.id.toString()] = lastIdx;
//   }


//   // save datas
//   // alternative for ignorant about beforeunload
//   chrome.storage.local.set({
//     data: data,
//     lastIdx: lastIdx,
//   }).then(() => {
//     console.log("data, lastIdx, temp is saved.");
//   });
//   chrome.storage.local.set({ temp: temp }).then(() => {
//     console.log("temp is saved.");
//     console.log(temp);
//   });


//   //   .then(() => {
//   //     console.log("storage 'temp' is now set to :");
//   //     console.log({ temp: temp });
//   //   });
//   // chrome.storage.local.set({ data: data })
//   //   .then(() => {
//   //     console.log("storage 'data' is now set to :");
//   //     console.log({ data: data });
//   //   });
// });

function createItemElement(nameString, moreCount, timeString, idx) {
  // console.log(`createItemElement : idx is ${idx}`);
  let urls = data[idx].urls;
  let titles = data[idx].titles;

  let elem = document.createElement("div");

  elem.classList.add("item");
  elem.dataset.idx = idx;

  let itemBody = document.createElement("div");
  itemBody.classList.add("itemBody");

  let itemName = document.createElement("div");
  itemName.classList.add("itemName");
  let itemNameSpan = document.createElement("span");
  itemNameSpan.classList.add("title");
  itemNameSpan.setAttribute("title", nameString);
  itemNameSpan.textContent = nameString;
  itemName.appendChild(itemNameSpan);
  if (moreCount >= 2) {
    let itemMoreSpan = document.createElement("span");
    itemMoreSpan.classList.add("more");
    itemMoreSpan.textContent = `and ${moreCount - 1} more`;
    itemName.appendChild(itemMoreSpan);
  } else {
    itemName.querySelector(".title").style.maxWidth = "100%";
    // itemNameSpan.style.maxWidth = "calc(100% - 100px)";
  }
  // itemName.addEventListener("click", (e) => {
  //   if (mode === "open") {
  //     openWindow(idx);
  //   } else if (mode === "delete") {
  //     console.log("mode is delete.");
  //     if (Array.from(elem.classList).includes("selected")) {
  //       elem.classList.remove("selected");
  //       toDelete = toDelete.filter(ind => ind !== idx);
  //       document.getElementById("count").innerText = toDelete.length.toString();
  //     } else {
  //       elem.classList.add("selected");
  //       toDelete.push(idx);
  //       document.getElementById("count").innerText = toDelete.length.toString();
  //     }
  //   }
  // });

  let itemTime = document.createElement("div");
  itemTime.classList.add("itemTime");
  let timeImg = document.createElement("img");
  timeImg.setAttribute("src", "../../assets/icons/iconmonstr-synchronization-15.svg");
  let timeSpan = document.createElement("span");
  timeSpan.setAttribute("title", moment(timeString));
  timeSpan.textContent = moment(timeString).fromNow();
  itemTime.appendChild(timeImg);
  itemTime.appendChild(timeSpan);
  // itemTime.addEventListener("click", (e) => {
  //   if (mode === "open") {
  //     openWindow(idx);
  //   } else if (mode === "delete") {
  //     console.log("mode is delete.");
  //     if (Array.from(elem.classList).includes("selected")) {
  //       elem.classList.remove("selected");
  //       toDelete = toDelete.filter(ind => ind !== idx);
  //       document.getElementById("count").innerText = toDelete.length.toString();
  //     } else {
  //       elem.classList.add("selected");
  //       toDelete.push(idx);
  //       document.getElementById("count").innerText = toDelete.length.toString();
  //     }
  //   }
  // });

  itemBody.appendChild(itemName);
  itemBody.appendChild(itemTime);
  itemBody.addEventListener("click", (e) => {
    if (mode === "open") {
      openWindow(idx);
    } else if (mode === "delete") {
      console.log("mode is delete.");
      if (Array.from(elem.classList).includes("selected")) {
        elem.classList.remove("selected");
        toDelete = toDelete.filter(ind => ind !== idx);
        document.getElementById("count").innerText = toDelete.length.toString();


        document.getElementById("btn").classList.add("disabled");
      } else {
        elem.classList.add("selected");
        toDelete.push(idx);
        document.getElementById("count").innerText = toDelete.length.toString();
        document.getElementById("btn").classList.remove("disabled");
      }
      console.log(toDelete);
    }
  });

  let tabDiv = document.createElement("div");
  tabDiv.classList.add("tabDiv");
  let tabContainer = document.createElement("div");
  tabContainer.classList.add("tabContainer");
  for (let i = 0; i < urls.length; i++) {
    let currTabItem = document.createElement("div");
    currTabItem.classList.add("tabItem");
    // currTabItem.style.display = "none";
    let titleSpan = document.createElement("span");
    titleSpan.classList.add("title");
    titleSpan.setAttribute("title", titles[i]);
    titleSpan.textContent = titles[i];
    let urlSpan = document.createElement("span");
    urlSpan.classList.add("url");
    urlSpan.setAttribute("title", urls[i]);
    let currUrl = urls[i];

    if (currUrl.startsWith("https://")) {
      currUrl = currUrl.slice(8)
    } else if (currUrl.startsWith("http://")) {
      currUrl = currUrl.slice(7);
    }
    if (currUrl.startsWith("www.")) {
      currUrl = currUrl.slice(4);
    }
    urlSpan.textContent = currUrl;

    currTabItem.appendChild(titleSpan);
    currTabItem.appendChild(urlSpan);
    tabContainer.appendChild(currTabItem);
  }

  let expandTabs = document.createElement("div");
  expandTabs.classList.add("expandTabs");
  let arrow = document.createElement("img");
  arrow.setAttribute("src", "../../assets/icons/iconmonstr-arrow-65.svg");
  let showTabSpan = document.createElement("span");
  showTabSpan.textContent = "show tabs";
  expandTabs.appendChild(arrow);
  expandTabs.appendChild(showTabSpan);

  tabContainer.appendChild(expandTabs);

  tabContainer.addEventListener("click", (e) => {
    tabContainer.classList.toggle("expand");
    if (Array.from(tabContainer.classList).includes("expand")) {
      arrow.setAttribute("src", "../../assets/icons/iconmonstr-arrow-66.svg");
      showTabSpan.textContent = "hide tabs";
      // Array.from(tabContainer.querySelectorAll(".tabItem")).forEach((elem) => {
      //   elem.style.display = "";
      // });
    } else {
      arrow.setAttribute("src", "../../assets/icons/iconmonstr-arrow-65.svg");
      showTabSpan.textContent = "show tabs";
      // Array.from(tabContainer.querySelectorAll(".tabItem")).forEach((elem) => {
      //   elem.style.display = "none";
      // });
    }
  });

  tabDiv.appendChild(tabContainer);

  elem.appendChild(itemBody);
  elem.appendChild(tabDiv);

  return elem;
}

async function openWindow(idx) {
  let currWin = await chrome.windows.getCurrent({ populate: true });
  let tabs = currWin.tabs;
  chrome.runtime.sendMessage({
    where: "popup.js openWindow",
    currWin,
    tabs,
    idx,
    idxType: typeof idx
  });
  // console.log(currWin);

  let currData = data[idx];
  if (currData !== undefined) {
    chrome.runtime.sendMessage({
      currData,
      urls: currData.urls
    });
    temp[currWin.id.toString()] = parseInt(idx);
    chrome.storage.local.set({ temp: temp })
      .then(() => {
        chrome.runtime.sendMessage({
          tempChanged: temp
        });
      });

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

function modeChangeUI(modeName) {
  if (modeName === "open") {
    mode = "open";
    console.log(mode);

    document.body.classList.remove("edit");
    document.body.classList.remove("delete");
    document.body.classList.add("open");

    document.querySelector("nav.open").style.display = "";
    document.querySelector("nav.delete").style.display = "none";
    // document.querySelector("nav.edit").style.display = "none";

    document.getElementById("btn").classList.add("open");
    document.getElementById("btn").classList.remove("delete");
    document.querySelector("#btn span").textContent = "Add Current Window";

    document.querySelector("#btn img").src = "../../assets/icons/iconmonstr-plus-2.svg";
  } else if (modeName === "delete") {
    mode = "delete";
    console.log(mode);

    document.body.classList.remove("open");
    document.body.classList.remove("edit");
    document.body.classList.add("delete");

    document.querySelector("nav.open").style.display = "none";
    document.querySelector("nav.delete").style.display = "";

    document.getElementById("btn").classList.remove("open");
    document.getElementById("btn").classList.add("delete");
    document.getElementById("btn").classList.add("disabled");
    document.querySelector("#btn span").textContent = "Remove";
    document.querySelector("#btn img").src = "../../assets/icons/iconmonstr-x-mark-9.svg";

    Array.from(document.querySelectorAll(".item.selected")).forEach(item => {
      item.classList.remove("selected");
    });

    document.getElementById("count").textContent = "0";
    toDelete = [];
  }
}

function updateTemp() {
  chrome.windows.getAll((windows) => {
    let openWinIds = windows.map(window => window.id);
    console.log(openWinIds);
    Object.keys(temp).forEach(winId => {
      if (!openWinIds.includes(winId)) {
        delete temp[winId];
      }
    })
  });
}

// update item
// function updateItem(idx) {
//   // set db
//   data[idx] = generateData();
//   // change ui
//   let elem = document.querySelector(`[data-idx='${idx}']`);
// }

async function generateData(tabs) {
  let curTabs = await chrome.tabs.query({ currentWindow: true });
  console.log(curTabs);
  // time.setHours(time.getHours() + 9);
  return {
    tags: [],
    path: [],
    lastOpen: new Date().toISOString(),
    lastUpdate: new Date().toISOString(),
    urls: curTabs.map(tab => tab.url),
    titles: curTabs.map(tab => tab.title)
  };
}

// function getData(idx) {
//   let currData;
//   for (let i = 0; i < data.length; i++) {
//     if (data[i].idx === idx) {
//       currData = data[i];
//       break;
//     }
//   }
//   return currData;
// }

// function setData(obj) {
//   let id = obj.id;
//   let currData;
//   for (let i = 0; i < data.length; i++) {
//     if (data[i].idx === idx) {

//       break;
//     }
//   }
// }