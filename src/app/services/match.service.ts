import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Match } from '../entity/match';
import { UtilsService } from './utils.service';

@Injectable({
    providedIn: 'root'
})
export class MatchService {

    private matchsCollection: AngularFirestoreCollection<Match>;
    private matchs: Observable<Match[]>;

    constructor(
        db: AngularFirestore,
        private utilsService: UtilsService,
    ) {
        this.matchsCollection = db.collection<Match>('matchs', ref => ref.orderBy('name'));

        this.matchs = this.matchsCollection.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    console.log({ id, ...data });
                    
                    /* essa linha ficou boa kkkk */
                    data.date = new Date(data.date);

                    return { id, ...data };
                });
            })
        );
    }

    getMatchs() {
        return this.matchs;
    }

    getMatchesByCompetition(competitionId: string): any {
        console.log(competitionId);
        return this.matchsCollection.ref.where('competitionId', '==', competitionId).get();
    }

    getMatch(id) {
        return this.matchsCollection.doc<Match>(id).valueChanges();
    }

    getMatchPromise(id) {
        return this.matchsCollection.doc<Match>(id).get().toPromise();
    }

    updateMatch(match: Match, id: string) {
        return this.matchsCollection.doc(id).update(match);
    }

    addMatch(match: Match) {
        return this.matchsCollection.add(this.utilsService.toPlainObject(match));
    }

    removeMatch(id) {
        return this.matchsCollection.doc(id).delete();
    }
}
