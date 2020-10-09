module.exports = (app) => {
    const base_url = "/v1/user";
    const userCtrl = require("../controller/UserCtrl");
    const {check}  = require('express-validator/check');

    const validations = [check("email").exists().isEmail(),
        check("firstName").exists().isAlpha(),
        check("lastName").exists().isAlpha(),
        check("password").exists()];



    app.get('/', (req, res) => {res.json({"msg":"Hello World"})});
    app.get(base_url + "/self", userCtrl.getUserInfo);
    app.get(base_url + "/:id", userCtrl.getUserInfoById);
    app.post(base_url, validations, userCtrl.createUser);
    app.put(base_url + "/self", userCtrl.updateUser);
}
