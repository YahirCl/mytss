import React, { useState } from 'react'
import { Pencil } from 'lucide-react'

export default function InformationComponent({children, title, data, type, name, isEdit, onChangeEdit, onClickSave} : 
  {
    children : React.ReactNode,
    title: string,
    data: string,
    type: 'select' | 'text' | 'date',
    name: string;
    isEdit: boolean,
    onChangeEdit: (value: boolean) => void,
    onClickSave: (data: string | boolean | null, name: string) => Promise<boolean>
  }) {

  let _label: string;
  if (data === 'false') {
    _label = 'Masculino';
  } else if(data === 'true') {
    _label = 'Femenino';
  } else if (data === ""){
    _label = 'No Proporcionado'
  } else {
    _label = data
  }

  //const [label] = useState(_label);
  const [value, setValue] = useState(data);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSave() {
    setIsLoading(true);

    let data: string | boolean | null;
    if(type === 'select') {
      data = value === "" ? null : (value === "true");
    } else {
      data = value === "" ? null : value;
    }

    const success = await onClickSave(data, name);
    if(success) {
      onChangeEdit(false);
      setIsLoading(false);
    }

  }

  return (
    <div className='flex my-5 items-center'>
        <div className="flex items-center gap-3 w-full">
            {children}
            <div className='w-full'>
              <h3 className="font-bold">{title}</h3>
              {isEdit ? 
                type !== 'select' ? 
                (<input
                  className='w-2/4 p-1 border rounded'
                  type={type} 
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />) 
                : 
                (
                <select
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-2/4 p-2 border rounded"
                >
                  <option value="">Ninguno...</option>
                  <option value="false">Masculino</option>
                  <option value="true">Femenino</option>
                </select>
                )
              : 
                <p className="text-gray-700">{_label}</p>}
            </div>
        </div>
        {isEdit ? 
          <div className="flex">
            {isLoading ? (
              <div className="text-gray-500 text-sm">Guardando...</div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={value === data} // Desactiva si no hay cambios
                  className={`${
                    value === data
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "text-green-700 hover:text-white border border-green-700 hover:bg-green-800"
                  } focus:ring-4 focus:outline-none font-medium rounded-lg text-xs px-4 py-2.5 text-center me-2 mb-2`}
                >
                  Guardar
                </button>
    
                <button
                  type="button"
                  onClick={() => {
                    onChangeEdit(false);
                    setValue(data === null ? "" : data);
                  }}
                  className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-xs px-4 py-2.5 text-center me-2 mb-2"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
          :
          <button className="text-gray-500 hover:text-black" type='button' onClick={() => onChangeEdit(true)}><Pencil size={19}/></button>
          }
    </div>
  )
}
