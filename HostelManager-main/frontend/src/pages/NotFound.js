import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'

function NotFound() {
    const navigate = useNavigate()

    setTimeout(() => {
        navigate('/')
    }, 1500);
  return (
   <>

   <div className="conteiner text-center">
    404 this Page is not Found 
    

   </div>
   </>
  )
}

export default NotFound
