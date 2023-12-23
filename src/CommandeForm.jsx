import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

const Commande = () => {
    const { getAccessTokenSilently } = useAuth0();

    const [commande, setCommande] = useState({
        plat_id: '',
        plat: {},
        quantite: 1,
        nomPlat: '',
        prixPlat: 0,
    });

    const [plats, setPlats] = useState([]);
    const [commandes, setCommandes] = useState([]); // Tableau de commandes

    useEffect(() => {
        const fetcher = async () => {
            try {
                const accessToken = await getAccessTokenSilently();
                const response = await fetch("/api/plat", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                const data = await response.json();
                setPlats(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des plats depuis le backend:", error);
            }
        };

        fetcher();
    }, [getAccessTokenSilently]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "plat_id") {
            const selectedPlat = plats.find((plat) => plat.id === parseInt(value, 10));
            setCommande({
                ...commande,
                plat_id: parseInt(value, 10),
                plat: selectedPlat,
                nomPlat: selectedPlat.nom,
                prixPlat: selectedPlat.prix,
            });
        } else {
            setCommande({ ...commande, [name]: value });
        }
    };

    const envoyerCommande = async () => {
        try {
            const accessToken = await getAccessTokenSilently();
            const response = await fetch("/api/commande", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(commande),
            });

            if (response.status === 401) {
                console.error("Erreur d'authentification lors de l'envoi de la commande.");
                // Gérer l'erreur d'authentification ici
                return;
            }

            const data = await response.json();
            console.log("Réponse du serveur:", data);

            // Ajouter la commande à la liste de commandes
            setCommandes([...commandes, data]);

            // Réinitialiser le formulaire après l'envoi de la commande
            setCommande({
                plat_id: '',
                plat: {},
                quantite: 1,
                nomPlat: '',
                prixPlat: 0,
            });
        } catch (error) {
            console.error("Erreur lors de l'envoi de la commande au backend:", error);
        }
    };

    const handlePaiement = () => {
        // Réinitialiser la commande et la liste de commandes
        setCommande({
            plat_id: '',
            plat: {},
            quantite: 1,
            nomPlat: '',
            prixPlat: 0,
        });
        setCommandes([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        envoyerCommande();
    };

    // Calculer le montant total
    const montantTotal = commandes.reduce((total, cmd) => {
        return total + cmd.prixPlat * cmd.quantite;
    }, 0);

    return (
        <div>
            <h2>Formulaire de Commande</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="plat_id">Plat :</label>
                    <select
                        className="form-control"
                        id="plat_id"
                        name="plat_id"
                        value={commande.plat_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Sélectionnez un plat</option>
                        {plats.map((plat) => (
                            <option key={plat.id} value={plat.id}>
                                {plat.nom} - {plat.prix} €
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="quantite">Quantité :</label>
                    <input
                        type="number"
                        className="form-control"
                        id="quantite"
                        name="quantite"
                        value={commande.quantite}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Ajouter à la commande
                </button>
            </form>
            {commandes.length > 0 && (
                <div>
                    <h3>Détails de la commande :</h3>
                    <ul>
                        {commandes.map((cmd, index) => (
                            <li key={index}>
                                Plat : {cmd.nomPlat}
                                <br />
                                Quantité : {cmd.quantite}
                                <br />
                                Montant total : {cmd.prixPlat * cmd.quantite} €
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <h3>Montant total de la commande : {montantTotal} €</h3>
            <button className="btn btn-danger" onClick={handlePaiement}>
                Paiement
            </button>
        </div>
    );
};

export default Commande;