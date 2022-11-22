const express = require("express");
const DBCon = require("./utilities/db")
const bcrypt = require("bcrypt")
const otpGenerator = require("./utilities/otpGenerator")
const User = require("./models/user")
const mail = require("./utilities/mailer")
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const sesh = require('./utilities/sessions')


const app = express();

app.use(express.urlencoded({ extended: true })); // to access form data when Posting
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs"); // for the use of .ejs

app.use(
    sessions({
        secret: "justinesakalam4yobmot",
        saveUninitialized: true,
        cookie: { maxAge: 300000 },
        resave: false,
    })
);

app.use(cookieParser());

const port = 3000 || process.env.PORT

// Connect DB
DBCon();

// Index Page
app.get('/', (req, res) => {
    if (req.session.userid) {
        User.findOne({ username: req.session.userid }, (err, found) => {
            if (found.verified === false) res.redirect("otpvalidation");
            else res.render("index");
        });
    } else {
        res.redirect("/login");
    }
})

// Validate OTP page
app.route('/otpvalidation')
    .get((req,res)=>{
        if(req.session.userid) res.render('validateotp')
        else res.redirect('/')
    })
    .post((req,res)=>{

        const body = req.body

        User.findOne({OTP: body.otp}, (err, user)=>{
            if(err) console.log(err)
            if(user) {
                User.updateOne({OTP: body.otp}, {$set: {verified: true}}, err =>{
                  if(err) console.log(err)
                })
                res.redirect('/')
            }
            else{
                console.log('Invalid OTP')
            }
        })
    })

// Login and Sign-up
app.route('/login')
    .get((req,res)=>{
        req.session.userid ? res.redirect("/") : res.render("SignInSignUp");
    })
    .post(async (req,res)=>{
        const body = req.body

        User.findOne({username: body.username}, async (err, user)=>{
            if (err) console.log(err)
            if (user) {
                // Check if user input match DB data
              let validPass = await bcrypt.compare(body.password, user.password)

                //Check if valid and verified
                if(validPass && user.verified === true){
                    sesh.session(req)
                    res.redirect('/')
                }
                if(validPass && user.verified === false){
                    sesh.session(req)
                    res.redirect('/otpvalidation')
                }
                if(!validPass) {
                    console.log('Invalid Credentials')
                }
            }
            else{
                console.log("Account does not exist!, try Signing up!")
            }
        })
    })

app.post('/signup', (req,res)=> {
    const body = req.body

    // Check if email or username already taken
    User.findOne({email: body.email}, async (err, found) => {
        if (found) {
            found.username === body.username
                ? console.log("Username already taken")
                : console.log("Email already taken");
        } else {

            let otpGenerated = otpGenerator.otp()

            const user = new User({
                username: body.username,
                password: await bcrypt.hash(body.cpassword, 10),
                email: body.email,
                OTP: otpGenerated,
                verified: false,
            });

            let sendMail = {
                TO: req.body.email,
                OTP: otpGenerated,
            };

            user.save((err) => {
                if (err) console.log(err);
                else {
                    console.log("User Added!");
                    mail.sendEmail(sendMail);
                    sendMail.TO = "";
                    sendMail.OTP = "";
                }
            })
            res.redirect("/login");
        }
    })
})

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});


app.listen(port, (err) => {
    if (err) console.log(err);
    else console.log(`You are listening on ${port} at http://localhost:${port}`);
});
