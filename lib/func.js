const pad = (v) => {
  return v < 10 ? "0" + v : v;
};

const getDateString = (d) => {
  let year = d.getFullYear();
  let month = pad(d.getMonth() + 1);
  let day = pad(d.getDate());
  let hour = pad(d.getHours());
  let min = pad(d.getMinutes());
  let sec = pad(d.getSeconds());
  return year + month + day + hour + min + sec;
};

function _uuid() {
  var d = Date.now();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
    d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

module.export = {
  getDateString,
  _uuid
}