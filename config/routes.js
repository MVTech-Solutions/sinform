module.exports = app => {
    app.get("/", (req, res) => {
      res.status(200).send({msg: "Aplicação executando"})
    })
    
    app.route("/user")
      //.get(app.api.user.get)
      .post(app.api.user.post)

    app.route("/user/:id")
      .all(app.config.passport.authenticate())
      //.get(app.api.user.getById)
      .patch(app.api.user.patch)
      .put(app.api.user.put)
      .delete(app.api.user.remove)

    app.route("/userEvent")
      .all(app.config.passport.authenticate())
      .get(app.api.userEvent.get)
      .post(app.api.userEvent.post)
      .put(app.api.userEvent.put)
      .delete(app.api.userEvent.remove)

    app.route("/userEvent/:id")
      .all(app.config.passport.authenticate())
      .get(app.api.userEvent.getByUserId)
    
    app.route("/forgotPassword")
      .post(app.api.redefinePassword.forgotPassword)

    app.route("/resetPassword/:token")
      .put(app.api.redefinePassword.resetPassword)

    app.route("/signin").post(app.api.userAuth.signIn)
    app.route("/validateToken").post(app.api.userAuth.validateToken)
      
}