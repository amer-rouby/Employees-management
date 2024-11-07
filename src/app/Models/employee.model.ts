export interface Employee {
  id: string;
  name: string;
  englishName?: string;
  departmentId?: string;
  jobTitleId?: string;
  genderId?: string;
  nationalitieId?: string;
  maritalStatusId?: string;
  phoneNumber?: string;        // رقم الهاتف
  identityNumber?: string;     // رقم إثبات الهوية
  hireDate?: Date;             // تاريخ تعيين الموظف
}
