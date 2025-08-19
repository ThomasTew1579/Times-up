import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

type MenuItemProps = {
  children: ReactNode
  href?: string
  onClick?: () => void
}

function MenuItem({ children, href, onClick }: MenuItemProps) {
  const baseClass = 'px-3 py-2 text-sm font-medium rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
  const inactiveClass = ' text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
  const activeClass = ' text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 ring-1 ring-inset ring-indigo-200 dark:ring-indigo-500/30'
  if (href) {
    const isExternal = /^https?:\/\//.test(href)
    if (isExternal) {
      return (
        <li className="list-none">
          <a className={baseClass + inactiveClass} href={href} target="_blank" rel="noreferrer">
            {children}
          </a>
        </li>
      )
    }
    return (
      <li className="list-none">
        <NavLink
          to={href}
          end={href === '/'}
          className={({ isActive }) =>
            (baseClass + (isActive ? activeClass : inactiveClass))
          }
        >
          {children}
        </NavLink>
      </li>
    )
  }
  return (
    <li className="list-none">
      <button className={baseClass + inactiveClass} onClick={onClick}>
        {children}
      </button>
    </li>
  )
}

export default MenuItem


