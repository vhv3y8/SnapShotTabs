import { parseDate, createTitle } from "../background.js";

let data;
let lastIdx;
let temp;

window.addEventListener("load", async (e) => {
  chrome.storage.sync.get()
    .then((res) => {
      data = res.data;
      lastIdx = res.lastIdx;
      temp = res.temp;
      console.log("fetched all data from storage.");
      console.log({
        data,
        lastIdx,
        temp
      });

      Object.keys(res.data).forEach((idx) => {
        let korTime = new Date(data[idx].lastOpen);
        console.log({
          korTime,
          type: typeof korTime
        })
        korTime.setHours(korTime.getHours() + 9);
        document.getElementById("list").appendChild(createItemElement(createTitle(data[idx].tags[0], data[idx].tags.length), parseDate(korTime), idx));
      })
    });
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

// save item
document.getElementById("buttons").addEventListener("click", async (e) => {
  let curWin = await chrome.windows.getCurrent();
  let newData = await generateData();
  console.log(newData);
  let lastOpen = new Date(newData.lastOpen);
  let lastUpdate = new Date(newData.lastUpdate);
  lastOpen.setHours(lastOpen.getHours() + 9);
  lastUpdate.setHours(lastUpdate.getHours() + 9);
  console.log(newData);

  if (!Object.keys(temp).includes(curWin.id)) { // new save.
    data[++lastIdx] = newData;
    console.log({
      lastIdx,
      data
    });
    document.getElementById("list").appendChild(createItemElement(createTitle(newData.tags[0], newData.urls.length), parseDate(lastUpdate), lastIdx));
  }
  // else { // 팝업에서 클릭해서 열었음, update

  // }
  temp[curWin.id.toString()] = lastIdx;
  // alternative for ignorant about beforeunload
  chrome.storage.sync.set({
    data: data,
    lastIdx: lastIdx,
  }).then(() => {
    console.log("data, lastIdx, temp is saved.");
  });
  chrome.storage.sync.set({ temp: temp }).then(() => {
    console.log("temp is saved.");
    console.log(temp);
  });


  //   .then(() => {
  //     console.log("storage 'temp' is now set to :");
  //     console.log({ temp: temp });
  //   });
  // chrome.storage.sync.set({ data: data })
  //   .then(() => {
  //     console.log("storage 'data' is now set to :");
  //     console.log({ data: data });
  //   });

  chrome.runtime.sendMessage({ hey: "hihi" }).then(() => {
    console.log("sended!!")
  });
});

// update item
function updateItem(idx) {
  // set db
  data[idx] = generateData();
  // change ui
  let elem = document.querySelector(`[data-idx='${idx}']`);
}

async function generateData(tabs) {
  let curTabs = await chrome.tabs.query({ currentWindow: true });
  // time.setHours(time.getHours() + 9);
  return { tags: [curTabs[0].title], path: [], lastOpen: new Date().toISOString(), lastUpdate: new Date().toISOString(), urls: curTabs.map(tab => tab.url) };
}

function createItemElement(nameString, timeString, idx = -1) {
  console.log(`createItemElement : idx is ${idx}`);
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
    openWindow(idx);
  });
  return elem;
}

async function openWindow(idx) {
  let currWin = await chrome.windows.getCurrent({ populate: true });
  let tabs = currWin.tabs;
  chrome.runtime.sendMessage({
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