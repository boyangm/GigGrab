var db = require("../models");
var jwt = require('jsonwebtoken');

module.exports = function (app) {
    const checktoken = (req, res, next) => {
        const { token } = req.cookies;
        if (token) {
            next();
        } else {
            res.redirect('/login');
        }
    }
    app.get("/login", function (req, res) {
        res.render("login", {});
    });

    // Sign up page 
    app.get("/signup", function (req, res) {
        res.render("signup", {});
    })


    // app.use(cookieParser())
    app.get('/', checktoken, function (req, res) {
        res.redirect('/home');
    })
    // Load main content page
    app.get("/home", checktoken, function (req, res) {
        const { token } = req.cookies;
        var decoded = jwt.verify(token, 'grabbygig');
        console.log(decoded.email);
        db.User.findOne({ where: { email: decoded.email } }).then(user =>{
            
            console.log(user);
            db.Gigs.findAll({order:[['createdAt', 'DESC']]}).then(function (gigs) {
                let posts = {gigs, user}
                res.render("home", posts);
            });
        })

    });
    app.get("/activity", checktoken, function (req, res) {
        const { token } = req.cookies;
        var decoded = jwt.verify(token, 'grabbygig');
        console.log(decoded.email);
        db.User.findOne({ where: { email: decoded.email } }).then(user =>{
            
            console.log(user);
            db.Event.findAll({order:[['createdAt', 'DESC']]}).then(function (events) {
                let posts = {events, user}
                res.render("activity", posts);
            });
        })

    });
    // app.get("/yourgigs", checktoken, function (req, res) {
    //     const { token } = req.cookies;
    //     var decoded = jwt.verify(token, 'grabbygig');

    //     console.log(decoded.email);
    //         db.User.findOne({where:{email:decoded.email}}).then( user =>{
    //             db.Gigs.findAll({where:{UserId: user.get('id')}}).then( async gigs =>{
    //                 return await Promise.all(gigs.map(gig =>{
    //                     db.Event.findAll({where:{GigsId: gig.id,open: 1}})
    //                 }))
    //             }).then(data =>{
    //                 console.log(data);
    //                 res.json(data);
    //             })

    //         })

    // });
    app.get("/talentpool", checktoken, function (req, res) {
        const { token } = req.cookies;
        let looker;
        var decoded = jwt.verify(token, 'grabbygig');
        console.log(decoded.email);
        db.User.findOne({ where: { email: decoded.email } }).then(user =>{
            looker = user;
            console.log(user);
            db.User.findAll({}).then(function (talent) {
                let data = {looker, talent}
                res.render("talentpool", data);
            });
        })

    });
    // Load Profile Creation page
    app.get("/profile", function (req, res) {
        // console.log(req.cookies);
        res.render("profile", {});

    });

    app.get("/users/:name",checktoken, function (req, res) {
       const {name} = req.params;
       console.log(name)
       db.User.findOne({ where: { name } }).then(user =>{
           let post = {user};
           res.render("namepage", post);
       })

    });
    app.get("/edit/profile",checktoken, function (req, res) {
        const { token } = req.cookies;
        let looker;
        var decoded = jwt.verify(token, 'grabbygig');
        console.log(decoded.email);
        db.User.findOne({ where: { email: decoded.email } }).then(user =>{
           let post = {user};
           res.render("profile", post);
       })

    });
    app.get("/giftgig", checktoken, function (req, res) {

        res.render("giftgig", {});

    });

    // Login page

    // Load example page and pass in an example by id
    app.get("/example/:id", function (req, res) {
        db.Example.findOne({ where: { id: req.params.id } }).then(function (dbExample) {
            res.render("example", {
                example: dbExample
            });
        });
    });
    app.get("/logout", function (req, res) {
       res.clearCookie('token');
       res.status(204).end();

    });

    // Render 404 page for any unmatched routes
    app.get("*", function (req, res) {
        res.render("404");
    });


};