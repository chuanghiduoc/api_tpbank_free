const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { getDeviceId } = require("./utils.js");
const { handleLogin, getHistories } = require("./mainTpbank/main");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const deviceId = getDeviceId();
    if (deviceId) this.deviceId = deviceId;
    const login = await handleLogin(username, password, deviceId);
    return res.json({ accessToken: login.access_token });
  } catch (error) {
    res.json({error : error.data})
  }
});

app.post("/histories", async (req, res) => {
  try {
    const { accessToken } = req.body;
    // const accounts = (await getBankAccount(accessToken, this.deviceId)) || [];
    // const accountId = accounts[0].BBAN;
    // console.log(accountId);
    const accountId = "26032004888";
    const histories = await getHistories(accessToken, accountId, this.deviceId);
    return res.json({ info: histories });
  } catch (error) {
    res.json({ error: error.data });
  }
});

app.listen(3000, () => {
  console.log(`Example app listening on port ${3000}!`);
});
