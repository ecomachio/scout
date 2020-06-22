import { Statistic } from './statistic';
import { Class } from './class';
import { Category } from './category';
import { PositionEnum } from '../enum/Position.enum';

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
        this.category = {...new Category()}
     }
}
