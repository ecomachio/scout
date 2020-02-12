import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Match } from '../entity/match';

@Injectable({
    providedIn: 'root'
})
export class MatchService {

    private matchsCollection: AngularFirestoreCollection<Match>;
    private matchs: Observable<Match[]>;

    constructor(db: AngularFirestore) {
        this.matchsCollection = db.collection<Match>('matchs');

        this.matchs = this.matchsCollection.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    console.log({ id, ...data });
                    return { id, ...data };
                });
            })
        );
    }

    getMatchs() {
        return this.matchs;
    }

    getMatch(id) {
        return this.matchsCollection.doc<Match>(id).valueChanges();
    }

    updateMatch(match: Match, id: string) {
        return this.matchsCollection.doc(id).update(match);
    }

    addMatch(match: Match) {
        return this.matchsCollection.add({ ...match });
    }

    removeMatch(id) {
        return this.matchsCollection.doc(id).delete();
    }
}
