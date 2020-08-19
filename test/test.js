// testing
const { msStore } = require("../index.js");
const store = new msStore();
store.search("nfs", "xbox", 1).then((res1) => {
  store.get(res1[0].url, true).then((res) => {
    console.log(res);
    console.table(res.system_requirements.recommended);
    console.table(res.system_requirements.minimum)
  });
});
