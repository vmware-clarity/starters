import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      darkTheme: [true],
      textInput: ['hello there']
    });

    this.form.valueChanges.subscribe(values => {
      console.log(values);
      document.body.setAttribute('cds-theme', `${values.darkTheme ? 'dark' : ''}`);
    });
  }

  submit() {
    console.log(this.form.value);
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
