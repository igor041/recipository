import { AfterViewInit, ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Recipe } from '@root/app/models/recipe';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { RecipeService } from 'src/app/services/recipe.service';
import { environment } from 'src/environments/environment';
import { LoggerService } from '../../services/logger.service';
import { RecipeEditComponent } from '../recipe-edit/recipe-edit.component';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, AfterViewInit {
  columnDefs = [
    { headerName: 'Id', field: 'id', sortable: true, resizable: true },
    { headerName: 'Title', field: 'title', sortable: true, resizable: true },
    { headerName: 'Description', field: 'description', sortable: true, editable: true, resizable: true },
    { headerName: 'Ingredients', field: 'ingridients', sortable: true, editable: true, resizable: true },
    { headerName: 'Recipe', field: 'recipe', sortable: true, editable: true, resizable: true },
    { headerName: 'Link', field: 'link', sortable: true, editable: true, resizable:true }
  ];
  rowData = [];
  recipes: Recipe[] = [];
  gridOptions: GridOptions;
  @ViewChild("agGrid") agGrid: AgGridAngular;
  DEBUG: boolean = !environment.production;
  gridApi;
  gridColumnApi;
  defaultColDef;
  selectedRecipeId;
  @ViewChild("recipeEdit") recipeEdit: RecipeEditComponent;
  public loadingCellRenderer;
  public loadingCellRendererParams;
  selectedRows; 

  constructor(
    //private userService: UserService,
    public recipeService: RecipeService,
    public snackBar: MatSnackBar,
    public injector: Injector,
    public router: Router,
    public logger: LoggerService,
    private cd: ChangeDetectorRef
    //public accountService: AccountService
    ) {

    this.gridOptions = <GridOptions>{
      rowData: this.rowData,
      columnDefs: this.columnDefs,
      onRowClicked: () => { this.onRowClicked(); },
      onColumnResized: function (event) { logger.log('A column was resized'); },
      rowHeight: 48, // recommended row height for material design data grids,
      rowSelection: "multiple",
      defaultColDef: { resizable: true },
      suppressRowClickSelection: false,
      debug: true, // This probably what causes the grid to dump to log 
      animateRows: true,
      getRowNodeId: function (data) { return data.id; }, //Tells which call back specifies which data filed should act as 'id' field.
      onFirstDataRendered(params) {
        logger.log("OnFirstDataRenderer");
        params.api.sizeColumnsToFit();
      }
    };
    this.defaultColDef = {
      flex: 1,
      minWidth: 150,
      filter: true,
    };
    this.loadingCellRenderer = 'customLoadingCellRenderer';
    this.loadingCellRendererParams = { loadingMessage: 'One moment please...' };
  }

  ngOnInit() {
    this.recipeService.getRecipes().subscribe(
      ur => {
        this.logger.log("Recipes:" + JSON.stringify(ur));
        this.recipes = ur;
        this.rowData = ur;
      }
    );
  }

  ngAfterViewInit() { }

  onGridReady(params) {
    this.logger.log("onGridReady triggered");
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridOptions.api.sizeColumnsToFit();
  }

  onRowClicked() {
    this.selectedRows = this.gridApi.getSelectedRows();
    this.selectedRecipeId = this.selectedRows[0].id;
    this.editRecipe(this.selectedRecipeId);
  }

  editRecipe(id){
    this.logger.log("recipe-list.editRecipe(id):" + JSON.stringify(id))
    //this.selectedRows = this.gridApi.getSelectedRows();
    //this.selectedRecipeId = this.selectedRows[0].id;
    //console.log("activateEditRecipePane.Selected user id: " + this.selectedRows[0].id);
    this.selectedRecipeId = id;
  }

  onSelectionChanged(event) { }

  handleGetRecipes(recipes){
    this.rowData = recipes;
    const params = { force: true };
    this.gridApi.setRowData(this.rowData)
    this.gridApi.refreshCells(params); 
  }

  refreshGrid() {
    this.recipeService.getRecipes().subscribe(
      recipes => {
        this.rowData = recipes;
        const params = { force: true };
        this.gridApi.setRowData(this.rowData)
        this.gridApi.refreshCells(params); 
      }
    );
  }

  printNode(node, index) {
    if (node.group) {
      console.log(index + ' -> group: ' + node.key);
    } else {
      console.log(
        index + ' -> data: ' + node.data.firstName + ', ' + node.data.lastName
      );
    }
  }

  autoSizeAll(skipHeader) {
    var allColumnIds = [];
    this.gridOptions.columnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.getColId);
    });
    this.gridOptions.columnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  getSelectedRows() {
    this.logger.log("getSelectedRows()"); // + JSON.stringify(this.agGrid));
    var focusedCell = this.agGrid.api.getFocusedCell();
    this.logger.log("getSelectedRows2()" + JSON.stringify(focusedCell.rowIndex + ", col:" + focusedCell.column));

    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    const selectedDataStringPresentation = selectedData
      .map(node => node.make + " " + node.model)
      .join(", ");
    alert(`Selected nodes: ${selectedDataStringPresentation}`);
    this.logger.log("Selected rows: " + selectedNodes);
    this.logger.log("Selected data: " + selectedData);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}

