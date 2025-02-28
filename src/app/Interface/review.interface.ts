export interface ReviewInterface {
  /**
   * Identifiant unique de la critique (optionnel, géré par le backend)
   */
  id?: number;

  /**
   * Identifiant de l'attraction concernée
   */
  attraction_id: number;

  /**
   * Note attribuée à l'attraction (ex : 1 à 5 étoiles)
   */
  note: number;

  /**
   * Commentaire laissé par l'utilisateur
   */
  commentaire: string;

  /**
   * Nom de l'utilisateur (optionnel)
   */
  nom?: string;

  /**
   * Prénom de l'utilisateur (optionnel)
   */
  prenom?: string;
}
