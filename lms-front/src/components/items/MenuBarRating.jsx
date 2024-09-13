import React, { useRef } from 'react';
import { Menubar } from 'primereact/menubar';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';

import logo from '../../assets/logo.png';

import { Heart } from 'lucide-react';
import { Clapperboard } from 'lucide-react';
import { Star } from 'lucide-react';
import { Telescope } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { AlignJustify } from 'lucide-react';
import { TvMinimal } from 'lucide-react';
import { Film } from 'lucide-react';

const MenuBar = ({ searchValue, filteredContent, search, autocomplete, handleOpenSidebar, onLogout, field }) => {
    const menuLeft = useRef(null);

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

    const menuStart = <img alt="logo" src={logo} className="h-14" onClick={() => window.location.reload()}/>;

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
        <div>
            <div className="gap-2 flex">
                <AutoComplete
                    placeholder='Buscar'
                    field={field}
                    value={searchValue}
                    suggestions={filteredContent}
                    completeMethod={search}
                    onChange={autocomplete}
                />
                <Button label={<p className='flex'><Heart className='mr-2'/> Favoritos</p>} onClick={() => handleOpenSidebar()} className='hidden sm:hidden md:hidden lg:flex xl:flex' />
                <Button label={<p className='flex'><LogOut className='mr-2'/> Sair</p>} onClick={onLogout} className='hidden sm:hidden md:hidden lg:flex xl:flex' />
                <Menu model={items} popup ref={menuLeft} id="popup_menu_left" />
                <Button icon={<AlignJustify />} variant="ghost" onClick={(event) => menuLeft.current.toggle(event)} aria-controls="popup_menu_left" aria-haspopup severity="secondary" className=" flex sm:flex md:flex lg:hidden xl:hidden hover:text-gray-300 bg-gray-800 hover:bg-gray-700"></Button>
            </div>
        </div>
    );

    return <Menubar model={menuItems} start={menuStart} end={menuEnd} className='h-16' />;
};

export default MenuBar;