import React, { useState, useEffect, useRef } from 'react';
import AuthService from '../service/AuthService';

import { Menu } from 'primereact/menu';
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
import { Clapperboard } from 'lucide-react';
import { Star } from 'lucide-react';
import { Telescope } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { Check } from 'lucide-react';
import { X } from 'lucide-react';
import { BookOpenCheck } from 'lucide-react';
import { AlignJustify } from 'lucide-react';
import { TvMinimal } from 'lucide-react';
import { Film } from 'lucide-react';

import posterImagem from '../../assets/LMS_Poster.png';
import bgImagem from '../../assets/LMS-BG.png';
import logo from '../../assets/logo.png';

const SerieSearch = ({ onLogout }) => {
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
    const [isFromCard, setIsFromCard] = useState(true);
    const [fromFavoriteDetails, setFromFavoriteDetails] = useState(false);
    const [template, setTemplate] = useState('FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink');
    const [isMobile, setIsMobile] = useState(false);

    const toast = useRef(null);
    const menuLeft = useRef(null);

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

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setTemplate({ layout: 'PrevPageLink CurrentPageReport NextPageLink' });
            } else {
                setTemplate('FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink');
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleClickOpen = async (content) => {
        setIsFromCard(true);
        setSelectedContent(content);
        if (content) {
            try {
                const response = await AuthService.detailSeries(content.id);
                setDetails(response);
                fetchFavoriteStatus(content.id);
            } catch (error) {
                showError(error.message);
            }
        }
        setOpen(true);
    };

    const handleFavoriteDetails = async (content) => {
        setIsFromCard(false);
        setSelectedContent(content);
        setFromFavoriteDetails(true);
        if (content) {
            try {
                const response = await AuthService.detailSeries(content.serieId);
                setDetails(response);
                await fetchFavoriteStatus(content.serieId);
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

    const handleSearchPage = async (page) => {
        try {
            const response = await AuthService.search(searchTerm, page);
            setResults(response && response.length > 0 ? response : []);
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

            const idToUse = fromFavoriteDetails ? selectedContent.serieId : selectedContent.id;

            const response = await AuthService.sendSerieRate(selectedContent.name, idToUse, ratingToSend, selectedContent.poster_path);
            response.mensagem ? showSuccess(response.mensagem) : showError(response.error);
            setValueRate('');
        } catch (error) {
            showError(error.message);
        } finally {
            setFromFavoriteDetails(false);
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
    };

    const handleFavoriteToggle = async () => {
        try {
            const idToToggle = isFromCard ? selectedContent.id : selectedContent.serieId;
            const newFavoriteStatus = !favorites[idToToggle];
            await AuthService.toggleSerieFavorite(idToToggle, selectedContent.name, newFavoriteStatus);
            setFavorites(prev => ({
                ...prev,
                [idToToggle]: newFavoriteStatus
            }));
        } catch (error) {
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

    const getAllFavorites = async () => {
        try {
            const response = await AuthService.getAllSeriesFavorites();
            setFavoritesList(response.favoriteSerieList || []);
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

    const getFavoriteStatus = (id) => {
        return favorites[id] || false;
    };

    const onPageChange = (event) => {
        setFirst(event.first);
        const pageNumber = Math.ceil(event.first / 20) + 1;

        if (searchTerm) {
            handleSearchPage(pageNumber);
        } else {

            loadPopularSeries(pageNumber);
        }
    };

    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
    };

    const showError = (message) => showToast('error', 'Error', message);
    const showSuccess = (message) => showToast('success', 'Success', message);

    const items = [
        {
            label: 'Filmes',
            items: [
                { label: 'Pesquisar', url: '/filmes', icon: <Clapperboard className='mr-2' /> },
                { label: 'Avaliados', url: '/filmes/avaliados', icon: <Star className='mr-2' /> }
            ],
        },
        {
            label: 'Series',
            items: [
                { label: 'Pesquisar', url: '/series', icon: <Telescope className='mr-2' /> },
                { label: 'Avaliados', url: '/series/avaliados', icon: <Sparkles className='mr-2' /> }
            ],
        },
        {
            label: 'Menu',
            items: [
                { label: 'Favoritos', icon: <Heart className='mr-2' />, command: () => handleOpenSidebar() },
                { label: 'Sair', icon: <LogOut className='mr-2' />, command: () => onLogout() }
            ]
        },
    ];

    const menuStart = <img alt="logo" src={logo} height="40" className="mr-2 h-14" onClick={() => window.location.reload()} />;

    const menuItems = [
        {
            label: 'Filmes',
            icon: <Film className='mr-2'/>,
            items: [
                { label: 'Pesquisar', url: '/filmes', icon: <Clapperboard className='mr-2' /> },
                { label: 'Avaliados', url: '/filmes/avaliados', icon: <Star className='mr-2' /> }
            ],
            className: 'hidden sm:hidden md:hidden lg:block xl:block'
        },
        {
            label: 'Series',
            icon: <TvMinimal className='mr-2'/>,
            items: [
                { label: 'Pesquisar', url: '/series', icon: <Telescope className='mr-2' /> },
                { label: 'Avaliados', url: '/series/avaliados', icon: <Sparkles className='mr-2' /> }
            ],
            className: 'hidden sm:hidden md:hidden lg:block xl:block'
        },
    ];

    const menuEnd = (
        <div className="flex align-items-center gap-2 items-center">
            <form onSubmit={handleSearch}>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText placeholder="Pesquisar" type="text" className="w-44 lg:w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </IconField>
            </form>
            <Button label={<p className='flex'><Heart className='mr-2'/> Favoritos</p>} onClick={() => handleOpenSidebar()} className='hidden sm:hidden md:hidden lg:flex xl:flex' />
            <Button label={<p className='flex'><LogOut className='mr-2'/> Sair</p>} iconPos="right" onClick={onLogout} className='hidden sm:hidden md:hidden lg:flex xl:flex' />
            <Menu model={items} popup ref={menuLeft} id="popup_menu_left" />
            <Button icon={<AlignJustify />} variant="ghost" onClick={(event) => menuLeft.current.toggle(event)} aria-controls="popup_menu_left" aria-haspopup severity="secondary" className=" flex sm:flex md:flex lg:hidden xl:hidden hover:text-gray-300 bg-gray-800 hover:bg-gray-700"></Button>
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
            <Sidebar header={<div className="flex align-items-center gap-2"><Heart className='text-red-500' /><span className="font-bold">Favoritos</span></div>} visible={visibleLeft} position="right" onHide={() => setVisibleLeft(false)}>
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

            <div>
                <div className="flex flex-col py-24">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mx-2 lg:mx-10">
                        {results.map((item) => (
                            <Card
                                key={item.id}
                                onClick={() => handleClickOpen(item)}
                                header={() => (
                                    <div >
                                        <Image
                                            src={item.poster_path ? `https://image.tmdb.org/t/p/w200/${item.poster_path}` : posterImagem}
                                            alt="Image"
                                        />
                                        <p className="font-bold mt-2 text-lg">{item.name}</p>
                                    </div>

                                )}
                                subTitle={() => (
                                    <div>
                                        <p>Ano: {item.first_air_date ? new Date(item.first_air_date).getFullYear() : " "}</p>
                                    </div>
                                )}
                                className="flex flex-col justify-between transform transition-transform duration-300 hover:scale-105"
                            >
                            </Card>
                        ))}
                    </div>
                    <Paginator
                        first={first}
                        rows={20}
                        totalRecords={totalRecords}
                        onPageChange={onPageChange}
                        template={template}
                        className={`bottom-0 left-1/2 transform -translate-x-1/2 shadow-lg p-2 rounded-lg z-50 mb-4 bg-slate-800 w-52 md:w-80 fixed`}
                    />
                </div>
                {selectedContent && (
                    <Dialog
                        header={selectedContent.name}
                        visible={open}
                        style={{ width: isMobile ? '90vw' : '38vw' }}
                        breakpoints={{ '960px': '90vw', '641px': '90vw' }}
                        onHide={() => setOpen(false)}
                    >
                        <div>
                            <p className="italic">{details.status}</p>
                            {details.networks && details.networks.length > 0 && (
                                <div className={`mt-2 ${isMobile ? 'text-center' : ''}`}>
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
                                    checked={getFavoriteStatus(isFromCard ? selectedContent.id : selectedContent.serieId)}
                                    onChange={handleFavoriteToggle}
                                    className="w-4rem"
                                    onLabel=" "
                                    offLabel=" "
                                    onIcon={<HeartOff className='mr-2' />}
                                    offIcon={<Heart className='text-red-500' />}
                                />
                            </div>
                            <div className={` ${isMobile ? 'items-end space-x-4' : 'items-start space-x-4 flex'}`}>
                                <Image imageClassName="rounded-xl border"
                                    src={details.backdrop_path
                                        ? `https://image.tmdb.org/t/p/${isMobile ? 'original' : 'w200'}/${details.backdrop_path}`
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
                                        <Button className='w-36 h-8 mr-1' type="button" label={<p className='flex'><BookOpenCheck className='mr-2'/> HomePage</p>} outlined badgeClassName="p-badge-danger" onClick={() => window.open(details.homepage)}
                                            disabled={!details.homepage} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="mt-5">{details.overview}</p>

                        <div className="mt-4 justify-center text-center">
                            <div>
                                <InputNumber placeholder="Nota de 0-10 " minFractionDigits={1} inputId="minmax-buttons" value={valueRate} onValueChange={(e) => setValueRate(e.value)} mode="decimal" step={0.1} min={1} max={10} />
                            </div>
                            <div className="mt-2">
                            <Button label="Avaliar" icon={<Check />} onClick={handleSubmit} severity="info" raised className='mr-2' />
                                <Button label="Fechar" icon={<X />} onClick={() => { setOpen(false); setValueRate('') }} severity="secondary" raised />
                                
                            </div>
                        </div>
                    </Dialog>
                )}
            </div>
        </div>
    );
};

export default SerieSearch;
