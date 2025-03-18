from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Autorise toutes les origines

# ⚙️ Données simulées (à remplacer par une vraie base de données)
attractions = [
    {"attraction_id": 1, "nom": "Montagnes Russes", "description": "Un grand huit rapide", "difficulte": 5, "visible": True},
    {"attraction_id": 2, "nom": "Grande Roue", "description": "Une vue panoramique", "difficulte": 2, "visible": True},
]

reviews = [
    {"id": 1, "attraction_id": 1, "note": 5, "commentaire": "Incroyable !", "nom": "Alice", "prenom": "D."},
    {"id": 2, "attraction_id": 2, "note": 3, "commentaire": "Sympa mais trop lent.", "nom": "Bob", "prenom": "M."}
]

# ⚙️ Simule une base d’administrateurs (à remplacer par une vraie BDD)
admins = {
    "admin@example.com": "admin123"
}

# 🏗️ Route de connexion admin
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if email in admins and admins[email] == password:
        return jsonify({"message": "Connexion réussie", "token": "admin-token"}), 200
    else:
        return jsonify({"error": "Identifiants incorrects"}), 401

# 🏗️ Route pour obtenir les attractions visibles
@app.route('/attraction/visible', methods=['GET'])
def get_visible_attractions():
    visibles = [attr for attr in attractions if attr["visible"]]
    return jsonify(visibles)

# 🏗️ Route pour obtenir les critiques d'une attraction
@app.route('/attraction/<int:attraction_id>/reviews', methods=['GET'])
def get_reviews(attraction_id):
    result = [rev for rev in reviews if rev["attraction_id"] == attraction_id]
    return jsonify(result)

# 🏗️ Route pour ajouter une critique
@app.route('/reviews', methods=['POST'])
def add_review():
    new_review = request.json
    new_review["id"] = len(reviews) + 1
    reviews.append(new_review)
    return jsonify({"message": "Critique ajoutée avec succès"}), 201

# 🏗️ Route pour mettre à jour la visibilité d'une attraction
@app.route('/attraction/<int:attraction_id>/visibility', methods=['PATCH'])
def update_visibility(attraction_id):
    data = request.json
    for attraction in attractions:
        if attraction["attraction_id"] == attraction_id:
            attraction["visible"] = data.get("visible", attraction["visible"])
            return jsonify({"message": "Visibilité mise à jour avec succès"}), 200
    return jsonify({"error": "Attraction non trouvée"}), 404

# 🚀 Lancer le serveur Flask
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5001)  # 👈 Autorise les connexions externes
