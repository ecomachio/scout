import { Statistic } from './statistic';
import { Class } from './class';
import { Category } from './category';
import { PositionEnum } from '../enum/Position.enum';

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
    position: string;
    preferredFoot: FootEnum;
    picture: Blob;

    constructor() { }
}
