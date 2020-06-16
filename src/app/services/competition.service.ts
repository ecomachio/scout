import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Competition } from '../entity/competition';

@Injectable({
    providedIn: 'root'
})
export class CompetitionService {

    private competitionsCollection: AngularFirestoreCollection<Competition>;
    private competitions: Observable<Competition[]>;

    constructor(db: AngularFirestore) {
        this.competitionsCollection = db.collection<Competition>('competitions', ref => ref.orderBy('name'));

        this.competitions = this.competitionsCollection.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;                  

                    data.start = new Date(data.start);
                    data.end = new Date(data.start);

                    return { id, ...data };
                });
            })
        );
    }

    getCompetitionsCollection() {
        return this.competitionsCollection;
    }

    getCompetitions() {
        return this.competitions;
    }

    getCompetition(id) {
        return this.competitionsCollection.doc<Competition>(id).get();
    }

    updateCompetition(competition: Competition, id: string) {
        return this.competitionsCollection.doc<Competition>(id).update(competition);
    }

    addCompetition(competition: Competition) {
        return this.competitionsCollection.add({ ...competition });
    }

    removeCompetition(id) {
        return this.competitionsCollection.doc(id).delete();
    }
}
