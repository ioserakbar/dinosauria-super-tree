import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CladeService } from '../../../../services/clade/clade.service';
import { ICladeInterface } from '../../../../shared/interfaces/ICladeRegister';
import { Clade } from '../../../../shared/models/Clade';
import { NgFor } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@Component({
	selector: 'pt-add-clade',
	imports: [ReactiveFormsModule, NgFor, NgMultiSelectDropDownModule],
	templateUrl: './add-clade.component.html',
	styleUrl: './add-clade.component.css'
})
export class AddCladeComponent implements OnInit {
	allClades: Clade[] = []

	addCladeForm!: FormGroup;
	isSubmited = false;

	constructor(
		private formBuilder: FormBuilder,
		private cladeService: CladeService
	) { }

	ngOnInit() {

		const $clades = this.cladeService.getAll()

		$clades.subscribe({
			next: value => {
				this.allClades = value
			}
		})

		this.addCladeForm = this.formBuilder.group({
			name: ['', [Validators.required]],
			parentClade: ['', [Validators.required]],
			description: ['']
		})
	}

	getAllCladeNames(){
		return this.allClades.map(c => c.name)
	}


	get fc() {
		return this.addCladeForm.controls
	}

	submit() {

		this.isSubmited = true

		if (this.addCladeForm.invalid) return

		const fv = this.addCladeForm.value
		const newClade: ICladeInterface = {
			name: fv.name,
			parentClade: fv.parentClade,
			description: fv.description,
			isFirst: false,
			tier: -1
		}

		// Blocking posibility of clade with more sons than 2
		var parentClade = this.allClades.find(c => c.name == newClade.parentClade)

		console.log(newClade.parentClade, parentClade)
		if ( parentClade!.directSons!.length >= 2){
			console.log("More than two sons not permitted")
			return 
		}

		this.cladeService.addClade(newClade).subscribe(_ => {
			console.log("species added succesfully")
		})
	}
}
