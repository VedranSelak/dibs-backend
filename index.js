const app = require("./app");
const ip = require("ip");

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening one port 3000");
  console.log("With IP: ", ip.address());
});
