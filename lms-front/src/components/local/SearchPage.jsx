import React, { useState, useEffect, useRef } from 'react';
import AuthService from '../service/AuthService';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { Image } from 'primereact/image';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { BlockUI } from 'primereact/blockui';
import { Loader } from 'lucide-react';


import posterImagem from '../../assets/LMS_Poster.png';
import bgImagem from '../../assets/LMS-BG.png';
import logoutIcon from '../../assets/logoutIcon.png';
import logo from '../../assets/logo.png';

const SearchPage = ({ onLogout }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [details, setDetails] = useState({});
    const [selectedContent, setSelectedContent] = useState(null);
    const [open, setOpen] = useState(false);
    const [valueRate, setValueRate] = useState('');
    const [blocked, setBlocked] = useState(false);
    const toast = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        setBlocked(true);
        popularMovies();
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
                const response = await AuthService.details(content.id);
                setDetails(response);
            } catch (error) {
                showError(error.message);
            }
        }
        setOpen(true);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await AuthService.search(searchTerm);
            setResults(response && response.length > 0 ? response : []);
            if (!response || response.length === 0) {
                popularMovies();
                showError("No results found");
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
            const response = await AuthService.sendRating(selectedContent.title, selectedContent.id, valueRate, selectedContent.poster_path);
            response.mensagem ? showSuccess(response.mensagem) : showError(response.error);
            setValueRate('');
        } catch (error) {
            showError(error.message);
        }
    };

    const popularMovies = async () => {
        try {
            const response = await AuthService.popular();
            setResults(response);
        } catch (error) {
            setResults([]);
            showError(error.message);
        }
    }

    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
    }

    const showError = (message) => showToast('error', 'Error', message);
    const showSuccess = (message) => showToast('success', 'Success', message);

    const menuItems = [
        { label: 'Home', icon: 'pi pi-home', url: '/search' },
        { label: 'Avaliados', icon: 'pi pi-star', url: '/rated' }
    ];

    const menuStart = <img alt="logo" src={logo} height="40" className="mr-2 h-14" />;
    const menuEnd = (
        <div className="flex align-items-center gap-2 items-center">
            <form onSubmit={handleSearch}>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText placeholder="Pesquisar" type="text" className="w-8rem sm:w-auto" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </IconField>
            </form>
            <Avatar image={logoutIcon} shape="circle" onClick={handleLogout} />
        </div>
    );

    return (
        <div className="justify-center items-center text-center" style={{
            backgroundImage: `url(${bgImagem})`,
            backgroundBlendMode: "overlay",
            minHeight: "100vh",
            overflowY: "auto",
        }}>
            <BlockUI blocked={blocked} fullScreen template={<Loader size={68} />} />
            <div className="fixed top-0 left-0 w-full z-50">
                <Menubar model={menuItems} start={menuStart} end={menuEnd} className='h-16' />
            </div>
            <div className='justify-center items-center text-center'>
                <Toast ref={toast} />
                <div className="min-h-screen flex flex-col items-center py-24">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-5/6">
                        {results.map((item) => (
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
                                className="h-full flex flex-col justify-between transform transition-transform duration-300 hover:scale-105"
                            >
                                <p>Ano: {new Date(item.release_date).getFullYear()}</p>
                            </Card>
                        ))}
                    </div>
                </div>
                {selectedContent && (
                    <Dialog
                        header={selectedContent.title}
                        visible={open}
                        style={{ width: '38vw' }}
                        onHide={() => setOpen(false)}
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

                        <p className='mt-4 text-sm italic' >Média: {selectedContent.vote_average.toFixed(1)}</p>

                        <div className="h-full flex flex-col justify-end">
                            <div className="flex justify-between p-4">
                                <div className="mr-4">
                                    <InputNumber placeholder="Nota de 0-10 " minFractionDigits={1} inputId="minmax-buttons" value={valueRate} onValueChange={(e) => setValueRate(e.value)} mode="decimal" step={0.1} showButtons min={1} max={10} />
                                </div>
                                <div className="flex space-x-2 justify-end">
                                    <Button label="Fechar" icon="pi pi-times" onClick={() => setOpen(false)} className="p-button-text" />
                                    <Button label="Avaliar" icon="pi pi-check" onClick={handleSubmit} autoFocus />
                                </div>
                            </div>
                        </div>



                    </Dialog>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
