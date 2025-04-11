import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CladeService } from '../../../../services/clade/clade.service';
import { ICladeInterface } from '../../../../shared/interfaces/ICladeRegister';

@Component({
  selector: 'pt-add-clade',
  imports: [ReactiveFormsModule],
  templateUrl: './add-clade.component.html',
  styleUrl: './add-clade.component.css'
})
export class AddCladeComponent implements OnInit{

  addSpeciesForm!: FormGroup;
  isSubmited = false;

  constructor(
    private formBuilder: FormBuilder,
    private cladeService: CladeService
  ){ }

  ngOnInit(){
    this.addSpeciesForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      parentClade: ['', [Validators.required]],
      description: ['']
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
