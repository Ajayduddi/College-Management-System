export const course_validation = {
    name: {
        isString: {
            errorMessage : "Name must be a string"
        },
        notEmpty: {
            errorMessage : "Name must be required"
        }
    },
    details: {
        isString: {
            errorMessage : " details must be a string"
        }
    },
    credits: {
        isNumeric: {
            errorMessage : "Credits must be a Number"
        },
        notEmpty: {
            errorMessage : " Credits must ne required"
        }
    },
    syllabus: {
        isString: {
            errorMessage : "syllabus must be a string"
        }
    },
    created_by: {
        isString: {
            errorMessage: "Created by must be a string"
        },
        notEmpty: {
            errorMessage: "Created by is required"
        }
    }
}


export const users_validation = {
    user_id: {
        isString: {
            errorMessage : "user_id must be a string"
        },
    },
    name: {
        isString: {
            errorMessage : "Name must be a string"
        },
        notEmpty: {
            errorMessage : "Name must be reuired"
        }
    },
    email: {
        isEmail: {
            errorMessage: "Enter valid Email"
        },
        notEmpty: {
            errorMessage: "Email must be required"
        }
    },
    phone_no: {
        isNumeric: {
            errorMessage: "phone_no must be a number"
        },
        notEmpty: {
            errorMessage: "phone_no reuired"
        },
        isLength: {
            options: { min: 10, max: 10 },
            errorMessage: 'Contact number must be 10 digits',
        },
    },
    password: {
        isString: {
            errorMessage: "Name must be a string"
        },
        notEmpty: {
            errorMessage: "Name must be reuired"
        }
    },
    dob: {
        notEmpty: {
            errorMessage : " Date required"
        }
    },
    dept: {
        notEmpty: {
            errorMessage : "department id required"
        }
    },
    role: {
        notEmpty: {
            errorMessage : "role is required"
        }
    },
    created_by: {
        isString: {
            errorMessage: "Created by must be a string"
        },
        notEmpty: {
            errorMessage: "Created by is required"
        }
    }
}

export const roles_validation = {
    name: {
        isString: {
            errorMessage : "Name must be a string"
        },
        notEmpty: {
            errorMessage : "name is required"
        }
    },
    created_by: {
        isString: {
            errorMessage: "Created by must be a string"
        },
        notEmpty: {
            errorMessage: "Created by is required"
        }
    }
}

export const department_validation = {
    name: {
        isString: {
            errorMessage : "Name must be a string"
        },
        notEmpty: {
            errorMessage : "Name is required"
        }
    },
    created_by: {
        isString: {
            errorMessage: "Created by must be a string"
        },
        notEmpty: {
            errorMessage: "Created by is required"
        }
    }
}

export const batch_validation = {
    name: {
        isString: {
            errorMessage : "Name must be a string"
        },
        notEmpty: {
            errorMessage : "Name is required"
        }
    },
    department: {
        isString: {
            errorMessage : "Department id must be a string"
        },
        notEmpty: {
            errorMessage : "Department id is required"
        }
    },
    students_list: {
        isArray: {
            errorMessage : "Students list must be an array"
        },
        notEmpty: {
            errorMessage : "Students list is required"
        }
    },
    created_by: {
        isString: {
            errorMessage: "Created by must be a string"
        },
        notEmpty: {
            errorMessage: "Created by is required"
        }
    }
}

export const announcement_validation = {
    title: {
        isString: {
            errorMessage : "Title must be a string"
        },
        notEmpty: {
            errorMessage : "Title is required"
        }
    },
    content: {
        isString: {
            errorMessage : "Content must be a string"
        },
        notEmpty: {
            errorMessage : "Content is required"
        }
    },
    created_by: {
        isString: {
            errorMessage : "Created by must be a string"
        },
        notEmpty: {
            errorMessage : "Created by is required"
        }
    }
}

export const regulatoion_validation = {
    regulation: {
        notEmpty: {
            errorMessage: "Regulation is required"
        },
        isString: {
            errorMessage: "Regulation must be a string"
        },
        isLength: {
            options: { min: 3, max: 3 },
            errorMessage: 'Regulation must be 3 characters',
        },
    },
    department: {
        notEmpty: {
            errorMessage: "Department is required"
        },
        isString: {
            errorMessage: "Department must be a string"
        },
    },
    semister: {
        notEmpty: {
            errorMessage: "Semister is required"
        },  
        isArray: {
            errorMessage: "Semister must be an array"
        }
    },
    syllabus: {
        notEmpty: {
            errorMessage: "Syllabus is required"
        },
        isString: {
            errorMessage: "Syllabus must be a string"   
        }
    },
    status: {
        isString: {
            errorMessage: "Status must be a string"
        },
    },
    created_by: {
        isString: {
            errorMessage: "Created by must be a string"
        },
        notEmpty: {
            errorMessage: "Created by is required"
        }
    }
}

export const attendances_validation = {
    batch: {
        notEmpty: {
            errorMessage: "Batch is required"
        },
        isString: {
            errorMessage: "Batch must be a string"
        },
    },
    department: {
        notEmpty: {
            errorMessage: "Department is required"
        },
        isString: {
            errorMessage: "Department must be a string"
        },
    },
    year: {
        notEmpty: {
            errorMessage: "Year is required"
        },
        isNumeric: {
            errorMessage: "Year must be a number"
        },
    },
    month: {
        notEmpty: {
            errorMessage: "Month is required"
        },
        isString: {
            errorMessage: "Month must be a string"
        },
    },
    date: {
        notEmpty: {
            errorMessage: "Date is required"
        },
        isString: {
            errorMessage: "Date must be a string"
        },
    },
    students_list: {
        isArray: {
            errorMessage: "Students list must be an array"
        },
    },
    given_by: {
        notEmpty: {
            errorMessage: "Given by is required"
        },
        isString: {
            errorMessage: "Given by must be a string"
        },
    }
}

export const faculty_validation = {
    name: {
        isString: {
            errorMessage : "Name must be a string"
        },
        notEmpty: {
            errorMessage : "Name is required"
        }
    },
    department: {
        isString: {
            errorMessage : "Department id must be a string"
        },
        notEmpty: {
            errorMessage : "Department id is required"
        }
    },
    user_details: {
        isString: {
            errorMessage : "User details must be a string"
        },
        notEmpty: {
            errorMessage : "User details is required"
        }
    },
    courses_taught: {
        isArray: {
            errorMessage : "Courses taught must be an array"
        },
        notEmpty: {
            errorMessage : "Courses taught is required"
        }
    },
}