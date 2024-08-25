import React, { useState, useEffect, useRef } from 'react';
import AuthService from '../service/AuthService';
import { useNavigate } from 'react-router-dom';
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
import { Star } from 'lucide-react';
import { House } from 'lucide-react';
import posterImagem from '../../assets/LMS_Poster.png';
import bgImagem from '../../assets/LMS-BG.png';
import logo from '../../assets/logo.png';

const SerieSearch = ({ onLogout }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [details, setDetails] = useState({});
    const [selectedContent, setSelectedContent] = useState(null);
    const [open, setOpen] = useState(false);
    const [valueRate, setValueRate] = useState(1);
    const [blocked, setBlocked] = useState(false);
    const [first, setFirst] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [favorites, setFavorites] = useState({});
    const [favoritesList, setFavoritesList] = useState({})
    const [visibleLeft, setVisibleLeft] = useState(false);
    const toast = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        setBlocked(true);
        loadPopularSeries(1);
        setSearchTerm("");
    }, []);

    useEffect(() => {
        if (blocked) {
            setTimeout(() => setBlocked(false), 1000);
        }
    }, [blocked]);

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    const handleClickOpen = async (content) => {
        setSelectedContent(content);
        if (content) {
            try {
                const response = await AuthService.detailSeries(content.id);
                setDetails(response);

                // Buscar o status de favorito
                fetchFavoriteStatus(content.id);
            } catch (error) {
                showError(error.message);
            }
        }
        setOpen(true);
    };


    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await AuthService.searchSeries(searchTerm);
            setResults(response && response.length > 0 ? response : []);
            if (!response || response.length === 0) {
                loadPopularSeries(1);
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
            const response = await AuthService.sendSerieRate(selectedContent.name, selectedContent.id, valueRate, selectedContent.poster_path);
            response.mensagem ? showSuccess(response.mensagem) : showError(response.error);
            setValueRate(1);
        } catch (error) {
            showError(error.message);
        }
    };

    const loadPopularSeries = async (page) => {
        try {
            const response = await AuthService.popularSeries(page);
            setResults(response);
            
            setTotalRecords(500);
        } catch (error) {
            setResults([]);
            showError(error.message);
        }
    }

    const handleFavoriteToggle = async (serieId, name) => {
        try {
            // Envia a solicitação para o backend
            const newFavoriteStatus = !favorites[serieId];
            await AuthService.toggleSerieFavorite(serieId, name, newFavoriteStatus);
            
            // Atualiza o estado local somente após a resposta bem-sucedida da API
            setFavorites(prev => ({
                ...prev,
                [serieId]: newFavoriteStatus
            }));
            
        } catch (error) {
            // Em caso de erro, reverte o estado e mostra a mensagem de erro
            showError(error.message);
        }
    };
    


const fetchFavoriteStatus = async (serieId) => {
    try {
        const response = await AuthService.getFavoriteSeriesStatus(serieId);

        if (response.statusCode === 0) {
            setFavorites(prev => ({
                ...prev,
                [serieId]: response.favorite
            }));
        }
    } catch (error) {
        console.error('Failed to fetch favorite status:', error);
    }
};



    const onPageChange = (event) => {
        setFirst(event.first);
        const pageNumber = Math.ceil(event.first / 20) + 1;
        loadPopularSeries(pageNumber);
    }

    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
    }

    const showError = (message) => showToast('error', 'Error', message);
    const showSuccess = (message) => showToast('success', 'Success', message);

    const menuItems = [
        {
            label: 'Filmes', 
            icon: 'pi pi-video', 
            items: [
                {
                    label: 'Pesquisar', url: '/filmes'
                },
                {
                    label: 'Avaliados', url: '/filmes/avaliados'
                }
            ]
        },
        {
            label: 'Series',
            icon: 'pi pi-play-circle',
            items: [
                {
                    label: 'Pesquisar', url: '/series'
                },
                {
                    label: 'Avaliados', url: '/series/avaliados'
                }                
            ]
        },
    ];

    const handleFavoriteDetails = async (content) => {
        setSearchTerm(content.title); // Define o termo de pesquisa para o título selecionado
        try {
            const response = await AuthService.searchSeries(content.name); // Realiza a pesquisa pelo título
            setResults(response && response.length > 0 ? response : []); // Atualiza os resultados para mostrar apenas o item correspondente
            if (!response || response.length === 0) {
                showError("Nenhum resultado encontrado"); // Exibe erro se não houver resultados
            }
        } catch (error) {
            setResults([]); // Limpa os resultados em caso de erro
            showError(error.message); // Exibe a mensagem de erro
        }
    };

    const getAllFavorites = async () => {
        try {
            const response = await AuthService.getAllSeriesFavorites();
            setFavoritesList(response.favoriteSerieList || []);
            if (response.error) showToast('error', 'Error', response.error);
        } catch (error) {
            setFavoritesList([]);
            showToast('error', 'Error', error.message);
        }
    }

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
                            <Button label={item.name} severity="secondary" text className="w-full mt-2" onClick={() => handleFavoriteDetails(item)} />
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
                                key={item.id}
                                onClick={() => handleClickOpen(item)}
                                title={item.name}
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
                                <p>Ano: {item.first_air_date ? new Date(item.first_air_date).getFullYear() : "Em produção"}</p>
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
                        header={selectedContent.name}
                        visible={open}
                        style={{ width: '35vw' }}
                        onHide={() => setOpen(false)}
                    >
                        <div>
                            <p className="italic">{details.status}</p>
                            {details.networks && details.networks.length > 0 && (
                                <div className="mt-2">
                                    <p className="font-bold">
                                        {details.networks[0].name}
                                        {details.networks[0].origin_country && (
                                            <span> ({details.networks[0].origin_country})</span>
                                        )}
                                    </p>
                                </div>
                            )}
                            <div className="absolute top-2 right-2">
                                <ToggleButton
                                    checked={favorites[selectedContent.id] || false}
                                    onChange={() => handleFavoriteToggle(selectedContent.id, selectedContent.name)}
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
                                        {new Date(details.first_air_date).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </p>
                                    <div>
                                        <p className="font-bold justify-center flex">
                                            S{details.number_of_seasons} E{details.number_of_episodes}
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
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="mt-5">{details.overview}</p>
                        <div className="h-full flex flex-col justify-end">
                            <div className="flex justify-between p-4">
                                <div>
                                    <InputNumber placeholder="Nota de 0-10 " minFractionDigits={1} inputId="minmax-buttons" value={valueRate} onValueChange={(e) => setValueRate(e.value)} mode="decimal" step={0.1} showButtons min={1} max={10} />
                                </div>
                                <div className="flex space-x-2 justify-end">
                                    <Button label="Fechar" icon="pi pi-times" onClick={() => setOpen(false)} severity="secondary" raised />
                                    <Button label="Avaliar" icon="pi pi-check" onClick={handleSubmit} severity="info" raised />
                                </div>
                            </div>
                        </div>
                    </Dialog>
                )}
            </div>
        </div>
    );
};

export default SerieSearch;
