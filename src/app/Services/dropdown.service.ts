// dropdown.service.ts
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NationalitiesService } from './nationalities.service';
import { JobTitlesService } from './JobTitles.service';
import { DepartmentsService } from './departments.service';
import { GenderService } from './gender.service';
import { MaritalStatusService } from './maritalStatus.service';
import { DropdownItem } from '../Models/dropdown.model';
@Injectable({
    providedIn: 'root',
})
export class DropdownService {
    jobTitles: DropdownItem[] = [];
    departments: DropdownItem[] = [];
    nationalities: DropdownItem[] = [];
    maritalStatus: DropdownItem[] = [];
    gender: DropdownItem[] = [];
    constructor(
        private translate: TranslateService,
        private nationalitiesService: NationalitiesService,
        private jobTitlesService: JobTitlesService,
        private departmentsService: DepartmentsService,
        private genderService: GenderService,
        private maritalStatusService: MaritalStatusService,
    ) { }

    ngOnInit(): void {
        this.loadDropdownData();
    }
    // Load dropdown data (nationalities, job titles, departments, gender, marital status)
    private loadDropdownData(): void {
        const services = [
            { method: this.nationalitiesService.getAllNationalitiesRequests(), setter: (data: DropdownItem[]) => this.nationalities = this.mapDropdownData(data) },
            { method: this.jobTitlesService.getAllJobTitlesRequests(), setter: (data: DropdownItem[]) => this.jobTitles = this.mapDropdownData(data) },
            { method: this.genderService.getAllGenderRecords(), setter: (data: DropdownItem[]) => this.gender = this.mapDropdownData(data) },
            { method: this.maritalStatusService.getAllMaritalStatus(), setter: (data: DropdownItem[]) => this.maritalStatus = this.mapDropdownData(data) },
            { method: this.departmentsService.getAllDepartmentsRequests(), setter: (data: DropdownItem[]) => this.departments = this.mapDropdownData(data) }
        ];

        services.forEach(service => {
            service.method.subscribe((data: DropdownItem[]) => {
                service.setter(data);
                this.checkDataReady();
            });
        });
    }

    // Map data to be language-specific
    private mapDropdownData(data: DropdownItem[]): any[] {
        return data.map(item => ({
            id: item.id,
            name: this.translate.currentLang === 'ar' ? item.arabic : item.english
        }));
    }

    // Check if all data for dropdowns is ready
    private checkDataReady(): void {
        if (this.nationalities.length && this.jobTitles.length && this.departments.length && this.gender.length && this.maritalStatus.length) {
        }
    }
    
}