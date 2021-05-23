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
