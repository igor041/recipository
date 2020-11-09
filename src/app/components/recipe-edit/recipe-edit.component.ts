import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit {

  @Input() recipeId: string; 
  constructor() { }

  ngOnInit(): void {
  }

}
