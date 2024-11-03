/*********************************************************************************
*  WEB700 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Karambir Sharma
*  Student ID: 167923234
*  Date: 12 Oct 2024
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
const path = require("path");
const collegeData = require("./modules/collegeData");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));



// Route for home.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

// Route for about.html
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});



// Route for htmlDemo.html
app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
});

// Route for add student
app.get("/students/add", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/addStudent.html"));
});

// data from student form to collegedata.js
app.post("/students/add", (req, res) => {
    console.log("Form data received:", req.body); // Log form data to the console

    // Define studentData based on req.body
    const studentData = {
        firstName: req.body.firstName || "",
        lastName: req.body.lastName || "",
        email: req.body.email || "",
        addressStreet: req.body.addressStreet || "",
        addressCity: req.body.addressCity || "",
        addressProvince: req.body.addressProvince || "",
        TA: req.body.TA ? true : false, // Handle checkbox
        status: req.body.status || "Full Time",
        course: req.body.course || "1"
    };

    console.log("Processed student data:", studentData); // Log processed data for verification

    // Add the student using the processed data
    collegeData.addStudent(studentData)
        .then(() => {
            console.log("Student added successfully");
            res.redirect("/students");
        })
        .catch((err) => {
            console.error("Error adding student:", err);
            res.status(500).send("Error adding student: " + err);
        });
});

// Route to get all students or students by course
app.get("/students", (req, res) => {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course)
            .then((students) => {
                res.json(students);
            })
            .catch((err) => {
                res.json({ message: "no results" });
            });
    } else {
        collegeData.getAllStudents()
            .then((students) => {
                res.json(students);
            })
            .catch((err) => {
                res.json({ message: "no results" });
            });
    }
});

// Route to get all TAs
app.get("/tas", (req, res) => {
    collegeData.getTAs()
        .then((TAs) => {
            res.json(TAs);
        })
        .catch((err) => {
            res.json({ message: "no results" });
        });
});

// Route to get all courses
app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then((courses) => {
            res.json(courses);
        })
        .catch((err) => {
            res.json({ message: "no results" });
        });
});

// Route to get a student by their student number
app.get("/student/:num", (req, res) => {
    collegeData.getStudentByNum(req.params.num)
        .then((student) => {
            res.json(student);
        })
        .catch((err) => {
            res.json({ message: "no results" });
        });
});

// Handle 404s (No matching route)
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// Initialize data and start the server
collegeData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log("Server listening on port: " + HTTP_PORT);
        });
    })
    .catch((err) => {
        console.log("Failed to initialize data: " + err);
    });
