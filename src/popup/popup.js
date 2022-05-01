window.addEventListener("load", (e) => {
  chrome.storage.sync.get(["data"], function (result) {
    console.log(result.data);
    for (let idx = 0; idx < result.data.length; idx++) {
      document.getElementById("list").appendChild(createItemElement(createName(result.data[idx].urls), result.data[idx].time, idx));
    }
  });
});

document.getElementById("buttons").addEventListener("click", (e) => {
  chrome.storage.sync.get(["data"], function (result) {
    console.log(result);
    console.log(result.data);
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
  return elem;
}

function createName(urlArray) {
  if (urlArray.length == 1) {
    return `${urlArray[0].slice(0, 35)}`;
  } else {
    return `${urlArray[0].slice(0, 20)}... and ${urlArray.length - 1} more`;
  }
}
