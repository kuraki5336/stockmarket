const pttCrawler = () => {
  request({
      url: "https://www.ptt.cc/bbs/Stock/index.html",
      method: "GET"
  }, (error, res, body) => {
      // 如果有錯誤訊息，或沒有 body(內容)，就 return
      if (error || !body) {
          return;
      }
  });
};

pttCrawler();