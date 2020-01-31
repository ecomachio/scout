import { Statistic } from './statistic';
import { Class } from './class';
import { Category } from './category';

export class Player {

    id: number;
    nane: string;
    lastname: string;
    address: string;
    cpf: number;
    document: string;
    phone: number;
    birthdate: Date;
    responsible: string;
    homePhone: string;
    category: Category;
    class: Class;
    shirtNumber: number;
    position: PositionEnum;
    preferredFoot: FootEnum;
    picture: Blob;

    constructor() { }
}
