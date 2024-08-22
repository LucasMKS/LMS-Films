import React, { useState, useEffect } from 'react';
import AuthService from '../service/AuthService';
import { Button } from 'primereact/button';
import { AutoComplete } from "primereact/autocomplete";
import { Card } from 'primereact/card';
import { Image } from 'primereact/image';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';

import posterImagem from '../../assets/LMS_Poster.png';
import bgImagem from '../../assets/LMS.png';

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
            console.log("Buscas: ", response);

        } catch (error) {
            setContent([]);
            setError("Erro ao buscar filmes populares");
        }
    }

    const search = (event) => {
        // Garantir que event.query é uma string e tratá-la corretamente
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

    const teste = (e) => {
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

    const start = <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2 h-14"></img>;
    const end = (
        <div className="flex align-items-center gap-2 items-center">
            <AutoComplete placeholder='Buscar' field="title" value={selectedContent} suggestions={filteredContent} completeMethod={search} onChange={teste} />
            <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" onClick={handleLogout} />
        </div>
    );

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
                <p className='text-white text-3xl absolute inset-x-1/2 transform -translate-x-1/2 top-2'>Avaliados</p>
            </div>

            <div className="flex flex-col items-center py-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-5/6">
                    {content.length > 0 ? (
                        content.map((item) => (
                            <div key={item.id}>
                                <Card
                                    title={item.title}
                                    header={header(item)}
                                    subTitle={subTitle(item)}
                                    className="h-full flex flex-col justify-between transform transition-transform duration-300 hover:scale-105"
                                >
                                </Card>
                            </div>
                        ))
                    ) : (
                        <p>Sem filmes disponíveis</p>
                    )}
                    {error && (
                        <p className="text-red-500">{error}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RatedPage;
