import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QuerySnapshot, DocumentData } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Action } from '../entity/action';

@Injectable({
    providedIn: 'root'
})
export class ActionService {

    private actionsCollection: AngularFirestoreCollection<Action>;
    private actions: Observable<Action[]>;

    constructor(db: AngularFirestore) {
        this.actionsCollection = db.collection<Action>('actions');

        this.actions = this.actionsCollection.snapshotChanges().pipe(
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

    getActions() {
        return this.actions;
    }

    getActionsByMatch(matchId){
        return this.actionsCollection.ref.where('match.id', '==', matchId).get();
    }

    getAction(id) {
        return this.actionsCollection.doc<Action>(id).valueChanges();
    }

    updateAction(action: Action, id: string) {
        return this.actionsCollection.doc(id).update(action);
    }

    addAction(action: Action) {        
        return this.actionsCollection.add({ ...action });
    }

    removeAction(id) {
        return this.actionsCollection.doc(id).delete();
    }    
}
