import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Recipe } from '@root/app/models/recipe';

@Component({
  selector: 'app-recipe-list-item',
  templateUrl: './recipe-list-item.component.html',
  styleUrls: ['./recipe-list-item.component.scss']
})
export class RecipeListItemComponent implements OnInit {

  @Input() recipe: Recipe;
  @Output() recipeChange: EventEmitter<Recipe> = new EventEmitter<Recipe>();

  constructor() { }

  ngOnInit(): void { }

  public selectRecipe(recipe: Recipe){
    this.recipeChange.emit(recipe);
  }
}
