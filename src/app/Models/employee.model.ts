export interface Employee {
  id: string;
  name: string;
  englishName?: string;
  jobTitleId: number;
  departmentId: number;
  genderId?: string;
  nationalitieId?: string;
  maritalStatusId?: string;
  phoneNumber?: string;        // رقم الهاتف
  identityNumber?: string;     // رقم إثبات الهوية
  hireDate?: Date;             // تاريخ تعيين الموظف
}
