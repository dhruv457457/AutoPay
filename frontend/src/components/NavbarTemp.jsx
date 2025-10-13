"use client"

import React from "react"
import { Braces, Menu, Mountain } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "../ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "../ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"

export default function Navbar() {

  // navigation helper (placeholder - authentication handled elsewhere)
  const handleConnectWallet = () => {
    // placeholder: open wallet connect modal or trigger wallet connect flow
    console.log('Connect Wallet clicked')
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Braces className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">AutoPay</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="space-x-2">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="#"
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-gray-700 hover:bg-blue-50 hover:text-blue-600 data-[active]:bg-blue-50 data-[state=open]:bg-blue-50">
                  Subscriptions
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white shadow-md border border-gray-200 rounded-md">
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <NavigationMenuLink asChild>
                      <Link
                        to="#"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                      >
                        <div className="text-sm font-medium leading-none">
                          For Startups
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Scale your startup with our growth-focused solutions.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        to="#"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                      >
                        <div className="text-sm font-medium leading-none">
                          For Enterprise
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Enterprise-grade solutions for large organizations.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        to="#"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                      >
                        <div className="text-sm font-medium leading-none">
                          For Agencies
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          White-label solutions for digital agencies and
                          consultants.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        to="#"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                      >
                        <div className="text-sm font-medium leading-none">
                          For Developers
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Developer-friendly tools and comprehensive
                          documentation.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="#"
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    AutoPay
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-gray-700 hover:bg-blue-50 hover:text-blue-600 data-[active]:bg-blue-50 data-[state=open]:bg-blue-50">
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white shadow-md border border-gray-200 rounded-md">
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <NavigationMenuLink asChild>
                      <Link
                        to="#"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                      >
                        <div className="text-sm font-medium leading-none">
                          Documentation
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Comprehensive guides and API documentation.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        to="#"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                      >
                        <div className="text-sm font-medium leading-none">
                          Blog
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Latest insights, tutorials, and industry updates.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        to="#"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                      >
                        <div className="text-sm font-medium leading-none">
                          Help Center
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Get help and find answers to common questions.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        to="#"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                      >
                        <div className="text-sm font-medium leading-none">
                          Community
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Join our community of developers and creators.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop Connect Wallet Button */}
          <div className="hidden lg:flex items-center">
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700 shadow-md"
              onClick={handleConnectWallet}
            >
              Connect Wallet
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-6">
                <Link
                  to="/"
                  className="flex items-center space-x-2 pb-4 border-b"
                >
                  <Mountain className="h-6 w-6 text-blue-600" />
                  <span className="text-lg font-bold text-gray-900">
                    DevJobs
                  </span>
                </Link>

                <div className="flex flex-col space-y-3">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Home</h3>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Subscription</h3>
                    <div className="pl-4 space-y-2">
                      <Link
                        to="#"
                        className="block text-sm text-gray-600 hover:text-blue-600"
                      >
                        For Startups
                      </Link>
                      <Link
                        to="#"
                        className="block text-sm text-gray-600 hover:text-blue-600"
                      >
                        For Enterprise
                      </Link>
                      <Link
                        to="#"
                        className="block text-sm text-gray-600 hover:text-blue-600"
                      >
                        For Agencies
                      </Link>
                      <Link
                        to="#"
                        className="block text-sm text-gray-600 hover:text-blue-600"
                      >
                        For Developers
                      </Link>
                    </div>
                  </div>

                  <Link
                    to="#"
                    className="font-semibold text-gray-900 hover:text-blue-600"
                  >
                    AutoPay
                  </Link>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Resources</h3>
                    <div className="pl-4 space-y-2">
                      <Link
                        to="#"
                        className="block text-sm text-gray-600 hover:text-blue-600"
                      >
                        Documentation
                      </Link>
                      <Link
                        to="#"
                        className="block text-sm text-gray-600 hover:text-blue-600"
                      >
                        Blog
                      </Link>
                      <Link
                        to="#"
                        className="block text-sm text-gray-600 hover:text-blue-600"
                      >
                        Help Center
                      </Link>
                      <Link
                        to="#"
                        className="block text-sm text-gray-600 hover:text-blue-600"
                      >
                        Community
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-3 pt-6 border-t">
                  <Button
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    onClick={handleConnectWallet}
                  >
                    Connect Wallet
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* No login/signup modals - replaced by Connect Wallet button */}
    </>
  )
}