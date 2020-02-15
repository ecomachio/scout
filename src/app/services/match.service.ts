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
    }

    getCompetitionMatches(competitionId: string) {
        return this.matchsCollection.ref.where('id', '==', competitionId).get();
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
