import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from './LogoutButton';
import ListePlatsEnCommande from "./ListePlatsEnCommande.jsx";

const FormulaireAjoutPlat = ({ onAjouterPlat }) => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [nouveauPlat, setNouveauPlat] = useState({
        nom: '',
        prix: 0,
    });

    const handleAjouterPlat = () => {
        if (nouveauPlat.nom.trim() === '' || nouveauPlat.prix <= 0) {
            alert('Veuillez renseigner le nom et le prix du plat.');
            return;
        }

        if (!isAuthenticated) {
            alert('Vous devez être connecté pour ajouter un plat.');
            return;
        }

        const ajouterPlat = async () => {
            try {
                const accessToken = await getAccessTokenSilently();
                const response = await fetch('/api/plat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(nouveauPlat),
                });

                if (response.ok) {
                    const data = await response.json();
                    onAjouterPlat(data);
                    setNouveauPlat({ nom: '', prix: 0 });
                } else {
                    console.error('Erreur lors de l\'ajout du plat :', response.statusText);
                }
            } catch (error) {
                console.error('Erreur lors de l\'ajout du plat :', error);
            }
        };

        ajouterPlat();
    };

    return (
        <div>
            <h2>Ajouter un Nouveau Plat</h2>
            <form>
                <div className="form-group">
                    <label htmlFor="nomPlat">Nom du Plat:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nomPlat"
                        value={nouveauPlat.nom}
                        onChange={(e) => setNouveauPlat({ ...nouveauPlat, nom: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="prixPlat">Prix du Plat:</label>
                    <input
                        type="number"
                        className="form-control"
                        id="prixPlat"
                        value={nouveauPlat.prix}
                        onChange={(e) => setNouveauPlat({ ...nouveauPlat, prix: e.target.value })}
                        required
                    />
                </div>
                <button type="button" className="btn btn-primary" onClick={handleAjouterPlat}>
                    Ajouter Nouveau Plat
                </button>
            </form>
            <LogoutButton/>
            <ListePlatsEnCommande/>
        </div>
    );
};

export default FormulaireAjoutPlat;