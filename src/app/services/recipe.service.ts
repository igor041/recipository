import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from '@root/app/models/recipe';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
//import { MessageService } from '@root/app/services/message.service';
import { environment } from '../../environments/environment';
import { catchError, first, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { viewClassName } from '@angular/compiler';
import { LoggerService } from '@root/app/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  // Url of the node.js/Express Recipe service running on port 8000.
  public apiUrl_Node = environment.apiUrl_Node; // 'http://localhost:8000/';
  // Url of MVC REST API service running on port 8001
  public apiUrl_mvcRest = environment.apiUrl_mvcRest; // 'http://localhost:8001/';

  // Url of the static data served through angular app.
  public recipesUrl = "assets/data/";
  public isServiceRunning: boolean = false;
  //public tmprecipe: Recipe;

  constructor(
    //private messageService: MessageService,
    private http: HttpClient,
    private logger: LoggerService ) {
    this.isServiceRunning = true;
  }

  // check if the service is running by calling it's serviceRunning() function
  serviceRunning() {
    return this.http.get<boolean>(this.apiUrl_Node + 'api/serviceRunning').pipe(
      catchError(err => {
        this.logger.log("serviceRunning().caught: " + JSON.stringify(err));
        return of(false);
      }));
  }
  
  getRecipes(): Observable<Recipe[]> {
    return this.serviceRunning().pipe(
      switchMap(val => {
        this.logger.log("GetRecipes.switchMap.svrRunning flag: " + val);
        var tmp: Observable<Recipe[]>;
        val ? 
          tmp = this.http.get<Recipe[]>(this.apiUrl_Node + 'api/recipes/')
        :
          tmp = this.getLocalRecipes();
        return tmp;
      })
    );
  }
  
  getRecipe(id) {
    return this.serviceRunning().pipe(
      switchMap(val => {
        this.logger.log("GetRecipe(" + id + ").switchMap.svrRunning flag: " + val);
        var tmp: Observable<Recipe>;
        val ? 
          tmp = this.http.get<Recipe>(this.apiUrl_Node + 'api/recipes/' + id)
        :
          tmp = this.getLocalRecipe(id);
        tmp.subscribe( u => this.logger.log("getRecipe.getRandomLocalRecipe: " + JSON.stringify(u)));
        return tmp;
      })
    );
  }

  // Get recipes from static assets file JSON 
  // TODO: Use this in prod until we get the web service up and running
  public getLocalRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.recipesUrl + 'recipes.json');
  }

  getLocalRecipe(recipeId): Observable<Recipe> {
    return this.getLocalRecipes().pipe(
      map(u=> u.find( i => i.id === recipeId))
    );
  }

  insertRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl_Node + 'api/recipes/', recipe)
  }

  updateRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.put<Recipe>(
      this.apiUrl_Node + 'api/recipes/' + recipe.id,
      recipe
    )
  }

  saveRecipe(recipe): Observable<Recipe>{
    if(recipe.id){
      return this.insertRecipe(recipe);
    }else{
      return this.updateRecipe(recipe);
    }
  }

  deleteRecipe(recipeId: string) {
    return this.http.delete(this.apiUrl_Node + 'api/recipes/' + recipeId)
  }

  //Events
  //recipeSelected = new EventEmitter<Recipe>();
  private _recipeSelected = new BehaviorSubject<number>(null);
  readonly recipeSelected = this._recipeSelected.asObservable();

  toggleRecipeSelected(recipeId: number){
    this._recipeSelected.next(recipeId);
  }
  // this._todo.next(Object.assign([], this.todos));
}

