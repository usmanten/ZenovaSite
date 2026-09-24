'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import React from 'react'
import { cn } from '@/lib/utils'

const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Our Story', href: '/about' },
    { name: 'Contact', href: '/contact' },
]

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(prev => {
                if (window.scrollY > 80) return true
                if (window.scrollY < 40) return false
                return prev
            })
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className="contents">
            <nav
                data-state={menuState && 'active'}
                className={cn(
                    'sticky top-0 z-20 w-full border-b px-2 transition-all duration-300',
                    isScrolled ? 'border-transparent' : 'border-blush-100 bg-white'
                )}>
                <div
                    className={cn(
                        'mx-auto max-w-6xl border transition-all duration-300',
                        isScrolled
                            ? 'mt-3 max-w-2xl rounded-2xl border-blush-100 bg-white/90 px-5 shadow-lg shadow-black/5 backdrop-blur-lg lg:px-6'
                            : 'border-transparent px-6 lg:px-12'
                    )}>
                    <div className={cn("relative flex flex-wrap items-center justify-between gap-6 lg:gap-0", isScrolled ? "py-2.5 lg:py-3" : "py-4")}>
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                data-nav-logo
                                className="flex items-center space-x-2">
                                <Image
                                    src="/logo.png"
                                    alt="Zenova Strips"
                                    width={120}
                                    height={52}
                                    style={{ height: "36px", width: "auto" }}
                                />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 text-blush-950 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className="text-blush-950/70 hover:text-blush-600 block duration-150">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Link
                            href="/catalog#products"
                            className="hidden items-center justify-center rounded-full bg-blush-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-blush-700 active:scale-[0.98] lg:inline-flex">
                            Shop
                        </Link>

                        <div className="in-data-[state=active]:flex absolute inset-x-0 top-full hidden w-full flex-wrap items-center justify-end space-y-6 border-b border-blush-100 bg-white p-6 lg:hidden">
                            <ul className="w-full space-y-6 text-base">
                                {[...menuItems, { name: 'Shop', href: '/catalog#products' }].map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setMenuState(false)}
                                            className="text-blush-950/70 hover:text-blush-600 block duration-150">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
