var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://pokemon_db:cis510_pokemon@ds111529.mlab.com:11529/teaching', ['courses', 'students']);

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
    ksiID: student.ksiID,
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email,
    email2: student.email2,
    phone: student.phone,
    active: student.active,
  };
  if (!(student.firstName && student.lastName)) {
    res.status(400);
    res.json({
      "error": "Bad data"
    });
  } else {
    db.students.save(_student, function (err, student) {
      if (err) {
        res.send(err);
      }
      res.json(student);
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
  var _student = {
    ksiID: student.ksiID,
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email,
    email2: student.email2,
    phone: student.phone,
    active: student.active,
  };
  if (student && student.firstName && student.lastName) {
    db.students.update({
      _id: mongojs.ObjectId(student._id)
    }, _student, {}, function (err, student) {
      if (err) {
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
