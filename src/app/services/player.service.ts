import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Player } from '../entity/player';

@Injectable({
    providedIn: 'root'
})
export class PlayerService {
    private todosCollection: AngularFirestoreCollection<Player>;

    private todos: Observable<Player[]>;

    constructor(db: AngularFirestore) {
        this.todosCollection = db.collection<Player>('players');

        this.todos = this.todosCollection.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.data;
                    return { id, ...data };
                });
            })
        );
    }

    getPlayers() {
        return this.todos;
    }

    getPlayer(id) {
        return this.todosCollection.doc<Player>(id).valueChanges();
    }

    updatePlayer(todo: Player, id: string) {
        return this.todosCollection.doc(id).update(todo);
    }

    addPlayer(todo: Player) {
        return this.todosCollection.add({...todo});
    }

    removePlayer(id) {
        return this.todosCollection.doc(id).delete();
    }
}
