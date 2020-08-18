// testing
const { msStore } = require("../index.js");
const store = new msStore();
store.search("flight simulator", "pc", 1).then((res1) => {
  store.get(res1[0].url, true).then((res) => {
    console.log(res);
    console.table(res.system_requirements.recommended);
  });
});
