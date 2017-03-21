import { Component, OnInit } from '@angular/core';
import {StudentService} from '../../services/student.service'
import { NotificationService } from '../../services/notification.service';
import { Student } from '../../../model/student';

@Component({
    moduleId: module.id,
    selector: 'pokemon-student',
    templateUrl: 'student.component.html',
    providers:[StudentService,NotificationService]
})
export class StudentComponent implements OnInit 
{
	
	StudentActiveFlag=false;
	//studentIsActiveForm = 'off';
	students:Student[];
	newStudent:Student;
    constructor(private _studentService:StudentService,private _notificationService:NotificationService) 
    {
    	this._studentService.getStudents().subscribe(students=>{this.students = students});

    	this.newStudent =
    	{
    		_id:"",
    		firstName:"",
    		lastName:"",
    		phone:"",
    		email:"",
    		active:false,
    		editState:false,
    		registered:false
    	}


    }

   setEditState(student,state)
   {

if(state)
{
for(let s of this.students)
{
   delete s.isEditMode;
}
}


   		if(state)
   		{
   			student.isEditMode = state;
   		}
   		else
   		{
   			delete student.isEditMode;
   		}
   }


updateStudent(student)
{
	var _student = 
	{
		_id : student._id,
		firstName:student.firstName,
		lastName:student.lastName,
		email:student.email,
		phone:student.phone,
		active :student.active,
		registered:student.registered
	}

this._studentService.updateStudent(_student)
.subscribe(data=>{
	this._studentService.getStudents().subscribe(students=>{this.students = students});
	this._notificationService.success(`Student ${_student.lastName}, ${_student.firstName} has been updated.`);
});

this.setEditState(student,false);
}

updateActiveStatus(student)
{
	var _student = 
	{
		_id : student._id,
		firstName:student.firstName,
		lastName:student.lastName,
		email:student.email,
		phone:student.phone,
		active :!student.active,
		registered:student.registered
	}



this._studentService.updateStudent(_student)
.subscribe(data=>{
	student.active=!student.active;
	if(student.active)
	this._notificationService.success(`Student ${_student.lastName}, ${_student.firstName} has been activated.`);
	else
	this._notificationService.success(`Student ${_student.lastName}, ${_student.firstName} has been deactivated.`);
});

   


}



updateRegisteredStatus(student)
{

	var _student = 
	{
		_id : student._id,
		firstName:student.firstName,
		lastName:student.lastName,
		email:student.email,
		phone:student.phone,
		active :student.active,
		registered:!student.registered

	}


this._studentService.updateStudent(_student)
.subscribe(data=>{
	student.registered=!student.registered;
});

}




addStudent(newStudent)
{
	
this.newStudent.active = this.StudentActiveFlag;
this._studentService.addStudent(newStudent)
.subscribe(addedStudent=>{
	// close dialog & reload students
	
	this.students.push(addedStudent);
		hideMetroDialog('#dialog');
	this.resetForm();
});





}


resetForm()
{

this.newStudent =
    	{
    		_id:"",
    		firstName:"",
    		lastName:"",
    		phone:"",
    		email:"",
    		active:false,
    		editState:false,
    		registered:false
    	}
    	//this.studentIsActiveForm = 'off';

    	this.StudentActiveFlag = false;
    	
}

checkboxChange()
{
	if(this.StudentActiveFlag)
	{
		this.StudentActiveFlag = false;
	}
	else if(!this.StudentActiveFlag)
	{
		this.StudentActiveFlag = true;
	}

}




deleteStudent(id) {
       
        this._studentService.deleteStudent(id).subscribe(data => {
            if (data.n == 1) {
                for (var i = 0; i < this.students.length; i++) {
                    if (this.students[i]._id == id) 
                    {
                    	var deletedStudent = this.students[i];
                        this.students.splice(i, 1);
                        this._notificationService.success(`Student ${deletedStudent.lastName}, ${deletedStudent.firstName} has been deleted.`);
                        break;
                    }
                }
            }
        });
    }



    ngOnInit() { }

}