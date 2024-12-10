using BackgroundService.Data;
using BackgroundService.DTOs;
using BackgroundService.Models;
using BackgroundService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace BackgroundService.Hubs
{
    // Le Hub SignalR permet la communication en temps réel entre le serveur et les clients (application Angular).
    [Authorize]
    public class GameHub : Hub
    {
        private Game _game;
        private BackgroundServiceContext _backgroundServiceContext;

        public GameHub(Game game, BackgroundServiceContext backgroundServiceContext)
        {
            _game = game;
            _backgroundServiceContext = backgroundServiceContext;
        }

        // Cette méthode est appelée lorsqu'un utilisateur se connecte au Hub SignalR.
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            _game.AddUser(Context.UserIdentifier!);

            Player player = _backgroundServiceContext.Player.Where(p => p.UserId == Context.UserIdentifier!).Single();

            // Envoi d'informations au client (Angular) via SignalR.
            await Clients.Caller.SendAsync("GameInfo", new GameInfoDTO()
            {
                // TODO (DONE): Remplir l'information avec les 2 nouveaux features (nbWins et multiplierCost)
                nbWins = player.NbWins,
                multiplierCost = Game.MULTIPLIER_BASE_PRICE

            });
        }

        // Cette méthode est appelée lorsque l'utilisateur se déconnecte du Hub SignalR.
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _game.RemoveUser(Context.UserIdentifier!);
            await base.OnDisconnectedAsync(exception);
        }

        public void Increment()
        {
            _game.Increment(Context.UserIdentifier!);
        }

        // Ajouter une méthode pour pouvoir acheter un multiplier
    }
}
