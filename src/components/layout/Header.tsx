'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { FaUser, FaCog, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa'
import { MdSpaceDashboard } from 'react-icons/md'
import { IoCalendarClearOutline } from 'react-icons/io5'
import TarevityLogo from '../logo/TarevityLogo'
import TarevityIcon from '../logo/TarevityIcon'
import UserImage from '../common/UserImage'
import NotificationDropdown from '../notifications/NotificationDropdown'
import { useProfileQuery } from '@/hooks/useProfileQuery'

export default function Header() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: profileData, refetch: refetchProfile } = useProfileQuery({
    enabled: status === 'authenticated',
  })

  useEffect(() => {
    if (status === 'authenticated') {
      refetchProfile()
    }
  }, [status, refetchProfile])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const isAuthenticated = status === 'authenticated' && !!session?.user

  return (
    <header className="bg-HeaderBgLight dark:bg-HeaderBgDark shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link
                href={isAuthenticated ? '/dashboard' : '/'}
                title="Tarevity"
              >
                <TarevityLogo className="hidden w-30 fill-black sm:flex dark:fill-white" />
                <TarevityIcon className="flex w-12 fill-black sm:hidden dark:fill-white" />
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center justify-center">
                {/* Notification Dropdown Component */}
                <NotificationDropdown />

                <div className="border-BorderLight hover:bg-BorderLight dark:hover:bg-BorderDark dark:border-BorderDark mr-3 cursor-pointer rounded-lg border-2 p-2 transition-all duration-300">
                  <IoCalendarClearOutline className="h-5 w-5" />
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  {/* Profile Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      aria-label="Open user menu"
                      onClick={toggleDropdown}
                      className="border-BorderLight dark:border-BorderDark flex items-center rounded-full border-2 transition-colors duration-300 focus:outline-none"
                      aria-expanded={isDropdownOpen}
                    >
                      <span className="sr-only">Open user menu</span>
                      <UserImage onClick={toggleDropdown} />
                    </button>

                    {/* Dropdown menu */}
                    {isDropdownOpen && (
                      <div
                        className={`dark:bg-BlackLight absolute right-0 z-50 mt-2 w-60 origin-top-right rounded-md border-none bg-white p-1 shadow-lg transition-all duration-300`}
                      >
                        <div className="border-b border-gray-200 px-4 py-2 dark:border-gray-700">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {profileData?.name}
                          </p>
                          <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                            {profileData?.email}
                          </p>
                        </div>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FaUser className="mr-2 inline" />
                          Profile
                        </Link>
                        <Link
                          href="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FaCog className="mr-2 inline" />
                          Settings
                        </Link>
                        <button
                          aria-label="Logout"
                          onClick={() => {
                            setIsDropdownOpen(false)
                            signOut({ callbackUrl: '/' })
                          }}
                          className="flex w-full items-center justify-start px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <FaSignOutAlt className="mr-2 inline" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden font-medium sm:flex sm:items-center sm:gap-3">
                <Link
                  href="/auth/login"
                  className="dark:hover:bg-BorderDark/40 hover:bg-BorderLight/70 text-primary dark:border-BorderDark border-BorderLight inline-flex items-center rounded-lg border bg-transparent px-3 py-2 backdrop-blur-sm transition-colors duration-300 dark:text-white"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-primary hover:bg-primary/80 inline-flex items-center rounded-md px-3 py-2 text-white transition-all duration-300"
                >
                  Sign up
                </Link>
              </div>
            )}

            <div className="-mr-2 flex items-center sm:hidden">
              <button
                aria-label="Open main menu"
                onClick={toggleMenu}
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <FaTimes
                    size={22}
                    className="fill-BlackLight dark:fill-white"
                  />
                ) : (
                  <FaBars
                    className="fill-BlackLight dark:fill-white"
                    size={22}
                  />
                )}
              </button>
            </div>
          </div>
        </div>

        <div
          className={`dark:bg-HeaderBgDark absolute right-0 left-0 z-10 w-full transform bg-white transition-all duration-300 ease-in-out ${isMenuOpen ? 'visible translate-x-0 opacity-100' : 'invisible -translate-x-10 opacity-0'} `}
        >
          <div className="space-y-1 pt-2 pb-3">
            {isAuthenticated ? (
              <>
                {/* Mobile user info */}
                <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                  <div className="flex items-center">
                    <UserImage />
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800 dark:text-white">
                        {session.user.name}
                      </div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {session.user.email}
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="text-BlackLight block px-3 py-2 dark:text-white"
                >
                  <MdSpaceDashboard className="mr-1 inline" />
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="text-BlackLight block px-3 py-2 dark:text-white"
                >
                  <FaUser className="mr-1 inline" />
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="text-BlackLight block px-3 py-2 dark:text-white"
                >
                  <FaCog className="mr-1 inline" />
                  Settings
                </Link>
                <button
                  aria-label="Logout"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-BlackLight block w-full px-3 py-2 text-left dark:text-white"
                >
                  <FaSignOutAlt className="mr-1 inline" />
                  Logout
                </button>
              </>
            ) : (
              <div
                className={`${isMenuOpen ? 'visible translate-x-0 opacity-100' : 'invisible -translate-x-10 opacity-0'} transition-all duration-300 ease-in-out`}
              >
                <Link
                  href="/auth/login"
                  className="text-BlackLight block px-3 py-2 font-medium dark:text-white"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="text-BlackLight block px-3 py-2 font-medium dark:text-white"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
