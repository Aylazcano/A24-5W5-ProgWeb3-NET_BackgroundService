using System.ComponentModel.DataAnnotations;

namespace BackgroundService.DTOs
{
    public class GameInfoDTO
    {
        // TODO (DONE): Include l'information à propos du nombre de victoire ET le coût d'un multiplier
        public int nbWins { get; set; }
        public int multiplierCost { get; set; }
    }
}
