export function setLocalStorage(data, key = "data") {
  // Remove messages and set ConnectionStatus to false
  const newData = JSON.parse(JSON.stringify(data));
  let len = newData.App.Projects.length;
  for (let i = 0; i < len; i++) {
    newData.App.Projects[i].Messages = [];
    newData.App.Projects[i].Socket.ConnectionStatus = false;
    newData.App.Projects[i].Socket.Connection = null;
  }

  return new Promise(resolve => {
    localStorage.setItem(key, JSON.stringify(newData));
    resolve();
  });
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function getTime() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const now = new Date();
  const dateVal = `${("" + now.getDate()).padStart(2, "0")}-${
    months[now.getMonth()]
  }-${now.getFullYear()}`;
  const timeVal = `${("" + now.getHours()).padStart(2, "0")}:${(
    "" + now.getMinutes()
  ).padStart(2, "0")}:${("" + now.getSeconds()).padStart(2, "0")}`;

  return `${dateVal} ${timeVal}`;
}

export function copyToClipboard(messageId, message) {
  let range = document.createRange();
  let selection = document.getSelection();

  function onCopy(event) {
    event.stopPropagation();
    event.preventDefault();
    event.clipboardData.clearData();
    event.clipboardData.setData("text", message);
  }

  const copyLocation = document.getElementById(messageId);
  copyLocation.addEventListener("copy", onCopy);

  range.selectNode(copyLocation);
  selection.removeAllRanges();
  selection.addRange(range);

  try {
    document.execCommand("copy");
    // selection.removeAllRanges();
  } catch (error) {
    try {
      window.clipboardData.clearData();
      window.clipboardData.setData("text", message);
    } catch (err) {
      window.prompt("Copy from here", message);
    }
  } finally {
    if (selection) {
      selection.removeAllRanges();
    }
    copyLocation.removeEventListener("copy", onCopy);
  }
}
