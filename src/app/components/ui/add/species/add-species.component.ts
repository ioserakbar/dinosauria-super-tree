import { Component, OnInit } from '@angular/core';
import { ISpeciesRegister } from '../../../../shared/interfaces/ISpeciesRegister';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SpeciesService } from '../../../../services/species/species.service';

@Component({
  selector: 'pt-add-species',
  imports: [ReactiveFormsModule],
  templateUrl: './add-species.component.html',
  styleUrl: './add-species.component.css'
})
export class AddSpeciesComponent implements OnInit{

  addSpeciesForm!: FormGroup;
  isSubmited = false;

  constructor(
    private formBuilder: FormBuilder,
    private speciesService: SpeciesService
  ){ }

  ngOnInit(){
    console.log("onInit")
    this.addSpeciesForm = this.formBuilder.group({
      binomialNomenclature: ['', [Validators.required]],
      genus: ['', [Validators.required]]
    })
  }

  get fc(){
    return this.addSpeciesForm.controls
  }

  submit(){
    console.log(this.addSpeciesForm)
    this.isSubmited = true
    if(this.addSpeciesForm.invalid) return
    const fv = this.addSpeciesForm.value
    const newSpecies : ISpeciesRegister = {
      binomialNomenclature: fv.binomialNomenclature,
      genus: fv.genus
    }

    this.speciesService.addSpecies(newSpecies).subscribe(_ => { 
      console.log("species added succesfully")
    })

  }


}
