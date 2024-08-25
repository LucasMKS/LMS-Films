import React, { useState, useEffect, useRef } from 'react';
import AuthService from '../service/AuthService';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { Image } from 'primereact/image';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { BlockUI } from 'primereact/blockui';
import { Paginator } from 'primereact/paginator';
import { ToggleButton } from 'primereact/togglebutton';
import { Sidebar } from 'primereact/sidebar';
import { Divider } from 'primereact/divider';

import { Heart } from 'lucide-react';
import { HeartOff } from 'lucide-react';
import posterImagem from '../../assets/LMS_Poster.png';
import bgImagem from '../../assets/LMS-BG.png';
import logo from '../../assets/logo.png';

const SearchPage = ({ onLogout }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [details, setDetails] = useState({});
    const [selectedContent, setSelectedContent] = useState(null);
    const [open, setOpen] = useState(false);
    const [valueRate, setValueRate] = useState('');
    const [blocked, setBlocked] = useState(false);
    const [first, setFirst] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [favorites, setFavorites] = useState({});
    const [favoritesList, setFavoritesList] = useState({})
    const [visibleLeft, setVisibleLeft] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        setBlocked(true);
        loadPopularMovies(1);
        setSearchTerm("");
    }, []);

    useEffect(() => {
        if (blocked) {
            setTimeout(() => setBlocked(false), 1000);
        }
    }, [blocked]);

    const handleClickOpen = async (content) => {
        setSelectedContent(content);
        if (content) {
            try {
                const response = await AuthService.details(content.id);
                setDetails(response);
                fetchFavoriteStatus(content.id);
            } catch (error) {
                showError(error.message);
            }
        }
        setOpen(true);
    };

    const handleFavoriteDetails = async (content) => {
        setSearchTerm(content.title);
        try {
            const response = await AuthService.search(content.title); 
            setResults(response && response.length > 0 ? response : []);
            if (!response || response.length === 0) {
                showError("Nenhum resultado encontrado");
            }
        } catch (error) {
            setResults([]);
            showError(error.message); 
        }
    };


    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await AuthService.search(searchTerm);
            setResults(response && response.length > 0 ? response : []);
            if (!response || response.length === 0) {
                loadPopularMovies(1);
            }
        } catch (error) {
            setResults([]);
            showError(error.message);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setOpen(false);

        try {
            let ratingToSend = valueRate;

            if (ratingToSend === null || ratingToSend === '') {
                ratingToSend = 5;
            }
            const response = await AuthService.sendRating(selectedContent.title, selectedContent.id, ratingToSend, selectedContent.poster_path);
            response.mensagem ? showSuccess(response.mensagem) : showError(response.error);
            setValueRate('');
        } catch (error) {
            showError(error.message);
        }
    };

    const loadPopularMovies = async (page) => {
        try {
            const response = await AuthService.popular(page);
            setResults(response);
            setTotalRecords(500);
        } catch (error) {
            setResults([]);
            showError(error.message);
        }
    };

    const handleFavoriteToggle = async (movieId, title) => {
        try {
            const currentFavoriteStatus = favorites[movieId] || false;
            const newFavoriteStatus = !currentFavoriteStatus;

            setFavorites(prev => ({
                ...prev,
                [movieId]: newFavoriteStatus
            }));
            await AuthService.toggleFavorite(movieId, title, newFavoriteStatus);

        } catch (error) {
            setFavorites(prev => ({
                ...prev,
                [movieId]: !(favorites[movieId] || false)
            }));
            showError(error.message);
        }
    };


    const fetchFavoriteStatus = async (movieId) => {
        try {
            const response = await AuthService.getFavoriteStatus(movieId);
            setFavorites(prev => ({
                ...prev,
                [movieId]: response.favorite
            }));
        } catch (error) {
            console.error('Failed to fetch favorite status:', error);
        }
    };


    const onPageChange = (event) => {
        setFirst(event.first);
        const pageNumber = Math.ceil(event.first / 20) + 1;
        loadPopularMovies(pageNumber);
    };

    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
    };

    const showError = (message) => showToast('error', 'Error', message);
    const showSuccess = (message) => showToast('success', 'Success', message);

    const menuItems = [
        {
            label: 'Filmes',
            icon: 'pi pi-video',
            items: [
                { label: 'Pesquisar', url: '/filmes', icon: 'pi pi-search' },
                { label: 'Avaliados', url: '/filmes/avaliados', icon: 'pi pi-star-fill' }
            ]
        },
        {
            label: 'Series',
            icon: 'pi pi-play-circle',
            items: [
                { label: 'Pesquisar', url: '/series', icon: 'pi pi-search' },
                { label: 'Avaliados', url: '/series/avaliados', icon: 'pi pi-star-fill' }
            ]
        },
    ];

    const getAllFavorites = async () => {
        try {
            const response = await AuthService.getAllFavorites();
            setFavoritesList(response.favoriteList || []);
            if (response.error) showToast('error', 'Error', response.error);
        } catch (error) {
            setFavoritesList([]);
            showToast('error', 'Error', error.message);
        }
    };

    const handleOpenSidebar = async () => {
        getAllFavorites()
        setVisibleLeft(true);

    };

    const menuStart = <img alt="logo" src={logo} height="40" className="mr-2 h-14" />;
    const menuEnd = (
        <div className="flex align-items-center gap-2 items-center">
            <form onSubmit={handleSearch}>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText placeholder="Pesquisar" type="text" className="w-8rem sm:w-auto" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </IconField>
            </form>
            <Button icon={<Heart className='mr-2' />} label="Favoritos" onClick={() => handleOpenSidebar()} />
            <Button label="Sair" icon="pi pi-arrow-right" iconPos="right" onClick={onLogout} />
        </div>
    );

    const customHeader = (
        <div className="flex align-items-center gap-2">
            <Heart className='text-red-500' />
            <span className="font-bold">Favoritos</span>
        </div>
    );

    return (
        <div className="justify-center items-center text-center" style={{
            backgroundImage: `url(${bgImagem})`,
            backgroundBlendMode: "overlay",
            minHeight: "100vh",
            overflowY: "auto",
        }}>
            <BlockUI blocked={blocked} fullScreen />
            <Toast ref={toast} className='mt-12' />
            <Sidebar header={customHeader} visible={visibleLeft} position="right" onHide={() => setVisibleLeft(false)}>
                {favoritesList && favoritesList.length > 0 && (
                    favoritesList.map((item) => (
                        <>
                            <Button label={item.title} severity="secondary" text className="w-full mt-2" onClick={() => handleFavoriteDetails(item)} />
                            <Divider />
                        </>
                    ))
                )}
            </Sidebar>
            <div className="fixed top-0 left-0 w-full z-50">
                <Menubar model={menuItems} start={menuStart} end={menuEnd} className='h-16' />
            </div>

            <div className='text-center'>
                <div className="min-h-screen flex flex-col items-center py-24">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-5/6">
                        {results.map((item) => (
                            <Card
                                key={item.movieId}
                                onClick={() => handleClickOpen(item)}
                                title={item.title}
                                header={() => (
                                    <div className="relative">
                                        <Image
                                            src={item.poster_path ? `https://image.tmdb.org/t/p/w200/${item.poster_path}` : posterImagem}
                                            alt="Image"
                                            className="w-full h-auto"
                                        />

                                    </div>

                                )}
                                className="h-full flex flex-col justify-between transform transition-transform duration-300 hover:scale-105"
                            >
                                <p>Ano: {new Date(item.release_date).getFullYear()}</p>
                            </Card>
                        ))}
                    </div>
                    <Paginator
                        first={first}
                        rows={20}
                        totalRecords={totalRecords}
                        onPageChange={onPageChange}
                        template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        className="fixed bottom-0 left-1/2 transform -translate-x-1/2 shadow-lg p-2 rounded-lg z-50 mb-4 bg-slate-800"
                    />
                </div>
                {selectedContent && (
                    <Dialog
                        header={selectedContent.title}
                        visible={open}
                        style={{ width: '40vw' }}
                        onHide={() => { setOpen(false); setValueRate('') }}
                    >
                        <div>
                            <p className="italic">{details.tagline}</p>
                            {details.production_companies && details.production_companies.length > 0 && (
                                <div className="mt-2">
                                    <p className="font-bold">
                                        {details.production_companies[0].name}
                                        {details.production_companies[0].origin_country && (
                                            <span> ({details.production_companies[0].origin_country})</span>
                                        )}
                                    </p>
                                </div>
                            )}
                            <div className="absolute top-2 right-2">
                                <ToggleButton
                                    checked={favorites[selectedContent.id] || false}
                                    onChange={() => handleFavoriteToggle(selectedContent.id, selectedContent.title)}
                                    className="w-4rem"
                                    onLabel="Desfavoritar"
                                    offLabel="Favoritar"
                                    onIcon={<HeartOff className='mr-2' />}
                                    offIcon={<Heart className='mr-2' />}
                                />
                            </div>
                            <div className="flex items-end space-x-4">
                                <Image imageClassName="rounded-xl border"
                                    src={details.backdrop_path
                                        ? `https://image.tmdb.org/t/p/w200/${details.backdrop_path}`
                                        : posterImagem}
                                    alt="Image"
                                />

                                <div>
                                    <p className="font-bold justify-center flex">
                                        {new Date(details.release_date).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </p>
                                    <div>
                                        <p className="font-bold justify-center flex">
                                            {Math.floor(details.runtime / 60)}h {details.runtime % 60}min
                                        </p>
                                    </div>
                                    {details.genres && details.genres.length > 0 && (
                                        <div className="mt-2 flex space-x-2 justify-center">
                                            {details.genres.map((genre, index) => (
                                                <React.Fragment key={genre.id}>
                                                    <span className="text-sm font-medium">
                                                        {genre.name}
                                                    </span>
                                                    {index < details.genres.length - 1 && (
                                                        <span className="text-sm font-medium">|</span>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    )}
                                    <div className='justify-center flex'>
                                        <Button className='w-36 h-8 mr-1' type="button" label="HomePage" icon="pi pi-users" outlined badgeClassName="p-badge-danger" onClick={() => window.open(details.homepage)}
                                            disabled={!details.homepage} />
                                        <Button className='w-36 h-8 ml-1' type="button" label="Imdb" icon="pi pi-users" outlined badgeClassName="p-badge-danger" onClick={() => window.open('https://www.imdb.com/title/' + details.imdb_id)}
                                            disabled={!details.imdb_id} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="mt-5">{details.overview}</p>


                        <div className="flex mt-4">
                            <div className="mr-12">
                                <InputNumber placeholder="Nota de 0-10 " maxFractionDigits={1} inputId="minmax-buttons" prefix="Nota: " value={valueRate} onValueChange={(e) => setValueRate(e.value)} mode="decimal" step={0.1} showButtons min={1} max={10} />
                            </div>
                            <div className="">
                                <Button label="Fechar" icon="pi pi-times" onClick={() => { setOpen(false); setValueRate('') }} severity="secondary" raised className='mr-2' />
                                <Button label="Avaliar" icon="pi pi-check" onClick={handleSubmit} severity="info" raised />
                            </div>
                        </div>
                    </Dialog>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
