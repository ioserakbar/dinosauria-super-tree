import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CladeService } from '../../../../services/clade/clade.service';
import { ICladeInterface } from '../../../../shared/interfaces/ICladeRegister';
import { Clade } from '../../../../shared/models/Clade';
import { NgFor } from '@angular/common';

@Component({
  selector: 'pt-add-clade',
  imports: [ReactiveFormsModule,  NgFor],
  templateUrl: './add-clade.component.html',
  styleUrl: './add-clade.component.css'
})
export class AddCladeComponent implements OnInit{

  dummyClade: Clade[] = []

  testData: Clade[] = []

  addSpeciesForm!: FormGroup;
  isSubmited = false;

  constructor(
    private formBuilder: FormBuilder,
    private cladeService: CladeService
  ){ }

  ngOnInit(){

    const $clades = this.cladeService.getAll()

    $clades.subscribe({
      next: value => {
        this.testData = value
        console.log(value)
        this.calcTestData()
      }
    })

    this.addSpeciesForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      parentClade: ['', [Validators.required]],
      description: ['']
    })


    
  }

  calcTestData(){

    this.dummyClade.forEach(clade => {
      if(clade.tier = 0)

      var availableAngle = 360 / clade.directSons.length
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
    const newClade : ICladeInterface = {
      name: fv.name,
      parentClade: fv.parentClade,
      description: fv.description
    }

    this.cladeService.addClade(newClade).subscribe(_ => { 
      console.log("species added succesfully")
    })
  }
}
