module.exports = (app) => {
    const base_url = "/v1/user";
    const userCtrl = require("../controller/UserCtrl");

    app.get('/', (req, res) => {res.json({"msg":"Hello World"})});
    app.get(base_url + "/self", userCtrl.getUserInfo);
    app.get(base_url + "/:id", userCtrl.getUserInfoById);
    app.post(base_url /*,userCtrl.validateUserData*/, userCtrl.createUser);
    app.put(base_url + "/self", userCtrl.updateUser);
}
