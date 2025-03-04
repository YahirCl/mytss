import React from 'react'

export default function ConfirmationModal({title = 'Confirmar Eliminación' , msg, onClose, textBtn} : {title?: string, msg: string, textBtn?: string, onClose:(confirmed: boolean) => void}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-black">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <p className="mb-4">{msg}</p>
            <div className="flex justify-end space-x-4">
            <button
                onClick={() => onClose(false)}
                className="px-4 py-2 font-semibold bg-gray-300 rounded hover:bg-gray-400 text-black"
            >
                Cancelar
            </button>
            <button
                onClick={() => onClose(true)}
                className="px-4 py-2 font-semibold bg-red-500 rounded hover:bg-red-600 text-black"
            >
                {textBtn}
            </button>
            </div>
        </div>
    </div>
  )
}
