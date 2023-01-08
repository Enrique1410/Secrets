const express = require("express");
const bodyp = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyp.urlencoded({ extended: true }));

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://0.0.0.0:27017/userDB");

const userSchema = {
    email: String,
    password: String
};

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.route("/login")

    .get((req, res) => {
        res.render("login");
    })

    .post((req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        User.findOne({ email: username }, (err, foundUser) => {
            if (!err) {
                if (foundUser) {
                    if (foundUser.password === password) {
                        res.render("secrets")
                    }
                }
            } else {
                console.log(err);
            }
        });
    });

app.route("/register")

    .get((req, res) => {
        res.render("register");
    })

    .post((req, res) => {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });

        newUser.save((err) => {
            if (!err) {
                res.render("secrets");
            } else {
                console.log(err);
            }
        });
    });

app.listen(3000, () => {
    console.log("Server started on port 3000.");
});