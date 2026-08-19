export interface Employee {
  id: number;
  name: string;
  englishName: string;
  jobTitleId: number;
  departmentId: number;
  genderId: number;
  nationalitieId: number;
  maritalStatusId: number;
  phoneNumber: string;        // رقم الهاتف
  identityNumber: string;     // رقم إثبات الهوية
  hireDate: Date;             // تاريخ تعيين الموظف
}
