import { Injectable } from '@angular/core';
import { Recipe } from '@root/app/models/recipe';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '@root/environments/environment';
import { catchError, first, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { viewClassName } from '@angular/compiler';
import { LoggerService } from '@root/app/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeDbService {

  // Url of the node.js/Express Recipe service running on port 8000.
  public nodeRecipeSvcUrl = environment.apiUrl; // 'http://localhost:8000/';
  // Url of the static data served through angular app.
  public recipesUrl = "assets/data/";
  public isServiceRunning: boolean = false;
  public tmprecipe: Recipe;

  constructor(
    private http: HttpClient,
    private logger: LoggerService ) {
    this.isServiceRunning = true;
  }

  // check if the service is running by calling it's serviceRunning() function
  serviceRunning() {
    return this.http.get<boolean>(this.nodeRecipeSvcUrl + 'api/serviceRunning').pipe(
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
          tmp = this.http.get<Recipe[]>(this.nodeRecipeSvcUrl + 'api/recipes/')
        :
          tmp = this.getLocalRecipes();
        return tmp;
      })
    );
  }
  
  getRecipe(name) {
    return this.serviceRunning().pipe(
      switchMap(val => {
        this.logger.log("GetRecipe(" + name + ").switchMap.svrRunning flag: " + val);
        var tmp: Observable<Recipe>;
        val ? 
          tmp = this.http.get<Recipe>(this.nodeRecipeSvcUrl + 'api/recipes/' + name)
        :
          tmp = this.getLocalRecipe(name);
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

  getLocalRecipe(id): Observable<Recipe> {
    return this.getLocalRecipes().pipe(
      map(u=> u.find( i => i.id === id))
    );
  }

  insertRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(this.nodeRecipeSvcUrl + 'api/recipes/', recipe)
  }

  updateRecipe(recipe: Recipe): Observable<void> {
    return this.http.put<void>(
      this.nodeRecipeSvcUrl + 'api/recipes/' + recipe.id,
      recipe
    )
  }

  deleteRecipe(recipename: string) {
    return this.http.delete(this.nodeRecipeSvcUrl + 'api/recipes/' + recipename)
  }
}

