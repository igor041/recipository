import { UserRole } from "@root/app/auth/_models";

export class Menu {
    constructor(public id: number,
                public title: string,
                public routerLink: string,
                public href: string, 
                public target: string,
                public hasSubMenu: boolean,
                public parentId: number,
                public allowedRoles: UserRole[] = null) { }
} 