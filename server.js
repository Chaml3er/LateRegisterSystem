"use strict";

var express = require("express");
var path = require("path");
var https = require("https");
var bodyParser = require("body-parser");
var NAME = ""; 
var UNAME = ""; 
var fac = "";
var depart = "";
var StatusS = "";
var NAMEENG = "";
var PORT = process.env.PORT || 5000;
var app = express();
var https = require('https');
let stdData;
let sa=false;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("index", { });
});

app.listen(PORT, function () {
  console.log(`Listening on ${PORT}`);
});

app.get('/logout', async(req, res)=>{
  stdData=null;
  if(stdData=null){
    sa=false;
    res.render('index');
  }else{
    sa=false;
    res.render('index');
  }
  req.write(null);
  req.end();

});

app.get("/welcome/:id", async function(req, res){ 
  var nameid = req.params.id;
  console.log(nameid);
  const data = await getStudentInfo(nameid);
  console.log(data);
  if (data) {
    let j = JSON.parse(data);
    
    res.render("welcome", 
    {prefix: j.data.prefixname,
     name_th: j.data.displayname_th,
     name_en: j.data.displayname_en,
     username_id:j.data.username,
     email: j.data.email,
     faculty: j.data.faculty,
     department: j.data.department,
     tustatus: j.data.tu_status
     });
  }
});

app.get("/Fristpage", function (req, res) {
  res.render("Fristpage", {
    name_id:NAME,
    U_id:UNAME,
    fac_id:fac,
    depart_id:depart,
    stat_id:StatusS
  });
});

app.get("/U6", function (req, res) {
  res.render("U6", {
    name_id:NAME,
    U_id:NAMEENG,
    fac_id:fac,
    depart_id:depart,
    stat_id:StatusS
  });
});

app.get("/U4Teacher", function (req, res) {
  res.render("U4Teacher", {
    name_id:NAME,
    U_id:NAMEENG,
    fac_id:fac,
    depart_id:depart,
    stat_id:StatusS
  });
});

app.get("/Payment", function (req, res) {
  res.render("Payment", {
    name_id:NAME,
    U_id:UNAME,
    fac_id:fac,
    depart_id:depart,
    stat_id:StatusS
  });
});

app.get("/Upload", function (req, res) {
  res.render("Upload", {
    name_id:NAME,
    U_id:UNAME,
    fac_id:fac,
    depart_id:depart,
    stat_id:StatusS
  });
});

app.get("/Step", function (req, res) {
  res.render("Step", { 
    name_id:NAME,
    U_id:UNAME,
    fac_id:fac,
    depart_id:depart,
    stat_id:StatusS
  });

});

app.get("/welcome", function (req, res) {
  res.render("welcome",{
    name_id:NAME,
    U_id:UNAME,
    fac_id:fac,
    depart_id:depart,
    stat_id:StatusS
  });
  
});

app.get("/StatusA", function (req, res) {
  res.render("StatusA",{
    name_id:NAME,
    U_id:UNAME,
    fac_id:fac,
    depart_id:depart,
    stat_id:StatusS
  });
  
});

app.get("/welcomeTeacher", function (req, res) {
  res.render("welcomeTeacher",{
    name_id:NAME,
    U_id:NAMEENG,
    fac_id:fac,
    depart_id:depart,
    stat_id:StatusS
  });
  
});

app.get("/StudentPetition", function (req, res) {
  res.render("StudentPetition", { 
    name_id:NAME,
    U_id:UNAME,
    fac_id:fac,
    depart_id:depart,
  });
});

app.post("/api", async (req, res) => {
  console.log(req.body);
  const temp = await getlogin(req.body.user, req.body.pwd); 
  console.log("temp = " + temp);
  if (temp) {
    let j = JSON.parse(temp);
    console.log(j);
    if (j.type == "student" ) {
      NAME = j.displayname_th;
      UNAME = j.username;
      fac = j.faculty;
      depart = j.department;
      StatusS = j.tu_status;
      res.render("welcome",{
        name_id:j.displayname_th,
        U_id:j.username,
        fac_id:j.faculty,
        depart_id:j.department,
        stat_id:j.tu_status
      });
    }else if (j.type == "employee") {
       NAME = j.displayname_th;
       NAMEENG = j.displayname_en;
       depart = j.department;
       fac = j.organization;
       res.render("welcomeTeacher",{
        name_id:j.displayname_th,
        U_id:j.displayname_en,
        fac_id:j.organization,
        depart_id:j.department,
      });
    }
    else{
      let fails=JSON.parse(temp);   
      res.render('index', {
        errors: fails.message
      })
    }
  } else {
    res.send('{"status":false}');
    console.log("this"+temp);
    return false;
  }
  
});

const getlogin = (userName, password) => {
  return new Promise((resolve, reject) => {
    var options = {
      'method': 'POST',
      'hostname': 'restapi.tu.ac.th',
      'path': '/api/v1/auth/Ad/verify',
      'headers': {
        'Content-Type': 'application/json',
        'Application-Key': 'TU1f9b38b1a1f72c4934957b555ee02370bf936a95af6ee3e35179da1a2aea5f48dbb960b5c9e11efb02fcb8a92c7fb46a'
      }
    };

    var req = https.request(options, (res) => {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        resolve(body.toString());
      });

      res.on("error", function (error) {
        console.error(error);
        reject(error);
      });
    });
    var postData =  "{\n\t\"UserName\":\"" + userName + "\",\n\t\"PassWord\":\""+ password + "\"\n}";
    req.write(postData);
    req.end();
  });
  
};



const getStudentInfo = (username) => {
  return new Promise((resolve, reject) => {
    var options = {
      method: "GET",
      hostname: "restapi.tu.ac.th",
      path: "/api/v2/profile/std/info/?id=" + username,
      headers: {
        "Content-Type": "application/json",
        "Application-Key":
          "TU1f9b38b1a1f72c4934957b555ee02370bf936a95af6ee3e35179da1a2aea5f48dbb960b5c9e11efb02fcb8a92c7fb46a",
      },
    };

    var req = https.request(options, (res) => {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        //result = body;
        resolve(body.toString());
        //result = chunks;
      });

      res.on("error", function (error) {
        console.error(error);
        reject(error);
      });
    });

    req.end();
  });
  
};


