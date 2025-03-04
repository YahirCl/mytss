import React from 'react'

export default function DropDownMenu({dropdownRef, adjust, children} : {dropdownRef: React.RefObject<HTMLDivElement>, adjust: string, children : React.ReactNode}) {
  return (
    <div
      style={{ marginTop: adjust }} 
      className={`absolute right-3 top-10 w-56 text-black bg-slate-100 shadow-lg rounded-md z-10`} ref={dropdownRef}>
      {children}
    </div>
  )
}
