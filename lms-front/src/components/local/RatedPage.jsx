import React, { useState, useEffect, useRef } from 'react';
import AuthService from '../service/AuthService';
import { Button } from 'primereact/button';
import { AutoComplete } from "primereact/autocomplete";
import { Card } from 'primereact/card';
import { Image } from 'primereact/image';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import posterImagem from '../../assets/LMS_Poster.png';
import bgImagem from '../../assets/LMS.png';
import logoutIcon from '../../assets/logout.png';

function sleep(duration) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}

const RatedPage = ({ onLogout }) => {
    const [content, setContent] = useState([]);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [selectedContent, setSelectedContent] = useState(null);
    const [filteredContent, setFilteredContent] = useState([]);
    const [details, setDetails] = useState([]);
    const [valueRate, setValueRate] = useState('');
    const toast = useRef(null);

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    useEffect(() => {
        let active = true;

        if (!open) {
            setOptions([]);
            return undefined;
        }

        (async () => {
            await sleep(1000);

            if (active) {
                setOptions([...content]);
            }
        })();

        return () => {
            active = false;
        };
    }, [open, content]);

    useEffect(() => {
        ratedContent();
    }, []);

    const ratedContent = async () => {
        try {
            const response = await AuthService.getRatedContent();
            setContent(response.movieList || []);
            if (response.error) {
                showError(response.error);
            }
        } catch (error) {
            setContent([]);
            showError(error.message);
        }
    }

    const search = (event) => {
        const query = event.query ? event.query.trim().toLowerCase() : '';

        let filteredContent = [];

        if (query.length > 0) {
            filteredContent = content.filter((cont) =>
                cont.title && cont.title.toLowerCase().startsWith(query)
            );
        } else {
            filteredContent = [...content];
        }

        setFilteredContent(filteredContent);
    }

    const header = (item) => (
        <Image
            src={item.poster_path ? `https://image.tmdb.org/t/p/w200/${item.poster_path}` : posterImagem}
            alt="Image"
        />
    );

    const subTitle = (item) => (
        <p>
            Nota: {item.myVote}
        </p>
    );

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            url: '/search'
        },
        {
            label: 'Avaliados',
            icon: 'pi pi-star',
            url: '/rated'
        }
    ];

    const autocomplete = (e) => {
        const selected = e.value;
        if (selected && typeof selected === 'object' && selected.title) {
            setSelectedContent(selected);
            setContent([selected]);
        } else {
            setSelectedContent(selected);
        }
        if (!selected) {
            ratedContent();
        }
    }

    const handleClickOpen = async (content) => {
        setSelectedContent(content);
        if (content) {
            try {
                const response = await AuthService.details(content.movieId);
                setDetails(response);
                console.log(response);
                if (response.error) {
                    showError(response.error);
                }
            } catch (error) {
                showError(error.message);
            }
        }
        setOpen(true);
    };

    const updateRate = async () => {
        try {
            const response = await AuthService.updateRating(selectedContent.movieId, valueRate);

            setContent((prevContent) =>
                prevContent.map((item) =>
                    item.movieId === selectedContent.movieId
                        ? { ...item, myVote: valueRate } 
                        : item
                )
            );
            if (response.mensagem) {
                showSuccess(response.mensagem);
            } 
            if (response.error) {
                showError(response.error);
            }
            setOpen(false);
            setValueRate('');
        } catch (error) {
            showError(error.message);
            
        }
    };

    const start = <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2 h-14"></img>;
    const end = (
        <div className="flex align-items-center gap-2 items-center">
            <AutoComplete placeholder='Buscar' field="title" value={selectedContent} suggestions={filteredContent} completeMethod={search} onChange={autocomplete} />
            <Avatar image={logoutIcon} shape="circle" onClick={handleLogout} />
        </div>
    );

    const showError = (errorMessage) => {
        toast.current.show({severity:'error', summary: 'Error', detail: errorMessage, life: 3000});
    }

    const showSuccess = (message) => {
        toast.current.show({severity:'success', summary: 'Success', detail: message, life: 3000});
    }

    return (
        <div className="relative" style={{
            backgroundImage: `url(${bgImagem})`,
            backgroundBlendMode: "overlay",
            minHeight: "100vh",
            overflowY: "auto",
        }}>
            <div className="fixed top-0 left-0 w-full z-50">
                <Menubar model={items} start={start} end={end} className='h-16' />
            </div>
            <div className="relative mt-24">
            <Toast ref={toast} />
                <p className='text-white text-3xl absolute inset-x-1/2 transform -translate-x-1/2 top-2'>Avaliados</p>
            </div>

            <div className="flex flex-col items-center py-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-5/6">
                    {content.map((item) => (
                        <div key={item.id}>
                            <Card
                                onClick={() => handleClickOpen(item)}
                                title={item.title}
                                header={header(item)}
                                subTitle={subTitle(item)}
                                className="h-full flex flex-col justify-between transform transition-transform duration-300 hover:scale-105"
                            >
                            </Card>
                        </div>
                    ))}
                </div>
                <div>

                    {selectedContent && (
                        <Dialog header={selectedContent.title} visible={open} style={{ width: '38vw' }} onHide={() => { if (!open) return; setOpen(false); }} >
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


                            <div className="h-full flex flex-col justify-end">
                                <div className="flex justify-between p-4">
                                    <div className="mr-4">
                                        <InputNumber placeholder="Nota de 0-10 " minFractionDigits={1} inputId="minmax-buttons" value={valueRate} onValueChange={(e) => setValueRate(e.value)} mode="decimal" step={0.1} showButtons min={1} max={10} />
                                    </div>
                                    <div className="flex space-x-2 justify-end">
                                        <Button label="Fechar" icon="pi pi-times" onClick={() => setOpen(false)} className="p-button-text" />
                                        <Button label="Avaliar" icon="pi pi-check" onClick={updateRate} autoFocus />
                                    </div>
                                </div>
                            </div>



                        </Dialog>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RatedPage;
