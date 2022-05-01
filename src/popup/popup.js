function createItem(nameString, timeString) {
    let elem = document.createElement("div");
    elem.classList.add("item");
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

window.addEventListener("load", (e) => {
  document.getElementById("list").appendChild(createItem("hihi", "2022-05-01 15:07"));
  chrome.storage.local.get(['data'], function(result) {
    console.log('Value currently is ' + result);
  });
});

document.getElementById("buttons").addEventListener("click", (e) => {
  chrome.storage.sync.set({key: new Date().toString()}, function() {
    console.log('Value is set to ' + new Date().toString());
  });
})