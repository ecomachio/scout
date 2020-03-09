import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QuerySnapshot, DocumentData } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Player } from '../entity/player';

@Injectable({
    providedIn: 'root'
})
export class PlayerService {

    private playersCollection: AngularFirestoreCollection<Player>;
    private players: Observable<Player[]>;

    constructor(db: AngularFirestore) {
        this.playersCollection = db.collection<Player>('players');

        this.players = this.playersCollection.snapshotChanges().pipe(
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

    getPlayers() {
        return this.players;
    }

    getPlayersByCategory(categoryId): Promise<QuerySnapshot<DocumentData>> {
        return this.playersCollection.ref.where('category.id', '==', categoryId).get();
    }

    getPlayer(id) {
        return this.playersCollection.doc<Player>(id).valueChanges();
    }

    updatePlayer(todo: Player, id: string) {
        return this.playersCollection.doc(id).update(todo);
    }

    addPlayer(todo: Player) {
        return this.playersCollection.add({ ...todo });
    }

    removePlayer(id) {
        return this.playersCollection.doc(id).delete();
    }
}
