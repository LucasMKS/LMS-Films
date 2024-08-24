import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Image } from 'primereact/image';
import { useFavorites } from '../context/FavoritesContext';
import AuthService from '../service/AuthService'; // Adapte conforme necessário
import posterImagem from '../../assets/LMS_Poster.png'; // Ajuste o caminho conforme necessário

const FavoritePage = ({ onLogout }) => {
    const [favorites, setFavorites] = useState([]);
    const [selectedContent, setSelectedContent] = useState(null);
    const [details, setDetails] = useState({});
    const [open, setOpen] = useState(false);
    const toast = useRef(null);

    const { favorites: favoriteMovies, toggleFavorite, getFavoriteStatus } = useFavorites();

    useEffect(() => {
        loadFavorites();
    }, [favoriteMovies]);

    const loadFavorites = async () => {
        try {
            // Aqui você pode obter a lista de filmes favoritos do backend
            const favoriteIds = Object.keys(favoriteMovies).filter(id => favoriteMovies[id]);
            if (favoriteIds.length > 0) {
                const responses = await Promise.all(favoriteIds.map(id => AuthService.getMovieById(id)));
                setFavorites(responses);
            } else {
                setFavorites([]);
            }
        } catch (error) {
            showToast('error', 'Erro', error.message);
        }
    };

    const handleClickOpen = async (content) => {
        setSelectedContent(content);
        if (content) {
            try {
                const response = await AuthService.details(content.id);
                setDetails(response);
            } catch (error) {
                showToast('error', 'Erro', error.message);
            }
        }
        setOpen(true);
    };

    const handleFavoriteToggle = async (movieId) => {
        try {
            const newFavoriteStatus = !getFavoriteStatus(movieId);
            toggleFavorite(movieId, newFavoriteStatus);
            await AuthService.toggleFavorite(movieId, newFavoriteStatus);
        } catch (error) {
            toggleFavorite(movieId, !(favoriteMovies[movieId] || false));
            showToast('error', 'Erro', error.message);
        }
    };

    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
    };

    return (
        <div className="p-4">
            <h1>Favoritos</h1>
            <div className="grid">
                {favorites.length === 0 ? (
                    <p className="text-center">Nenhum filme favoritado.</p>
                ) : (
                    favorites.map(movie => (
                        <div key={movie.id} className="col-12 md:col-4 lg:col-3 p-2">
                            <div className="card">
                                <Image
                                    src={movie.posterPath || posterImagem}
                                    alt={movie.title}
                                    className="card-img-top"
                                    placeholder={<Image src={posterImagem} alt="Poster Placeholder" />}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{movie.title}</h5>
                                    <Button
                                        label="Detalhes"
                                        onClick={() => handleClickOpen(movie)}
                                        className="p-button-secondary"
                                    />
                                    <Button
                                        label={getFavoriteStatus(movie.id) ? 'Desfavoritar' : 'Favoritar'}
                                        icon={getFavoriteStatus(movie.id) ? 'pi pi-heart' : 'pi pi-heart-fill'}
                                        className="p-button-danger ml-2"
                                        onClick={() => handleFavoriteToggle(movie.id)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectedContent && (
                <Dialog
                    header={selectedContent.title}
                    visible={open}
                    style={{ width: '40vw' }}
                    onHide={() => setOpen(false)}
                >
                    <div>
                        <p className="italic">{details.tagline}</p>
                        <Image
                            src={selectedContent.posterPath || posterImagem}
                            alt={selectedContent.title}
                            className="w-full"
                            placeholder={<Image src={posterImagem} alt="Poster Placeholder" />}
                        />
                        <p>{details.overview}</p>
                    </div>
                </Dialog>
            )}
        </div>
    );
};

export default FavoritePage;
