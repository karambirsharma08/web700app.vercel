const Sequelize = require('sequelize');

// Configure Sequelize with PostgreSQL database
const sequelize = new Sequelize('neondb', 'neondb_owner', 'KJtChsd4Q0vz', {
    host: 'ep-green-bread-a57289eo.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
});


// Define the Student model
const Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING,
    course: Sequelize.INTEGER,
});

// Define the Course model
const Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING,
});

// Define relationships
Course.hasMany(Student, { foreignKey: 'course' });

// Function to initialize the database
function initialize() {
    return new Promise((resolve, reject) => {
        sequelize
            .sync()
            .then(() => resolve())
            .catch((err) => reject(`Unable to sync the database: ${err}`));
    });
}

// Function to get all students
function getAllStudents() {
    return new Promise((resolve, reject) => {
        Student.findAll()
            .then((data) => resolve(data))
            .catch(() => reject("No results returned"));
    });
}

// Function to get all Teaching Assistants (TAs)
function getTAs() {
    return new Promise((resolve, reject) => {
        Student.findAll({ where: { TA: true } })
            .then((data) => resolve(data))
            .catch(() => reject("No results returned"));
    });
}

// Function to get all courses
function getCourses() {
    return new Promise((resolve, reject) => {
        Course.findAll()
            .then((data) => resolve(data))
            .catch(() => reject("No results returned"));
    });
}

// Function to get students by course
function getStudentsByCourse(course) {
    return new Promise((resolve, reject) => {
        Student.findAll({ where: { course } })
            .then((data) => resolve(data))
            .catch(() => reject("No results returned"));
    });
}

// Function to get a student by student number
function getStudentByNum(num) {
    return new Promise((resolve, reject) => {
        Student.findOne({ where: { studentNum: num } })
            .then((data) => resolve(data))
            .catch(() => reject("No results returned"));
    });
}

// Function to add a new student
function addStudent(studentData) {
    return new Promise((resolve, reject) => {
        // Ensure TA is true/false and replace empty strings with null
        studentData.TA = studentData.TA ? true : false;
        for (const prop in studentData) {
            if (studentData[prop] === '') studentData[prop] = null;
        }

        Student.create(studentData)
            .then(() => resolve())
            .catch(() => reject("Unable to create student"));
    });
}

// Function to update a student
function updateStudent(studentData) {
    return new Promise((resolve, reject) => {
        // Ensure TA is true/false and replace empty strings with null
        studentData.TA = studentData.TA ? true : false;
        for (const prop in studentData) {
            if (studentData[prop] === '') studentData[prop] = null;
        }

        Student.update(studentData, { where: { studentNum: studentData.studentNum } })
            .then(() => resolve())
            .catch(() => reject("Unable to update student"));
    });
}

// Function to delete a student by student number
function deleteStudentByNum(studentNum) {
    return new Promise((resolve, reject) => {
        Student.destroy({ where: { studentNum } })
            .then(() => resolve())
            .catch(() => reject("Unable to delete student"));
    });
}

// Function to add a new course
function addCourse(courseData) {
    return new Promise((resolve, reject) => {
        for (const prop in courseData) {
            if (courseData[prop] === '') courseData[prop] = null;
        }

        Course.create(courseData)
            .then(() => resolve())
            .catch(() => reject("Unable to create course"));
    });
}

// Function to update a course
function updateCourse(courseData) {
    return new Promise((resolve, reject) => {
        for (const prop in courseData) {
            if (courseData[prop] === '') courseData[prop] = null;
        }

        Course.update(courseData, { where: { courseId: courseData.courseId } })
            .then(() => resolve())
            .catch(() => reject("Unable to update course"));
    });
}

// Function to delete a course by ID
function deleteCourseById(courseId) {
    return new Promise((resolve, reject) => {
        Course.destroy({ where: { courseId } })
            .then(() => resolve())
            .catch(() => reject("Unable to delete course"));
    });
}

// Function to get a course by ID
function getCourseById(id) {
    return new Promise((resolve, reject) => {
        Course.findOne({ where: { courseId: id } })
            .then((data) => resolve(data))
            .catch(() => reject("No results returned"));
    });
}

// Export the functions
module.exports = {
    initialize,
    getAllStudents,
    getTAs,
    getCourses,
    getStudentsByCourse,
    getStudentByNum,
    addStudent,
    updateStudent,
    deleteStudentByNum,
    addCourse,
    updateCourse,
    deleteCourseById,
    getCourseById,
};
