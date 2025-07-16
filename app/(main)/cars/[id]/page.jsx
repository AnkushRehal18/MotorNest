import React from 'react'

const CarPage = async({params}) => {
    const {id} = await params;
    console.log(id)
  return <div>carPage : id</div>
  
}

export default CarPage
