// src/components/NavBar.tsx

import React from 'react';
// Use NavLink for active link styling in the mobile menu
import { Link, NavLink } from "react-router-dom";
// Import icons for the mobile menu
import {
    Braces,
    Menu,
    Home,
    Repeat,
    CreditCard,
    Dock
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "../components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { WalletAndAccountManager } from './WalletAndAccountManager';
import { cn } from '../lib/utils'; // Make sure to import cn utility

// --- Best Practice: Define navigation items as data for cleaner code ---
const mainNavItems = [
    { href: '/', icon: Home, label: 'Home' },
    // Assuming you have a '/subscriptions' route, otherwise change to '/'
    { href: '/auto-pay', icon: CreditCard, label: 'AutoPay' },
    { href: '/docs', icon: Dock, label: 'Docs' },
];

const NavBar: React.FC = () => {
    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white backdrop-blur-sm">
                <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-900">AutoPay</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <NavigationMenu className="hidden lg:flex">
                        <NavigationMenuList className="space-x-2">
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link to="/" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600">
                                        Home
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                          

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link to="/auto-pay" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600">
                                        AutoPay
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link to="/docs" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600">
                                        Docs
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Wallet/Manager: show only on large screens in header; mobile users will use the sheet footer */}
                    <div className="hidden lg:flex items-center space-x-3">
                        <WalletAndAccountManager />
                    </div>

                    {/* --- ENHANCED MOBILE MENU --- */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden">
                                <Menu className="h-6 w-6 text-black" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] p-0 flex flex-col bg-white">
                            {/* Mobile Menu Header */}
                            <div className="p-6 border-b border-gray-200">
                                <Link to="/" className="flex items-center space-x-2">
                                    <Braces className="h-6 w-6 text-blue-600" />
                                    <span className="text-lg font-bold text-gray-900">AutoPay</span>
                                </Link>
                            </div>

                            {/* Mobile Menu Navigation */}
                            <div className="flex-grow p-4 overflow-y-auto">
                                <nav className="flex flex-col gap-1">
                                    {mainNavItems.map((item) => (
                                        <NavLink
                                            key={item.label}
                                            to={item.href}
                                            className={({ isActive }) => cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900",
                                                isActive && "bg-blue-50 text-blue-600 font-semibold"
                                            )}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            <span className="text-md">{item.label}</span>
                                        </NavLink>
                                    ))}
                                </nav>

                                <div className="my-4 border-t border-gray-200" />
                            </div>

                            {/* Mobile Menu Footer: include compact wallet manager so users see connect/address in sidebar */}
                            <div className="p-4 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Account</span>
                                        <div className="text-xs text-gray-500">Manage wallet & smart account</div>
                                    </div>
                                    <div>
                                        <WalletAndAccountManager />
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>
        </>
    );
};

export default NavBar;