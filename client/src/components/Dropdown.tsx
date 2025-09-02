import type { ReactNode } from 'react';

type DropdownProps = {
    title: string
    children: ReactNode;
}

function Dropdown({title, children}: DropdownProps){
    return (
        <details className="rounded-2xl border mb-4 border-zinc-200 p-2 md:p-4">
          <summary className="cursor-pointer  text-white select-none font-medium">
            {title}
          </summary>
          {children}
        </details>
    )
}

export default Dropdown