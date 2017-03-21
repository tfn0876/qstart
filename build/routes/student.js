var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://pokemon_db:cis510_pokemon@ds111529.mlab.com:11529/teaching', ['courses','students']);

// get all students

router.get('/students', function (req, res, next) {

    db.students.find(function (err, students) {
        if (err) {
            res.send(err);
        }

        res.json(students);
    });
});

// get single student session 
router.get('/student/:id', function (req, res, next) {
    db.students.findOne({
        _id: mongojs.ObjectId(req.params.id)
    }, function (err, student) {
        if (err) {
            res.status = 400;
            res.send(err);
        }
        res.json(student);
    });
});

// save student
router.post('/student', function (req, res, next) {
    var student = req.body;
   
     var _student = {
        firstName: student.firstname,
        lastName: student.lastname,
        email: student.email,
        active:student.active,
        registered:student.registered,
        phone:student.phone
    };
    if (student.firstname && student.lastname && student.email && student.isactive && student.phone) {
       
        db.students.save(_student, function (err, student) {
            if (err) {
                res.send(err);
            }
            res.json(student);
        });
    } else {
    	 res.status(400);
        res.json({
            "error": "Bad data"
        });
        
    }
});


// delete student by id
router.delete('/student/:id', function (req, res, next) {

    db.students.remove({
        _id: mongojs.ObjectId(req.params.id)
    }, function (err, student) {
        if (err) {
            res.send(err);
        }
        res.json(student);
    });
});


// update student
router.put('/student', function (req, res, next) {
    var student = req.body;
    console.log('Update Student -'+JSON.stringify(student));
   if (student.firstName && student.lastName && student.email && student.active && student.phone && student.registered) {
   	console.log('Student ID '+ mongojs.ObjectId(student._id));
        var _student = {
            _id : mongojs.ObjectId(student._id),
            firstName : student.firstname,
            lastName : student.lastname,
            email : student.email,
            phone : student.phone,
            active : student.active,
            registered:student.registered
        };
        db.students.update({
            _id: mongojs.ObjectId(student._id)
        }, _student, {}, function (err, student) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            res.json(student);
        });
    } else {
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    }
});



module.exports = router;