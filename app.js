const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const workshops = await Workshop.find();
  res.render("home", { workshops });
});
app.post("/delete-workshop/:id", async (req, res) => {
  await Workshop.findByIdAndDelete(req.params.id);
  res.redirect("/");
});
app.get("/edit-workshop/:id", async (req, res) => {
  const w = await Workshop.findById(req.params.id);

  res.send(`
    <h2>Edit Workshop</h2>

    <form action="/edit-workshop/${w._id}" method="POST">
      <input name="name" value="${w.name}" /><br><br>
      <input name="date" value="${w.date}" /><br><br>
      <input name="description" value="${w.description}" /><br><br>
      <button>Update</button>
    </form>
  `);
});
app.post("/edit-workshop/:id", async (req, res) => {
  await Workshop.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/");
});

app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/views/about.html');
});
// Request Demo Page
app.get('/request-demo', (req, res) => {
  res.sendFile(__dirname + '/views/request-demo.html');
});

// Form submit hone ke baad redirect
app.post('/demo-submit', async (req, res) => {

  const newDemo = new Demo({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    city: req.body.city,
    course: req.body.course,
    college: req.body.college,
    experience: req.body.experience,
    message: req.body.message
  });

  await newDemo.save();

  res.redirect('/demo-success');

});
// Success page
app.get('/demo-success', (req, res) => {
  res.sendFile(__dirname + '/views/demo-success.html');
});
// Registration page
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/views/registration.html');
});
// Registration success page
app.get('/register-success', (req, res) => {
  res.sendFile(__dirname + '/views/register-success.html');
});
// Live Workshops page
app.get('/live-workshops', (req, res) => {
  res.sendFile(__dirname + '/views/live-workshops.html');
});
// industry-experts 
app.get('/industry-experts', (req, res) => {
  res.sendFile(__dirname + '/views/industry-experts.html');
});
// certificates
app.get('/certificates', (req, res) => {
  res.sendFile(__dirname + '/views/certificates.html');
});
// career-support
app.get('/career-support', (req, res) => {
  res.sendFile(__dirname + '/views/career-support.html');
});
// education
app.get('/education.html', (req, res) => {
  res.sendFile(__dirname + '/views/education.html');
});
//equipment
app.get('/equipment.html', (req, res) => {
  res.sendFile(__dirname + '/views/equipment.html');
});
//fitness
app.get('/fitness.html', (req, res) => {
  res.sendFile(__dirname + '/views/fitness.html');
});
//lms
app.get('/lms.html', (req, res) => {
  res.sendFile(__dirname + '/views/lms.html');
});
//certification-system
app.get('/certification-system.html', (req, res) => {
  res.sendFile(__dirname + '/views/certification-system.html');
});
//live-workshop-system
app.get('/live-workshop-system.html', (req, res) => {
  res.sendFile(__dirname + '/views/live-workshop-system.html');
});


// 🔗 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.log("MongoDB Error:", err));


// 📦 Schema Define
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  course: String
});

// 📦 Model
const User = mongoose.model("User", userSchema);
const demoSchema = new mongoose.Schema({
  
  name: String,
  email: String,
  phone: String,
  city: String,
  course: [String],
  college: String,
  experience: String,
  message: String
});
const workshopSchema = new mongoose.Schema({
  name: String,
  date: String,
  description: String
});

const Workshop = mongoose.model("Workshop", workshopSchema);
const Demo = mongoose.model("Demo", demoSchema);
// 📝 Registration Route
app.post("/register", async (req, res) => {

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    course: req.body.course
  });

  await newUser.save();

  res.redirect("/register-success");
});
app.get("/admin-login", (req,res)=>{
res.sendFile(__dirname + "/views/admin-login.html");
});

app.post("/admin-login", (req,res)=>{

const {username,password} = req.body;
if (
  username === process.env.ADMIN_USERNAME &&
  password === process.env.ADMIN_PASSWORD
) {
  res.redirect("/admin");
} else {
  res.send("Invalid Admin Login");
}


});
// Admin route
app.get("/admin", async (req, res) => {
  const users = await User.find();
  const workshops = await Workshop.find();

  let html = `
  <html>
  <head><title>Admin Panel</title></head>
  <body>
    <h1>Users / Registrations</h1>

    <table border="1">
      <tr>
        <th>Name</th><th>Email</th><th>Phone</th><th>Workshop</th><th>Action</th>
      </tr>
  `;

  users.forEach(user => {
    html += `
      <tr>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${Array.isArray(user.course) ? user.course.join(", ") : user.course}</td>
        <td>
          <form action="/delete/${user._id}" method="POST">
            <button>Delete</button>
          </form>
        </td>
      </tr>
    `;
  });

  html += `</table><br><br>`;

  html += `
    <h1>Workshops</h1>
    <table border="1">
      <tr>
        <th>Name</th><th>Date</th><th>Description</th><th>Action</th>
      </tr>
  `;

  workshops.forEach(w => {
    html += `
      <tr>
        <td>${w.name}</td>
        <td>${w.date}</td>
        <td>${w.description}</td>
        <td>
          <form action="/delete-workshop/${w._id}" method="POST">
            <button style="background:red;">Delete</button>
          </form>
          <a href="/edit-workshop/${w._id}">
            <button>Edit</button>
          </a>
        </td>
      </tr>
    `;
  });

  html += `</table>
    <a href="/add-workshop">+ Add New Workshop</a>
  </body></html>
  `;

  res.send(html);

});

app.get("/add-workshop", (req, res) => {
  res.send(`
    <h2>Add New Workshop</h2>

    <form action="/add-workshop" method="POST">

      <input type="text" name="name" placeholder="Workshop Name" required><br><br>

      <input type="text" name="date" placeholder="Date" required><br><br>

      <input type="text" name="description" placeholder="Description" required><br><br>

      <button type="submit">Add Workshop</button>

    </form>

    <br><a href="/admin">⬅ Back</a>
  `);
});
app.post("/add-workshop", async (req, res) => {

  const newWorkshop = new Workshop({
    name: req.body.name,
    date: req.body.date,
    description: req.body.description
  });

  await newWorkshop.save();

  res.redirect("/");   // 👈 home pe dikhega
});
app.post("/delete/:id", async (req,res)=>{

await User.findByIdAndDelete(req.params.id);

res.redirect("/admin");

});
// request demo
app.get("/admin-demo", async (req,res)=>{

const demos = await Demo.find();

let html = `
<html>
<head>
<title>Demo Requests</title>

<style>

body{
font-family:Arial;
background:#f4f6fb;
padding:40px;
}

h1{
text-align:center;
}

table{
width:100%;
border-collapse:collapse;
background:white;
}

th,td{
padding:12px;
border:1px solid #ddd;
text-align:center;
}

th{
background:#4a6cf7;
color:white;
}

button{
padding:6px 12px;
background:red;
color:white;
border:none;
cursor:pointer;
}

</style>

</head>

<body>

<h1>Demo Requests</h1>


<table>

<tr>
<th>Name</th>
<th>Email</th>
<th>Phone</th>
<th>City</th>
<th>Course</th>
<th>Experience</th>
<th>Action</th>
</tr>
`;

demos.forEach(demo => {

html += `
<tr>

<td>${demo.name}</td>
<td>${demo.email}</td>
<td>${demo.phone}</td>
<td>${demo.city}</td>
<td>${demo.course}</td>
<td>${demo.experience}</td>

<td>
<form action="/delete-demo/${demo._id}" method="POST">
<button>Delete</button>
</form>
</td>

</tr>
`;

});

html += `
</table>

<div style="text-align:center; margin-top:20px;">
  <a href="/admin" style="
    padding:10px 15px;
    background:#4a6cf7;
    color:white;
    text-decoration:none;
    border-radius:5px;
  ">
    ← Back to Registrations
  </a>
</div>

</body>
</html>
`;

res.send(html);

});
app.post("/delete-demo/:id", async (req,res)=>{

await Demo.findByIdAndDelete(req.params.id);

res.redirect("/admin-demo");

});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

