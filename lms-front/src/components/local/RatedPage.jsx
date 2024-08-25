import React, { useState, useEffect, useRef } from 'react';
import AuthService from '../service/AuthService';
import { Button } from 'primereact/button';
import { AutoComplete } from "primereact/autocomplete";
import { Card } from 'primereact/card';
import { Image } from 'primereact/image';
import { Menubar } from 'primereact/menubar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { BlockUI } from 'primereact/blockui';
import { RadioButton } from 'primereact/radiobutton';
import { Paginator } from 'primereact/paginator';
import { ToggleButton } from 'primereact/togglebutton';
import { Sidebar } from 'primereact/sidebar';
import { Divider } from 'primereact/divider';

import { Heart } from 'lucide-react';
import { HeartOff } from 'lucide-react';
import posterImagem from '../../assets/LMS_Poster.png';
import bgImagem from '../../assets/LMS-BG.png';
import logo from '../../assets/logo.png';

const RatedPage = ({ onLogout }) => {
    const [content, setContent] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedContent, setSelectedContent] = useState(null);
    const [searchValue, setSearchValue] = useState(null);
    const [filteredContent, setFilteredContent] = useState([]);
    const [details, setDetails] = useState({});
    const [valueRate, setValueRate] = useState('');
    const [blocked, setBlocked] = useState(false);
    const [groupBy, setGroupBy] = useState('name');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [initialLoad, setInitialLoad] = useState(true)
    const [favorites, setFavorites] = useState({});
    const [favoritesList, setFavoritesList] = useState({})
    const [visibleLeft, setVisibleLeft] = useState(false);


    const toast = useRef(null);
    const itemsPerPage = 18;

    useEffect(() => {
        const loadContent = async () => {
            setBlocked(true);
            await ratedContent();
            setInitialLoad(false);
            setTimeout(() => setBlocked(false), 1000);
        };

        if (initialLoad) loadContent();
        else ratedContent();
    }, [currentPage, groupBy]);


    const ratedContent = async () => {
        try {
            const response = await AuthService.getRatedContent();
            setContent(response.movieList || []);
            setTotalRecords(response.movieList?.length || 0);
            if (response.error) showToast('error', 'Error', response.error);
        } catch (error) {
            setContent([]);
            showToast('error', 'Error', error.message);
        }
    };

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

    const handleFavoriteToggle = async (movieId, title) => {
        try {
            const currentFavoriteStatus = favorites[movieId] || false;
            const newFavoriteStatus = !currentFavoriteStatus;
            setFavorites(prev => ({ ...prev, [movieId]: newFavoriteStatus }));
            await AuthService.toggleFavorite(movieId, title, newFavoriteStatus);
            await getAllFavorites();
        } catch (error) {
            setFavorites(prev => ({ ...prev, [movieId]: !(favorites[movieId] || false) }));
            showError(error.message);
        }
    };

    const fetchFavoriteStatus = async (movieId) => {
        try {
            const response = await AuthService.getFavoriteStatus(movieId);
            setFavorites(prev => ({ ...prev, [movieId]: response.favorite }));
        } catch (error) {
            console.error('Failed to fetch favorite status:', error);
        }
    };

    const search = (event) => {
        const query = event.query.trim().toLowerCase();
        setFilteredContent(query ? content.filter(cont => cont.title && cont.title.toLowerCase().startsWith(query)) : [...content]);
    };

    const autocomplete = (e) => {
        const selected = e.value;
        setSearchValue(selected);
        if (selected && typeof selected === 'object' && selected.title) {
            setContent([selected]);
        } else {
            if (!selected) ratedContent();
        }
    };

    const handleClickOpen = async (content) => {
        setSelectedContent(content);
        if (content) {
            try {
                const response = await AuthService.details(content.movieId);
                setDetails(response);
                fetchFavoriteStatus(content.movieId);
                if (response.error) showToast('error', 'Error', response.error);
            } catch (error) {
                showToast('error', 'Error', error.message);
            }
        }
        setOpen(true);
    };

    const handleOpenSidebar = async (item) => {
        await getAllFavorites(item)
        setVisibleLeft(true);

    };

    const updateRate = async () => {
        try {
            const response = await AuthService.updateRating(selectedContent.movieId, valueRate);
            setContent(prevContent =>
                prevContent.map(item =>
                    item.movieId === selectedContent.movieId ? { ...item, myVote: valueRate } : item
                )
            );
            if (response.mensagem) showToast('success', 'Success', response.mensagem);
            if (response.error) showToast('error', 'Error', response.error);
            setOpen(false);
            setValueRate('');
        } catch (error) {
            showToast('error', 'Error', error.message);
        }
    };

    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
    };

    const getGroupedContent = () => {
        const sortedContent = [...content].sort((a, b) => {
            switch (groupBy) {
                case 'name':
                    return a.title.localeCompare(b.title);
                case 'rating':
                    return b.myVote - a.myVote;
                case 'date':
                    return new Date(b.created_at) - new Date(a.created_at);
                default:
                    return 0;
            }
        });

        const start = currentPage * itemsPerPage;
        return sortedContent.slice(start, start + itemsPerPage);
    };

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

    const menuStart = <img alt="logo" src={logo} className="mr-4 h-14" />;
    const menuEnd = (
        <div className="flex align-items-center gap-2 items-center">
            <AutoComplete
                placeholder='Buscar'
                field="title"
                value={searchValue}
                suggestions={filteredContent}
                completeMethod={search}
                onChange={autocomplete}
            />
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="relative" style={{
            backgroundImage: `url(${bgImagem})`,
            backgroundBlendMode: "overlay",
            minHeight: "100vh",
            overflowY: "auto",
        }}>
            <div className="fixed top-0 left-0 w-full z-50">
                <Menubar model={menuItems} start={menuStart} end={menuEnd} className='h-16' />
            </div>
            <BlockUI blocked={blocked} fullScreen />
            <Toast ref={toast} className='mt-12' />
            <Sidebar header={customHeader} visible={visibleLeft} position="right" onHide={() => setVisibleLeft(false)}>
                {favoritesList && favoritesList.length > 0 && (
                    favoritesList.map((item) => (
                        <React.Fragment key={item.movieId}>
                            <Button label={item.title} severity="secondary" text className="w-full mt-2" onClick={() => handleClickOpen(item)} />
                            <Divider />
                        </React.Fragment>
                    ))
                )}
            </Sidebar>

            <div className="flex flex-col items-center text-center py-24">
                <div className="mb-4">
                    <p className='text-white font-bold text-5xl mb-4'>Avaliados</p>
                    <p className='text-white  mb-2'>Agrupar por</p>
                    <div className="flex flex-wrap gap-3 text-white">
                        {['name', 'rating', 'date'].map((group) => (
                            <div key={group} className="flex align-items-center">
                                <RadioButton
                                    inputId={`groupBy${group}`}
                                    name="groupBy"
                                    value={group}
                                    onChange={(e) => setGroupBy(e.value)}
                                    checked={groupBy === group}
                                />
                                <label htmlFor={`groupBy${group}`} className="ml-2">{group.charAt(0).toUpperCase() + group.slice(1)}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-5/6">
                    {getGroupedContent().map((item) => (
                        <Card
                            key={item.id}
                            onClick={() => handleClickOpen(item)}
                            title={item.title}
                            header={() => (
                                <Image
                                    src={item.poster_path ? `https://image.tmdb.org/t/p/w200/${item.poster_path}` : posterImagem}
                                    alt="Image"
                                />
                            )}
                            subTitle={(
                                <>
                                    <div className='font-bold'>{`Nota: ${item.myVote}`}</div>
                                    {item.created_at && (
                                        <div>Adição: {formatDate(item.created_at)}</div>
                                    )}
                                </>
                            )}
                            className="h-full flex flex-col justify-between transform transition-transform duration-300 hover:scale-105"
                        />
                    ))}
                </div>

                {/* Paginator */}
                <Paginator
                    first={currentPage * itemsPerPage}
                    rows={itemsPerPage}
                    totalRecords={totalRecords}
                    onPageChange={(e) => setCurrentPage(e.page)}
                    template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-slate-800 shadow-lg p-2 rounded-lg z-50 mb-4"
                />

                {selectedContent && (
                    <Dialog header={selectedContent.title} visible={open} style={{ width: '40vw' }} onHide={() => setOpen(false)}>
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
                                    checked={favorites[selectedContent.movieId] || false}
                                    onChange={() => handleFavoriteToggle(selectedContent.movieId, selectedContent.title)}
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
                                <InputNumber placeholder="Nota de 0-10 " minFractionDigits={1} inputId="minmax-buttons" value={valueRate} onValueChange={(e) => setValueRate(e.value)} mode="decimal" step={0.1} showButtons min={1} max={10} />
                            </div>
                            <div>
                                <Button label="Fechar" icon="pi pi-times" onClick={() => setOpen(false)} severity="secondary" raised className='mr-2' />
                                <Button label="Avaliar" icon="pi pi-check" onClick={updateRate} severity="info" raised />
                            </div>
                        </div>
                    </Dialog>
                )}
            </div>
        </div>
    );
}

export default RatedPage;
