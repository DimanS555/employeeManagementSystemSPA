import { Employee, Department } from '../models/interfaces';

export var MOCK_EMPLOYEE: Employee[] = [

    { 
        id: 1, 
        firstName: "Dima", 
        lastName: "Savenkov", 
        isActive: true, 
        emp_depID: 1 
    },
    { 
        id: 2, 
        firstName: "Peter", 
        lastName: "Sermon", 
        isActive: false, 
        emp_depID: 2 
    },
    { 
        id: 3, 
        firstName: "Den", 
        lastName: "Brown", 
        isActive: false, 
        emp_depID: 3 
    },
    { 
        id: 4, 
        firstName: "Kate", 
        lastName: "Belik", 
        isActive: true, 
        emp_depID: 1 
    },
    { 
        id: 5, 
        firstName: "John", 
        lastName: "Doe", 
        isActive: true, 
        emp_depID: 2 
    },
]

export var MOCK_DEPARTMENT: Department[] = [
    { 
        id: 1, 
        depName: 'Finance' 
    },
    { 
        id: 2, 
        depName: 'HR' 
    },
    { 
        id: 3, 
        depName: 'Tech' 
    }
]