import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CladeService } from '../../../../services/clade.service';
import { ICladeInterface } from '../../../../shared/interfaces/ICladeRegister';
import { Clade } from '../../../../shared/models/Clade';
import { NgFor, NgIf } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@Component({
    selector: 'pt-add-clade',
    imports: [ReactiveFormsModule, NgFor, NgMultiSelectDropDownModule, NgIf],
    templateUrl: './add-clade.component.html',
    styleUrl: './add-clade.component.css'
})
export class AddCladeComponent implements OnInit {
    allClades: Clade[] = [];

    addCladeForm!: FormGroup;
    isSubmited = false;

    showOptionsForChildrenManagment = false;
    directSonsOpions: { name: string; id: string }[] = [];

    selectedParentClade?: Clade = new Clade();
    newCladeTempName: string = '';

    constructor(private formBuilder: FormBuilder, private cladeService: CladeService) {}

    ngOnInit() {
        const $clades = this.cladeService.getAll();
        $clades.subscribe({
            next: (value) => {
                this.allClades = value;
            }
        });

        this.addCladeForm = this.formBuilder.group({
            name: ['', [Validators.required]],
            parentClade: ['', [Validators.required]],
            directSons: ['', [Validators.required]],
            description: ['']
        });
    }

    getAllCladeNames() {
        return this.allClades.map((c) => c.name);
    }

    setNewCladeName(newName: string) {
        this.newCladeTempName = newName;
    }

    changeDirectSons(selectedCladeId: string) {
        this.selectedParentClade = this.allClades.find((c) => c._id == selectedCladeId)!;

        var pDirectSonsOpions = [];

        this.selectedParentClade.directSons.forEach((son) => {
            var sonClade = this.allClades.find((c) => c._id == son)!;

            pDirectSonsOpions.push({
                name: 'The new clade will be the new parent of ' + sonClade.name,
                id: sonClade._id + '-parent'
            });
        });

        var sonClade = this.allClades.find((c) => c._id == this.selectedParentClade?.directSons[0])!;

        pDirectSonsOpions.push({
            name: 'The new clade will another son',
            id: sonClade._id + '-sibling'
        });

        pDirectSonsOpions.push({
            name: 'Both will be children of the new calde',
            id: '0-both'
        });

        this.directSonsOpions = pDirectSonsOpions;

        if (this.selectedParentClade.directSons.length <= 0) {
            this.showOptionsForChildrenManagment = false;
        } else {
            this.showOptionsForChildrenManagment = true;
        }
    }

    get fc() {
        return this.addCladeForm.controls;
    }

    submit() {
        this.isSubmited = true;

        if (this.addCladeForm.invalid) {
            console.log('form is invalid', this.addCladeForm);
            return;
        }

        const fv = this.addCladeForm.value;

        console.log(this.addCladeForm);

        var newCladeDirectSons: string[] = [];

        var rawDirectSons = fv.directSons.split('-');

        var directSonsId = rawDirectSons[0];
        var method = rawDirectSons[1];

        if (method == 'both') {
            newCladeDirectSons = [...this.selectedParentClade?.directSons!];
        } else {
            newCladeDirectSons.push(directSonsId);
        }

        const newClade: ICladeInterface = {
            name: fv.name,
            parentCladeId: fv.parentClade,
            description: fv.description,
            isFirst: false,
            tier: -1,
            directSons: newCladeDirectSons,
            mergeMethod: method
        };

        console.log(fv);

        this.cladeService.addClade(newClade).subscribe((_) => {
            console.log('species added succesfully');
        });
    }
}
