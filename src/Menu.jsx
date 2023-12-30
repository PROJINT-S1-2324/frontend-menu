import React, { useState, useEffect  } from 'react';
import Commande from './Commande';
import FormulaireAjoutPlat from './FormulaireAjoutPlat';
import { useAuth0 } from "@auth0/auth0-react";
import Authentification from './Authentification';


const Menu = () => {
    const [activeSection, setActiveSection] = useState(null);
    const [plats, setPlats] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { getAccessTokenSilently } = useAuth0();

    const { isAuthenticated: auth0IsAuthenticated } = useAuth0();

    const handleSectionClick = (section) => {
        setActiveSection(section);


        if (section === 'Authentification') {
            if (auth0IsAuthenticated) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        }
    };

    const handleAjouterNouveauPlat = (nouveauPlat) => {

        setPlats([...plats, { id: plats.length + 1, ...nouveauPlat }]);
    };
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

    useEffect(() => {
        fetcher();
    }, []);


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
                <button
                    type="button"
                    className={`btn ${activeSection === 'ListePlats' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => {
                        handleSectionClick('ListePlats');
                        fetcher();
                    }}
                >
                    Liste des Plats
                </button>
            </div>

            {activeSection && (
                <div>

                    {activeSection === 'Commande' && (
                        <div>
                            <h2>Contenu de la section Commande</h2>
                            <Commande plats={plats} />
                        </div>
                    )}

                    {activeSection === 'Authentification' && (
                        <div>
                            <h2>Contenu de la section Authentification</h2>
                            <p>Si vous êtes du personnel, veuillez vous authentifier.</p>
                            <p>Merci.</p>

                            {isAuthenticated ? (
                                <FormulaireAjoutPlat onAjouterPlat={handleAjouterNouveauPlat} />
                            ) : (
                                <Authentification />
                            )}
                        </div>
                    )}
                    {activeSection === 'ListePlats' && (
                        <div>
                            <h2>Liste des Plats</h2>
                            <ul>
                                {plats.map((plat) => (
                                    <li key={plat.id}>{plat.nom}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Menu;