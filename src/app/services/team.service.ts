import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QueryDocumentSnapshot,
} from "angularfire2/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Team } from "../entity/team";
import { MatchService } from "./match.service";
import { Match } from "../entity/match";

@Injectable({
  providedIn: "root",
})
export class TeamService {
  private teamsCollection: AngularFirestoreCollection<Team>;
  private teams: Observable<Team[]>;

  constructor(db: AngularFirestore, private matchService: MatchService) {
    this.teamsCollection = db.collection<Team>("teams", (ref) =>
      ref.orderBy("name")
    );

    this.teams = this.teamsCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          // console.log({ id, ...data });
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

  async updateTeam(team: Team, id: string) {
    (await this.matchService.getAllMatchs()).docs
      .map((m: QueryDocumentSnapshot<Match>) => {
        const id = m.id;
        return { id, ...m.data() } as Match;
      })
      .filter((m) => m.homeTeam.id === id || m.awayTeam.id === id)
      .forEach((m) => {
        if (id === m.awayTeam.id) {
          m.awayTeam = team;
        }
        if (id === m.homeTeam.id) {
          m.homeTeam = team;
        }
        this.matchService
          .updateMatch(m, m.id)
          .then((res) => console.log("times atualizados dentro das partidas"));
      });

    return this.teamsCollection.doc<Team>(id).update(team);
  }

  getMainTeam() {
    return this.teamsCollection.ref.where("isMainTeam", "==", true).get();
  }

  addTeam(team: Team) {
    return this.teamsCollection.add({ ...team });
  }

  removeTeam(id) {
    return this.teamsCollection.doc(id).delete();
  }
}
