import { AccountService } from './services/account.service';
import { Component } from '@angular/core';

// TODO (DONE): On doit commencer par ajouter signalr dans les node_modules: npm install @microsoft/signalr
// Ensuite on inclut la librairie
import * as signalR from "@microsoft/signalr"

interface RoundResult{
  winners:string[],
  nbClicks:number
}

interface GameInfo{
  multiplierCost:number,
  nbWins:number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngBackgroundService';

  baseUrl = "https://localhost:7056/";

  // TODO (DONE): Ajouter une variable nbWins
  nbWins = 0;

  // Connexion SignalR
  private hubConnection?: signalR.HubConnection

  isConnected = false;
  nbClicks = 0;
  // TODO (DONE): Ajouter 3 variables: Le multiplier, le multiplierCost, mais également le multiplierIntialCost pour remettre à jour multiplierCost après chaque fin de round (ou sinon on peut passer l'information dans l'appel qui vient du Hub!)
  multiplier = 1;
  multiplierCost = 0;
  mutliplierInitialCost = 0;

  constructor(public account:AccountService){
  }

  Increment() {
    //TODO (DONE): Augmenter le nbClicks par la valeur du multiplicateur
    this.nbClicks += this.multiplier;
    // Envoie la requête au serveur via SignalR pour effectuer l'incrément
    this.hubConnection!.invoke('Increment')
  }

  BuyMultiplier() {
    // TODO (DONE): Implémenter la méthode qui permet d'acheter un niveau de multiplier (Appel au Hub!)
    if(this.nbClicks >= this.multiplierCost){
      this.hubConnection!.invoke('BuyMultiplier')
      this.nbClicks -= this.multiplierCost;
      this.multiplierCost *= 2;
      this.multiplier *= 2;
    }

  }

  async register(){
    try{
      await this.account.register();
    }
    catch(e){
      alert("Erreur pendant l'enregistrement!!!!!");
      return;
    }
    alert("L'enregistrement a été un succès!");
  }

  async login(){
    await this.account.login();
  }

  async logout(){
    await this.account.logout();

    if(this.hubConnection?.state == signalR.HubConnectionState.Connected)
      this.hubConnection.stop();
    this.isConnected = false;
  }

  isLoggedIn() : Boolean{
    return this.account.isLoggedIn();
  }

  // Méthode pour établir une connexion avec le Hub SignalR
  connectToHub() {
    // Création d'une nouvelle connexion SignalR avec l'URL du serveur et le token d'accès
    this.hubConnection = new signalR.HubConnectionBuilder()
                              .withUrl(this.baseUrl + 'game', { accessTokenFactory: () => sessionStorage.getItem("token")! })
                              .build();

    // Vérification de la connexion SignalR                          
    if(!this.hubConnection)
    {
      console.log("Impossible de créer un HubConnection???");
      return;
    }

    // Gestion de l'événement 'GameInfo' envoyé par le serveur via SignalR
    this.hubConnection.on('GameInfo', (data:GameInfo) => {
      this.isConnected = true;
      // TODO (DONE): Mettre à jour les variables pour le coût du multiplier et le nbWins
      this.mutliplierInitialCost = data.multiplierCost;
      this.multiplierCost = this.mutliplierInitialCost;
      this.nbWins = data.nbWins;
    });

    this.hubConnection.on('EndRound', (data:RoundResult) => {
      this.nbClicks = 0;
      // Mise à jour du nombre de victoires et du coût du multiplicateur en fonction des données envoyées par le serveur

      // TODO (DONE): Reset du multiplierCost et le multiplier
      this.multiplierCost = this.mutliplierInitialCost;
      this.multiplier = 1;

      // TODO (DONE): Si le joueur a gagné, on augmene nbWins 
      if(data.winners.indexOf(this.account.username) >= 0)
        this.nbWins++;

      if(data.nbClicks > 0){
        let phrase = " a gagné avec ";
        if(data.winners.length > 1)
          phrase = " ont gagnées avec "
        alert(data.winners.join(", ") + phrase + data.nbClicks + " clicks!");
      }
      else{
        alert("Aucun gagnant...");
      }
    });

    // Démarre la connexion au Hub SignalR
    this.hubConnection
      .start()
      .then(() => {
        console.log("Connecté au Hub");
      })
      .catch(err => console.log('Error while starting connection: ' + err))
  }
}
