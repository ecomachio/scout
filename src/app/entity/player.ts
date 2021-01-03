import { Class } from './class';
import { Category } from './category';

export class Player {

    id: string;
    name: string;
    address: string;
    document: string;
    phone: number;
    birthdate: Date;
    responsible: string;
    homePhone: string;
    category: Category;
    class: Class;
    shirtNumber: number;
    position: string;
    preferredFoot: string;
    picture: Blob;

    constructor() {
        this.category = {...new Category()};
     }
}
