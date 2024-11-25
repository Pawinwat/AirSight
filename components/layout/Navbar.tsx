import React from 'react';
import Link from 'next/link';
import { Button } from 'primereact/button'; // PrimeReact Button for navbar items
import { Menubar } from 'primereact/menubar'; // PrimeReact Menubar for navigation

const Navbar: React.FC = () => {
    // Defining menu items for the Menubar component
    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home', // Home icon from PrimeIcons
            command: () => window.location.href = '/' // Command to navigate to Home
        },
        {
            label: 'Menu',
            icon: 'pi pi-bars', // Menu icon
            command: () => window.location.href = '/menu' // Command to navigate to Menu page
        },
        {
            label: 'Dashboard',
            icon: 'pi pi-objects-column', // About icon
            command: () => window.location.href = '/dashboard' // Command to navigate to About page
        },
        {
            label: 'About',
            icon: 'pi pi-info-circle', // About icon
            command: () => window.location.href = '/about' // Command to navigate to About page
        }
    ];

    return (
        <Menubar model={items} style={{ maxWidth: '1200px', margin: '0 auto',borderRadius:0 }} />
    );
};

export default Navbar;
