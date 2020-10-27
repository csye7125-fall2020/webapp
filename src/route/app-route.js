module.exports = (app) => {
    const base_url = "/v1/";
    const userCtrl = require("../controller/UserCtrl");
    const watchCtrl = require("../controller/WatchCtrl");
    const {check}  = require('express-validator/check');

    const userValidations = [
        check("username").exists().isEmail(),
        check("firstName").exists().isAlpha(),
        check("lastName").exists().isAlpha(),
        check("password").exists()];

    const watchValidations = [
        check("zipcode").exists(),
        check("alerts").exists()];

    app.get('/', (req, res) => {res.json({"msg":"Hello World Helm"})});
    app.get(base_url + "user/self", userCtrl.getUserInfo);
    app.get(base_url + "user/:id", userCtrl.getUserInfoById);
    app.post(base_url + "user", userValidations, userCtrl.createUser);
    app.put(base_url + "user/self", userCtrl.updateUser);

    app.post(base_url + "watch", watchValidations, watchCtrl.addWatch);
    app.get(base_url + "watch/:id", watchCtrl.getWatch);
    app.delete(base_url + "watch/:id", watchCtrl.deleteWatch);
    app.put(base_url +"watch/:id", watchCtrl.updateWatch);
}
