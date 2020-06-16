import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Team } from '../entity/team';

@Injectable({
    providedIn: 'root'
})
export class TeamService {

    private teamsCollection: AngularFirestoreCollection<Team>;
    private teams: Observable<Team[]>;

    constructor(db: AngularFirestore) {
        this.teamsCollection = db.collection<Team>('teams', ref => ref.orderBy('name'));

        this.teams = this.teamsCollection.snapshotChanges().pipe(
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

    getTeamsCollection() {
        return this.teamsCollection;
    }

    getTeams() {
        return this.teams;
    }

    getTeam(id) {
        return this.teamsCollection.doc<Team>(id).get();
    }

    updateTeam(team: Team, id: string) {
        return this.teamsCollection.doc<Team>(id).update(team);
    }

    addTeam(team: Team) {
        return this.teamsCollection.add({ ...team });
    }

    removeTeam(id) {
        return this.teamsCollection.doc(id).delete();
    }
}
