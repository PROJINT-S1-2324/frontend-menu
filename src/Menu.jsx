import React, { useState } from 'react';
import Commande from './Commande';
import FormulaireAjoutPlat from './FormulaireAjoutPlat';
import { useAuth0 } from "@auth0/auth0-react";
import Authentification from './Authentification';

const Menu = () => {
    const [activeSection, setActiveSection] = useState(null);
    const [plats, setPlats] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Variable d'état pour suivre l'authentification

    const { isAuthenticated: auth0IsAuthenticated } = useAuth0();

    const handleSectionClick = (section) => {
        setActiveSection(section);

        // Vérifier si l'utilisateur est authentifié avant d'autoriser l'ajout de plat
        if (section === 'Authentification') {
            if (auth0IsAuthenticated) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        }
    };

    const handleAjouterNouveauPlat = (nouveauPlat) => {
        // Ajouter le nouveau plat à la liste des plats existants
        setPlats([...plats, { id: plats.length + 1, ...nouveauPlat }]);
    };

    return (
        <div>
            <h1>Menu du Restaurant</h1>
            <div className="btn-group">
                <button
                    type="button"
                    className={`btn ${activeSection === 'Commande' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleSectionClick('Commande')}
                >
                    Commande
                </button>
                <button
                    type="button"
                    className={`btn ${activeSection === 'Authentification' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleSectionClick('Authentification')}
                >
                    Authentification
                </button>
            </div>

            {activeSection && (
                <div>
                    {/* Contenu spécifique à chaque section */}
                    {activeSection === 'Commande' && (
                        <div>
                            <h2>Contenu de la section Commande</h2>
                            <Commande plats={plats} /> {/* Passer la liste des plats comme une propriété */}
                        </div>
                    )}

                    {activeSection === 'Authentification' && (
                        <div>
                            <h2>Contenu de la section Authentification</h2>
                            {isAuthenticated ? (
                                <FormulaireAjoutPlat onAjouterPlat={handleAjouterNouveauPlat} />
                            ) : (
                                <Authentification />
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Menu;