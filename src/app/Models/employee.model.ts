export interface Employee {
    id: number;
    name: string;
    departmentId?: number; // Add this if it's not already in your model
    jobTitleId?: number;
    genderId?: number;
  }
  