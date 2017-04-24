var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://pokemon_db:cis510_pokemon@ds111529.mlab.com:11529/teaching', ['courses', 'courseSessions', 'students', 'studentSessions', 'users', 'semesters']);
//var db = mongojs('mongodb://hardikparikh1988:123456798@ds117889.mlab.com:17889/testdbhardik', ['courses']);

// get all courses
router.get('/courses', function (req, res, next) {
  db.courses.find(function (err, courses) {
    if (err) {
      res.send(err);
    }
    res.json(courses);
  });
});

// get single course
router.get('/course/:id', function (req, res, next) {
  db.courses.findOne({
    _id: mongojs.ObjectId(req.params.id)
  }, function (err, course) {
    if (err) {
      res.send(err);
    }
    res.json(course);
  });
});

// save course
router.post('/course', function (req, res, next) {
  var course = req.body;
  var _course = {
    code: course.code,
    title: course.title,
    pre: course.pre,
    description: course.description
  };
  if (!(course.code && course.title)) {
    res.status(400);
    res.json({
      "error": "Bad data"
    });
  } else {
    db.courses.save(_course, function (err, course) {
      if (err) {
        res.send(err);
      }
      res.json(course);
    });
  }
});

// delete single course
router.delete('/course/:id', function (req, res, next) {
  db.courses.remove({
    _id: mongojs.ObjectId(req.params.id)
  }, function (err, course) {
    if (err) {
      res.send(err);
    }
    res.json(course);
  });
});

// update course
router.put('/course', function (req, res, next) {
  var course = req.body;
  var _course = {
    code: course.code,
    title: course.title,
    pre: course.pre,
    description: course.description
  };
  if (course && course.title && course.code) {
    db.courses.update({
      _id: mongojs.ObjectId(course._id)
    }, _course, {}, function (err, course) {
      if (err) {
        res.send(err);
      }
      res.json(course);
    });
  } else {
    res.status(400);
    res.json({
      "error": "Bad Data"
    });
  }
});

// get all course sessions by course id
router.get('/sessions/:id', function (req, res, next) {
  db.courseSessions.find({
    course_id: mongojs.ObjectId(req.params.id)
  }, function (err, courseSessoins) {
    if (err) {
      res.status = 400;
      res.send(err);
    }
    res.json(courseSessoins);
  });
});

// get single course session 
router.get('/session/:id', function (req, res, next) {
  db.courseSessions.findOne({
    _id: mongojs.ObjectId(req.params.id)
  }, function (err, courseSession) {
    if (err) {
      res.status = 400;
      res.send(err);
    }
    res.json(courseSession);
  });
});

// save course session
router.post('/session', function (req, res, next) {
  var courseSession = req.body;
  if (!(courseSession.name && courseSession.professor && courseSession.course_id)) {
    res.status(400);
    res.json({
      "error": "No name or professor has been entered"
    });
  } else {
    var _courseSessoin = {
      course_id: mongojs.ObjectId(courseSession.course_id),
      semester_id: mongojs.ObjectId(courseSession.semester_id),
      name: courseSession.name,
      professor: courseSession.professor,
      startDate: courseSession.startDate,
      endDate: courseSession.endDate,
      daysOftheWeek: courseSession.daysOftheWeek,
      files: courseSession.files,
    };
    db.courseSessions.save(_courseSessoin, function (err, courseSession) {
      if (err) {
        res.send(err);
      }
      res.json(courseSession);
    });
  }
});

// delete single course session
router.delete('/session/:id', function (req, res, next) {
  db.courseSessions.remove({
    _id: mongojs.ObjectId(req.params.id)
  }, function (err, courseSession) {
    if (err) {
      res.send(err);
    }
    res.json(courseSession);
  });
});

// update course
router.put('/session', function (req, res, next) {
  var courseSession = req.body;
  if (courseSession && courseSession.name && courseSession.professor) {
    var _courseSessoin = {
      course_id: mongojs.ObjectId(courseSession.course_id),
      semester_id: mongojs.ObjectId(courseSession.semester_id),
      name: courseSession.name,
      professor: courseSession.professor,
      startDate: courseSession.startDate,
      endDate: courseSession.endDate,
      daysOftheWeek: courseSession.daysOftheWeek,
      attendanceTemplate: courseSession.attendanceTemplate,
      gradeItems: courseSession.gradeItems,
      gradeRules: courseSession.gradeRules,
      files: courseSession.files,
    };
    db.courseSessions.update({
      _id: mongojs.ObjectId(courseSession._id)
    }, _courseSessoin, {}, function (err, courseSession) {
      if (err) {
        res.send(err);
      }
      res.json(courseSession);
    });
  } else {
    res.status(400);
    res.json({
      "error": "Bad Data"
    });
  }
});

// get all student sessions by courseSession id
router.get('/student-sessions/:id', function (req, res, next) {
  db.studentSessions.find({
    courseSession_id: mongojs.ObjectId(req.params.id)
  }, function (err, studentSessions) {
    if (err) {
      res.status = 400;
      res.send(err);
    }
    res.json(studentSessions);
  });
});

// get all courseSessions by student id
router.get('/student-course-sessions/:id', function (req, res, next) {
  db.studentSessions.find({
    student_id: mongojs.ObjectId(req.params.id)
  }, function (err, studentSessions) {
    if (err) {
      res.status = 400;
      res.send(err);
    }
    db.courseSessions.find(function (er, courseSessions) {
      if (er) {
        res.send(er);
      }
      console.log("Course Sessions" + courseSessions.length);
      var cs = [];
      courseSessions.forEach(function (element) {
        for (var i = 0; i < studentSessions.length; i++) {
          if (element._id.toString() == studentSessions[i].courseSession_id.toString()) {
            cs.push(element);
          }
        }
      }, this);
      res.json(cs);
    });
  });
});

// get single student session 
router.get('/student-session/:id', function (req, res, next) {
  db.studentSessions.findOne({
    _id: mongojs.ObjectId(req.params.id)
  }, function (err, studentSession) {
    if (err) {
      res.status = 400;
      res.send(err);
    }
    res.json(studentSession);
  });
});

// save course student session 
router.post('/student-session', function (req, res, next) {
  var studentSession = req.body;
  if (!(studentSession.student_id && studentSession.courseSession_id)) {
    res.status(400);
    res.json({
      "error": "Bad Data"
    });
  } else {
    var _studentSessoin = {
      student_id: mongojs.ObjectId(studentSession.student_id),
      courseSession_id: mongojs.ObjectId(studentSession.courseSession_id),
      dropClass: studentSession.dropClass
    };
    db.studentSessions.save(_studentSessoin, function (err, studentSession) {
      if (err) {
        res.send(err);
      }
      res.json(studentSession);
    });
  }
});

// delete single student session
router.delete('/student-session/:id', function (req, res, next) {
  db.studentSessions.remove({
    _id: mongojs.ObjectId(req.params.id)
  }, function (err, studentSession) {
    if (err) {
      res.send(err);
    }
    res.json(studentSession);
  });
});

// update student session
router.put('/student-session', function (req, res, next) {
  var studentSession = req.body;
  var _studentSession = {
    student_id: mongojs.ObjectId(studentSession.student_id),
    courseSession_id: mongojs.ObjectId(studentSession.courseSession_id),
    dropClass: studentSession.dropClass,
    attendance: studentSession.attendance,
    gradeItems: studentSession.gradeItems,
    finalGrade: studentSession.finalGrade
  };
  if (_studentSession && studentSession.student_id && studentSession.courseSession_id) {
    db.studentSessions.update({
      _id: mongojs.ObjectId(studentSession._id)
    }, _studentSession, {}, function (err, studentSession) {
      if (err) {
        res.send(err);
      }
      res.json(studentSession);
    });
  } else {
    res.status(400);
    res.json({
      "error": "Bad Data"
    });
  }
});


// get all semesters
router.get('/semesters', function (req, res, next) {
  db.semesters.find(function (err, semesters) {
    if (err) {
      res.send(err);
    }
    res.json(semesters);
  });
});

// get all course sessions by semester id
router.get('/semester-sessions/:id', function (req, res, next) {
  db.courseSessions.find({
    semester_id: mongojs.ObjectId(req.params.id)
  }, function (err, semester) {
    if (err) {
      res.status = 400;
      res.send(err);
    }
    res.json(semester);
  });
});

// get single semester 
router.get('/semester/:id', function (req, res, next) {
  db.semesters.findOne({
    _id: mongojs.ObjectId(req.params.id)
  }, function (err, semester) {
    if (err) {
      res.status = 400;
      res.send(err);
    }
    res.json(semester);
  });
});

// save semester
router.post('/semester', function (req, res, next) {
  var semester = req.body;
  if (!(semester.year && semester.term)) {
    res.status(400);
    res.json({
      "error": "No year or term has been entered"
    });
  } else {
    var _semester = {
      year: semester.year,
      term: semester.term,
      startDate: semester.startDate,
      endDate: semester.endDate,
    };
    db.semesters.save(_semester, function (err, sem) {
      if (err) {
        res.send(err);
      }
      res.json(sem);
    });
  }
});

// delete single semester
router.delete('/semester/:id', function (req, res, next) {
  db.semesters.remove({
    _id: mongojs.ObjectId(req.params.id)
  }, function (err, sem) {
    if (err) {
      res.send(err);
    }
    res.json(sem);
  });
});

// update semester
router.put('/semester', function (req, res, next) {
  var semester = req.body;
  if (semester.year && semester.term) {
    var _semester = {
      year: semester.year,
      term: semester.term,
      startDate: semester.startDate,
      endDate: semester.endDate,
    };
    db.semesters.update({
      _id: mongojs.ObjectId(semester._id)
    }, _semester, {}, function (err, sem) {
      if (err) {
        res.send(err);
      }
      res.json(sem);
    });
  } else {
    res.status(400);
    res.json({
      "error": "Bad Data"
    });
  }
});

module.exports = router;
