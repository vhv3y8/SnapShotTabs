import {
  openWindow
} from "./data.js";
import {
  mode,
  toDelete
} from "./popup.js";

function createItemElement(nameString, tabCount, timeString, urls, titles, idx) {
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
  if (tabCount >= 2) {
    let itemMoreSpan = document.createElement("span");
    itemMoreSpan.classList.add("more");
    itemMoreSpan.textContent = `and ${tabCount - 1} more`;
    itemName.appendChild(itemMoreSpan);
  } else {
    itemName.querySelector(".title").style.maxWidth = "100%";
  }

  let itemTime = document.createElement("div");
  itemTime.classList.add("itemTime");
  let timeImg = document.createElement("img");
  timeImg.setAttribute("src", "../../assets/icons/iconmonstr-synchronization-15.svg");
  let timeSpan = document.createElement("span");
  timeSpan.setAttribute("title", moment(timeString));
  timeSpan.textContent = moment(timeString).fromNow();
  itemTime.appendChild(timeImg);
  itemTime.appendChild(timeSpan);

  itemBody.appendChild(itemName);
  itemBody.appendChild(itemTime);
  itemBody.addEventListener("click", (e) => {
    if (mode === "open" && !elem.classList.contains("current")) {
      openWindow(idx);
      
      document.querySelector(".current").classList.remove("current");
      document.querySelector(`[data-idx="${idx}"]`).classList.add("current");
      btn.classList.add("update");
      btn.querySelector("img").src = "../../assets/icons/iconmonstr-synchronization-3.svg";
      btn.querySelector("span").textContent = "Update";

      elem.scrollIntoView({ behavior: "smooth" });

    } else if (mode === "delete") {
      console.log("mode is delete.");
      if (elem.classList.contains("selected")) {
        elem.classList.remove("selected");
        toDelete = toDelete.filter(ind => ind !== idx);
        // if (toDelete.indexOf(idx) > -1) {
        //   toDelete.slice(toDelete.indexOf(idx), 1);
        // }
        // toDelete = [];
        console.log({
          toDelete,
          typeOfToDelte: typeof toDelete,
          idx
        });
        document.getElementById("count").innerText = toDelete.length.toString();
        if (toDelete.length.toString() === 0) {
          document.getElementById("btn").classList.add("disabled");
        }
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
    if (tabContainer.classList.contains("expand")) {
      arrow.setAttribute("src", "../../assets/icons/iconmonstr-arrow-66.svg");
      showTabSpan.textContent = "hide tabs";
    } else {
      arrow.setAttribute("src", "../../assets/icons/iconmonstr-arrow-65.svg");
      showTabSpan.textContent = "show tabs";
    }
  });

  tabDiv.appendChild(tabContainer);

  elem.appendChild(itemBody);
  elem.appendChild(tabDiv);

  return elem;
}

//////////////////////////////

function modeChangeUI(modeName) {
  let btn = document.getElementById("btn");

  if (modeName === "open") {
    document.body.classList.remove("edit");
    document.body.classList.remove("delete");
    document.body.classList.add("open");

    document.querySelector("nav.open").style.display = "";
    document.querySelector("nav.delete").style.display = "none";

    btn.classList.add("open");
    btn.classList.remove("delete");
    if (btn.classList.contains("update")) {
      btn.querySelector("img").src = "../../assets/icons/iconmonstr-synchronization-3.svg";
      btn.querySelector("span").textContent = "Update";
    } else {
      btn.querySelector("img").src = "../../assets/icons/iconmonstr-plus-2.svg";
      btn.querySelector("span").textContent = "Add Current Window";
    }


  } else if (modeName === "delete") {
    document.body.classList.remove("open");
    document.body.classList.remove("edit");
    document.body.classList.add("delete");

    document.querySelector("nav.open").style.display = "none";
    document.querySelector("nav.delete").style.display = "";



    Array.from(document.querySelectorAll(".item.selected")).forEach(item => {
      item.classList.remove("selected");
    });

    document.getElementById("count").textContent = "0";
  }
}

function renderList(sortOptions) {
  // 기본값 { key: "lastUpdated", reverse: false }
//  if (sortBy ===)
}

async function appendToList(newSnap, idx, isNew) {
  let list = document.getElementById("list");
  let elem = createItemElement(newSnap.titles[0], newSnap.urls.length, newSnap.lastUpdated, newSnap.urls, newSnap.titles, idx);

  if (isNew) {
    elem.classList.add("blinkGreen");
  } else { // isUpdate
    document.querySelector(`[data-idx='${idx}']`).remove();
    elem.classList.add("blinkSkyBlue");
    elem.classList.add("current");
  }

  list.insertBefore(elem, list.firstChild);
  elem.scrollIntoView({ behavior: "smooth", block: "center" });

  setTimeout(() => {
    elem.classList.remove("blinkSkyBlue");
    elem.classList.remove("blinkGreen");
    console.log("blink removed");
  }, 2000);
}



function setBtnTo(what) {
  if (what === "add") {
    btn.classList.add("add");
    btn.classList.remove("update");
    btn.classList.remove("delete");
    btn.classList.remove("disabled");
    
    btn.querySelector("img").src = "../../assets/icons/iconmonstr-plus-2.svg";
    btn.querySelector("span").textContent = "Add Current Window";
  } else if (what === "update") {
      btn.classList.remove("add");
    btn.classList.add("update");
    btn.classList.remove("delete");
    btn.classList.remove("disabled");
    
    btn.querySelector("img").src = "../../assets/icons/iconmonstr-synchronization-3.svg";
    btn.querySelector("span").textContent = "Update";
  } else if (what === "delete") {
    btn.classList.remove("add");
    btn.classList.remove("update");
    btn.classList.add("delete");
    btn.classList.add("disabled");
    
    document.querySelector("#btn span").textContent = "Remove";
    document.querySelector("#btn img").src = "../../assets/icons/iconmonstr-x-mark-9.svg";
  }
}

export {
  createItemElement,
  modeChangeUI,
  appendToList,
  setBtnTo
};