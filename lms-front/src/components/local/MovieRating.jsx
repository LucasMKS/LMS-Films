import React, { useState, useEffect, useRef } from 'react';
import AuthService from '../service/AuthService';
import MenuBar from "../items/MenuBarRating";

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Image } from 'primereact/image';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { BlockUI } from 'primereact/blockui';
import { RadioButton } from 'primereact/radiobutton';
import { Paginator } from 'primereact/paginator';
import { ToggleButton } from 'primereact/togglebutton';
import { Sidebar } from 'primereact/sidebar';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';

import { Heart } from 'lucide-react';
import { HeartOff } from 'lucide-react';
import posterImagem from '../../assets/LMS_Poster.png';
import bgImagem from '../../assets/LMS-BG.png';

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
    const [template, setTemplate] = useState('FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink');
    const [isMobile, setIsMobile] = useState(false);

    const toast = useRef(null);
    const itemsPerPage = 18;

    useEffect(() => {
        if (initialLoad) {
            setBlocked(true);
            ratedContent().finally(() => {
                setInitialLoad(false);
            });
        } else {
            ratedContent();
        }
        setTimeout(() => setBlocked(false), 1000);
    }, [currentPage, groupBy]);

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
        console.log(query);
        setFilteredContent(query ? content.filter(cont => cont.title && cont.title.toLowerCase().startsWith(query)) : [...content]);
        console.log(filteredContent);
    };

    const autocomplete = (e) => {
        const selected = e.value;
        setSearchValue(selected);
        if (selected && typeof selected === 'object' && selected.title) {
            setContent([selected]);
        } else {
            if (!selected) {
                ratedContent();
            }
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
        const groupedContent = content.reduce((groups, item) => {
            const groupKey = (() => {
                switch (groupBy) {
                    case 'name':
                        return item.title.charAt(0).toUpperCase();
                    case 'rating':
                        return parseFloat(item.myVote).toFixed(1);
                    case 'date':
                        return new Date(item.created_at).toISOString();
                    default:
                        return 0;
                }
            })();

            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(item);
            return groups;
        }, {});

        const sortedGroupKeys = Object.keys(groupedContent).sort((a, b) => {
            if (groupBy === 'rating') {
                const ratingA = parseFloat(a.replace('Nota: ', ''), 10);
                const ratingB = parseFloat(b.replace('Nota: ', ''), 10);
                return ratingB - ratingA;
            } else if (groupBy === 'date') {
                return new Date(b) - new Date(a); 
            }
            return a.localeCompare(b);
        });

        let result = [];
        sortedGroupKeys.forEach((key) => {
            result = result.concat(groupedContent[key]);
        });

        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;
        return result.slice(start, end);
    };

    const groupNames = [
        { name: 'Nome', code: 'name', groupBy: 'name' },
        { name: 'Nota', code: 'rating' },
        { name: 'Data', code: 'date' }
    ];

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
                <MenuBar
                    field="title"
                    searchValue={searchValue}
                    filteredContent={filteredContent}
                    search={search}
                    autocomplete={autocomplete}
                    handleOpenSidebar={handleOpenSidebar}
                    onLogout={onLogout}
                />
            </div>
            <BlockUI blocked={blocked} fullScreen />
            <Toast ref={toast} className='mt-12' />
            <Sidebar header={<div className="flex align-items-center gap-2"><Heart className='text-red-500' /><span className="font-bold">Favoritos</span></div>} visible={visibleLeft} position="right" onHide={() => setVisibleLeft(false)}>
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
                    <p className="text-white font-bold text-5xl text-center mb-4">Avaliados</p>
                    <p className="text-white text-center mb-2">Agrupar por</p>
                    <div className="flex justify-center">
                        <Dropdown
                            value={groupBy}
                            onChange={(e) => setGroupBy(e.value)}
                            options={groupNames}
                            optionLabel="name"
                            optionValue="code"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mx-2">
                    {getGroupedContent().map((item) => (
                        <Card
                            key={item.id}
                            onClick={() => handleClickOpen(item)}
                            header={() => (
                                <div >
                                    <Image
                                        src={item.poster_path ? `https://image.tmdb.org/t/p/w200/${item.poster_path}` : posterImagem}
                                        alt="Image"
                                    />
                                    <p className="font-bold mt-2 text-lg">{item.title}</p>
                                </div>
                            )}
                            subTitle={(
                                <div>
                                    <div className='font-bold'>{`Nota: ${item.myVote}`}</div>
                                    {item.created_at && (
                                        <div>Adição: {formatDate(item.created_at)}</div>
                                    )}
                                </div>
                            )}
                            className="flex flex-col justify-between transform transition-transform duration-300 hover:scale-105"
                        />
                    ))}
                </div>

                {/* Paginator */}
                <Paginator
                    first={currentPage * itemsPerPage}
                    rows={itemsPerPage}
                    totalRecords={totalRecords}
                    onPageChange={(e) => setCurrentPage(e.page)}
                    template={template}
                    className={`bottom-0 left-1/2 transform -translate-x-1/2 shadow-lg p-2 rounded-lg z-50 mb-4 bg-slate-800 w-52 md:w-80 fixed`}
                />

                {selectedContent && (
                    <Dialog header={selectedContent.title} visible={open} style={{ width: isMobile ? '90vw' : '38vw' }} breakpoints={{ '960px': '90vw', '641px': '90vw' }} onHide={() => setOpen(false)}>
                        <div>
                            <p className="italic">{details.tagline}</p>
                            {details.production_companies && details.production_companies.length > 0 && (
                                <div className={`mt-2 ${isMobile ? 'text-center' : ''}`}>
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
                                    onLabel=" "
                                    offLabel=" "
                                    onIcon={<HeartOff />}
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

                        <div className="mt-4 justify-center text-center">
                            <div>
                                <InputNumber placeholder="Nota de 0-10 " minFractionDigits={1} inputId="minmax-buttons" value={valueRate} onValueChange={(e) => setValueRate(e.value)} mode="decimal" step={0.1} min={1} max={10} />
                            </div>
                            <div className='mt-2'>
                                <Button label="Avaliar" icon="pi pi-check" onClick={updateRate} severity="info" raised className='mr-2' />
                                <Button label="Fechar" icon="pi pi-times" onClick={() => setOpen(false)} severity="secondary" raised />
                            </div>
                        </div>
                    </Dialog>
                )}
            </div>
        </div>
    );
}

export default RatedPage;
