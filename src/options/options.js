// download
let downloadIcon = document.getElementById("downloadIcon");
// downloadIcon.addEventListener("click", async () => {

// });
window.addEventListener("load", async () => {
  let data = await chrome.storage.local.get();
  let manifest = await chrome.runtime.getManifest();
  console.log(data);
  let toDownload = {
    extensionVersion: manifest.version,
    data: data.data,
    lastIdx: data.lastIdx
  };
  let blob = new Blob([JSON.stringify(toDownload, null, 2)], { type: "application/json" });
  let url = URL.createObjectURL(blob);
  downloadIcon.href = url;
  downloadIcon.download = "snapshottabs-extension-data.json";
});


// get { data, lastIdx, extensionVersion } and send it to file

// upload
let uploadFile = document.getElementById("uploadFile");
document.getElementById("submit").addEventListener("click", (e) => {
  console.log("submit clicked.");
  let file = uploadFile.files[0];
  uploadFile.value = "";
  console.log(file);
  if (file.type === "application/json") {
    document.getElementById("uploadDiv").classList.add("done");
    setTimeout(() => {
      document.getElementById("uploadDiv").classList.remove("done");
    }, 1000);
    // https://stackoverflow.com/a/27116209/13692546
    reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      let obj = JSON.parse(e.target.result);
      console.log(obj);
      addUploadedData(obj);
    };
  }
});

let deleteBtn = document.getElementById("delete");
deleteBtn.addEventListener("click", async (e) => {
  if (confirm("Are you sure to Delete All Datas in the storage?")) {
    chrome.storage.local.set({ data: {}, temp: {}, lastIdx: 0 })
      .then(() => {
        alert("All Datas are deleted.");
      });
  }
});

async function addUploadedData(obj) {
  let data = await chrome.storage.local.get();
  Object.values(obj.data).forEach(item => {
    data.data[++data.lastIdx] = item;
  });
  console.log(data);
  chrome.storage.local.set(data);
}

// get file from input tag and add it to { data }.
// formatting by extension version if needed.

// delete