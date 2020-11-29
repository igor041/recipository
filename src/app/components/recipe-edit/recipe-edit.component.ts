import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Recipe } from '@root/app/models/recipe';
import { RecipeService } from '@root/app/services/recipe.service';
import { LoggerService } from '@root/app/services/logger.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit, AfterViewInit {

  @Input() recipeId: string; 
  // private _recipeId;
  // public get recipeId() { return this._recipeId; }
  // public set recipeId(id) {
  //   // logic
  //   this._recipeId = id;
  // }
  recipeForm: FormGroup;
  titleAlert: string = 'This field is required';
  post: any = '';
  public currentRecipe: Recipe;

  constructor(
    private formBuilder: FormBuilder,
    private logger: LoggerService,
    private recipeService: RecipeService,
    public snackBar: MatSnackBar) {
    this.logger.log("RecipeEditComponent.ctor.");
  }

  openSnackBar(message: string, action: string = "") {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  ngAfterViewInit(): void {
      // this.addressForms.changes.subscribe((comps: QueryList <AddressFormComponent>) =>
      // {
      //     this.addressForm = comps.first;
      // });
  }

  ngOnInit() {
    this.createForm();
    this.loadRecipe(this.recipeId);
    this.recipeForm.valueChanges.subscribe(x => {
      this.logger.log("recipeForm chnages!");
      //this.logger.log("Formvalue has changed! v: " + JSON.stringify(this.recipeForm.get("title")));
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.recipeId?.currentValue) {
      this.logger.log("RecipeEdit.ngOnChanges:" + JSON.stringify(changes) + ",recipeId: " + changes.recipeId.currentValue);
      this.recipeId = changes.recipeId?.currentValue;
      this.loadRecipe(this.recipeId);
    }
  }

  saveData() {
    //this.openSnackBar("savedata1():" + JSON.stringify(this.recipeForm), "");
    this.openSnackBar("savedata2():" + JSON.stringify(this.currentRecipe), "");
  }

  loadRecipe(recipeId: string) {
    this.recipeService.getRecipe(recipeId).subscribe(u => {
      this.logger.log("recipe: " + JSON.stringify(u));
      this.currentRecipe = u;
      this.setRecipeValue(u);    
    });
  }

//   {
//     "id": "1",
//     "title" : "Recipe 1",
//     "description": "Description of recipe 1", 
//     "ingredients": "blh blah",
//     "recipe": "20ml of vodka. Drink.",
//     "link" : "http:://www.recipes.com/recipe1"
// },
  setRecipeValue(recipe: Recipe) {
    this.recipeForm.setValue({ 
      id: (recipe?.id || ''), 
      title: (recipe?.title || ''), 
      description: (recipe?.description || ''), 
      ingredients: (recipe?.ingredients || ''), 
      recipe: (recipe?.recipe || ''), 
      link: (recipe?.link || '')
    });
  }

  createForm() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.recipeForm = this.formBuilder.group({
      'id': [null, Validators.required], 
      'title': [null, Validators.required],
      'description': [null, Validators.required],
      'ingredients': [null, Validators.required],
      'recipe':[null, Validators.required],
      'link': [null],
    });
  }

  setChangeValidate() {
    this.recipeForm.get('validate').valueChanges.subscribe(
      (validate) => {
        if (validate == '1') {
          this.recipeForm.get('name').setValidators([Validators.required, Validators.minLength(3)]);
          this.titleAlert = "You need to specify at least 3 characters";
        } else {
          this.recipeForm.get('name').setValidators(Validators.required);
        }
        this.recipeForm.get('name').updateValueAndValidity();
      }
    )
  }

  get name() {
    return this.recipeForm.get('name') as FormControl
  }

  checkPassword(control) {
    let enteredPassword = control.value
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }

  checkInUseEmail(control) {
    // mimic http database access
    let db = ['tony@gmail.com'];
    return new Observable(observer => {
      setTimeout(() => {
        let result = (db.indexOf(control.value) !== -1) ? { 'alreadyInUse': true } : null;
        observer.next(result);
        observer.complete();
      }, 4000)
    })
  }

  getErrorEmail() {
    return this.recipeForm.get('email').hasError('required') ? 'Field is required' :
      this.recipeForm.get('email').hasError('pattern') ? 'Not a valid emailaddress' :
        this.recipeForm.get('email').hasError('alreadyInUse') ? 'This emailaddress is already in use' : '';
  }

  getErrorPassword() {
    return this.recipeForm.get('password').hasError('required') ? 'Field is required (at least eight characters, one uppercase letter and one number)' :
      this.recipeForm.get('password').hasError('requirements') ? 'Password needs to be at least eight characters, one uppercase letter and one number' : '';
  }

  onSubmit(post) {
    this.openSnackBar("Onsubmit");
    this.post = post;
  }

}

