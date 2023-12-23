import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

const ListePlatsEnCommande = () => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [platsEnCommande, setPlatsEnCommande] = useState([]);

    useEffect(() => {
        const chargerPlatsEnCommande = async () => {
            try {
                if (!isAuthenticated) {
                    console.error('Vous devez être connecté pour voir les plats en commande.');
                    return;
                }

                const accessToken = await getAccessTokenSilently();
                const response = await fetch("/api/commande", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setPlatsEnCommande(data);
                } else {
                    console.error('Erreur lors de la récupération des commandes depuis le backend:', response.statusText);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des commandes depuis le backend:', error);
            }
        };

        chargerPlatsEnCommande();
    }, [isAuthenticated, getAccessTokenSilently]);

    return (
        <div>
            <h2>Plats en Commande</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>Nom du Plat</th>
                    <th>Prix</th>
                    <th>Quantité</th>
                </tr>
                </thead>
                <tbody>
                {platsEnCommande.map((plat) => (
                    <tr key={plat.id}>
                        <td>{plat.nomPlat}</td>
                        <td>{plat.prixPlat} €</td>
                        <td>{plat.quantite}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListePlatsEnCommande;