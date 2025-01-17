import { TypesOfVacationsService } from './Types-of-vacations.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NationalitiesService } from './nationalities.service';
import { JobTitlesService } from './JobTitles.service';
import { DepartmentsService } from './departments.service';
import { GenderService } from './gender.service';
import { MaritalStatusService } from './maritalStatus.service';
import { Nationalities } from '../Models/nationalities.model';
import { JobTitles } from '../Models/JobTitles.model';
import { Departments } from '../Models/departments.model';
import { Gender } from '../Models/gender.model';
import { MaritalStatus } from '../Models/maritalStatus.model';
import { TypesOfVacations } from '../Models/TypesOfVacations.model';
import { leavelStatus } from '../Models/leavelStatus.model';
import { leavelStatusService } from './leave-status.service';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    constructor(
        private nationalitiesService: NationalitiesService,
        private jobTitlesService: JobTitlesService,
        private departmentsService: DepartmentsService,
        private genderService: GenderService,
        private typesOfVacationsService: TypesOfVacationsService,
        private maritalStatusService: MaritalStatusService,
        private leavelStatusService: leavelStatusService,
    ) { }

    getNationalities(): Observable<Nationalities[]> {
        return this.nationalitiesService.getAllNationalitiesRequests();
    }

    getJobTitles(): Observable<JobTitles[]> {
        return this.jobTitlesService.getAllJobTitlesRequests();
    }
    getTypesOfVacations(): Observable<TypesOfVacations[]> {
        return this.typesOfVacationsService.getAllTypesOfVacationsRequests();
    }

    getDepartments(): Observable<Departments[]> {
        return this.departmentsService.getAllDepartmentsRequests();
    }

    getGender(): Observable<Gender[]> {
        return this.genderService.getAllGenderRecords();
    }

    getMaritalStatus(): Observable<MaritalStatus[]> {
        return this.maritalStatusService.getAllMaritalStatus();
    }

    getLeavelStatus(): Observable<leavelStatus[]> {
        return this.leavelStatusService.getAllleavelStatusRequests();
    }
}
