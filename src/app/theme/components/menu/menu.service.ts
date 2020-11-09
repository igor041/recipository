import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Menu } from './menu.model';
import { verticalMenuItems, horizontalMenuItems } from './menu';
import { AccountService } from '@root/app/auth/_services';
import { UserRole } from '@root/app/auth/_models';

@Injectable()
export class MenuService {

  constructor(private location: Location,
    private router: Router,
    private accountService: AccountService) { }

  public getVerticalMenuItems(): Array<Menu> {
    return verticalMenuItems;
  }

  public getHorizontalMenuItems(): Array<Menu> {
    return this.getAuthorizedMenuItems(horizontalMenuItems);
  }

  // Filters out menu items that are not allowed for current user's role
  public getAuthorizedMenuItems(menuItems: Menu[]) {
    let result: Menu[] = menuItems;
    let userRole: UserRole = this.accountService.userValue?.role;

    result = result.filter(i => {
      if (i.allowedRoles) {
        if (userRole) {
          // If both userRole and allowedRoles are defined, figure out if they match. 
          return i.allowedRoles.includes(userRole);
        } else {
          // If allowedRoles are specified, but user is not logged in, err on the side of caution and
          // DO NOT allow this menu item to be rendered.
          return false;
        }
      }else{
        // If allowedRoles are NOT defined, display menu item.
        return true;
      }
      // Default - should not happen
      return false;
    });

    return result;
  }

  public expandActiveSubMenu(menu: Array<Menu>) {
    let url = this.location.path();
    let routerLink = decodeURIComponent(url);
    let activeMenuItem = menu.filter(item => item.routerLink === routerLink);
    if (activeMenuItem[0]) {
      let menuItem = activeMenuItem[0];
      while (menuItem.parentId != 0) {
        let parentMenuItem = menu.filter(item => item.id == menuItem.parentId)[0];
        menuItem = parentMenuItem;
        this.toggleMenuItem(menuItem.id);
      }
    }
  }

  public toggleMenuItem(menuId) {
    let menuItem = document.getElementById('menu-item-' + menuId);
    let subMenu = document.getElementById('sub-menu-' + menuId);
    if (subMenu) {
      if (subMenu.classList.contains('show')) {
        subMenu.classList.remove('show');
        menuItem.classList.remove('expanded');
      }
      else {
        subMenu.classList.add('show');
        menuItem.classList.add('expanded');
      }
    }
  }

  public closeOtherSubMenus(menu: Array<Menu>, menuId) {
    let currentMenuItem = menu.filter(item => item.id == menuId)[0];
    menu.forEach(item => {
      if ((item.id != menuId && item.parentId == currentMenuItem.parentId) || (currentMenuItem.parentId == 0 && item.id != menuId)) {
        let subMenu = document.getElementById('sub-menu-' + item.id);
        let menuItem = document.getElementById('menu-item-' + item.id);
        if (subMenu) {
          if (subMenu.classList.contains('show')) {
            subMenu.classList.remove('show');
            menuItem.classList.remove('expanded');
          }
        }
      }
    });
  }

  public closeAllSubMenus() {
    verticalMenuItems.forEach(item => {
      let subMenu = document.getElementById('sub-menu-' + item.id);
      let menuItem = document.getElementById('menu-item-' + item.id);
      if (subMenu) {
        if (subMenu.classList.contains('show')) {
          subMenu.classList.remove('show');
          menuItem.classList.remove('expanded');
        }
      }
    });
  }


}