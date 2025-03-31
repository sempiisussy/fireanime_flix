"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Search, Bell, ChevronDown, FlameIcon as Fire } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Avatar, AvatarFallback } from "./ui/avatar"

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowSearch(false)
    }
  }

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80" : "bg-transparent"
      }`}
    >
      <div className="netflix-container">
        <div className="flex h-16 items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-foreground">
                <span className="sr-only">Toggle menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-background border-r border-border/40">
              <div className="flex items-center mb-8 mt-4">
                <Fire className="h-6 w-6 text-primary mr-2" />
                <span className="text-xl font-bold">FireAnime</span>
              </div>
              <nav className="flex flex-col gap-1">
                <Link href="/" className={`netflix-nav-item ${pathname === "/" ? "active" : ""}`}>
                  Home
                </Link>
                <Link href="/trending" className={`netflix-nav-item ${pathname === "/trending" ? "active" : ""}`}>
                  Trending
                </Link>
                <Link
                  href="/new-releases"
                  className={`netflix-nav-item ${pathname === "/new-releases" ? "active" : ""}`}
                >
                  New Releases
                </Link>
                <Link href="/calendar" className={`netflix-nav-item ${pathname === "/calendar" ? "active" : ""}`}>
                  Calendar
                </Link>
                <Link href="/genres" className={`netflix-nav-item ${pathname === "/genres" ? "active" : ""}`}>
                  Browse
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center space-x-2 mr-8">
            <Fire className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">FireAnime</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/" className={`netflix-nav-item ${pathname === "/" ? "active" : ""}`}>
              Home
            </Link>
            <Link href="/trending" className={`netflix-nav-item ${pathname === "/trending" ? "active" : ""}`}>
              Trending
            </Link>
            <Link href="/new-releases" className={`netflix-nav-item ${pathname === "/new-releases" ? "active" : ""}`}>
              New Releases
            </Link>
            <Link href="/calendar" className={`netflix-nav-item ${pathname === "/calendar" ? "active" : ""}`}>
              Calendar
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="netflix-nav-item flex items-center">
                  Browse <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-zinc-900 border border-zinc-800 w-48">
                <DropdownMenuItem asChild>
                  <Link href="/genres" className="w-full">
                    All Genres
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/genre/${btoa("Action").replaceAll("=", "")}`} className="w-full">
                    Action
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/genre/${btoa("Komödie").replaceAll("=", "")}`} className="w-full">
                    Comedy
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/genre/${btoa("Drama").replaceAll("=", "")}`} className="w-full">
                    Drama
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/genre/${btoa("Fantasy").replaceAll("=", "")}`} className="w-full">
                    Fantasy
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <div className="flex items-center ml-auto gap-4">
            {showSearch ? (
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Titles, people, genres"
                  className="w-[200px] lg:w-[300px] pl-8 bg-black border border-white/20 focus-visible:ring-1 focus-visible:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  onBlur={() => {
                    if (!searchQuery) setShowSearch(false)
                  }}
                />
              </form>
            ) : (
              <Button variant="ghost" size="icon" className="text-foreground" onClick={() => setShowSearch(true)}>
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}

            {/* <Button variant="ghost" size="icon" className="text-foreground relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              <span className="sr-only">Notifications</span>
            </Button> */}

            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-8">
                  <Avatar className="h-8 w-8 border-none">
                    <AvatarFallback className="bg-primary text-white">FA</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-900 border border-zinc-800 w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account" className="w-full">
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about" className="w-full">
                    About FireAnime
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/terms" className="w-full">
                    Terms of Service
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/privacy" className="w-full">
                    Privacy Policy
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar

