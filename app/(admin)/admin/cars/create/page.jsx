import React from 'react'
import AddCarForm from '../components/add-car-from'

export const metadata = {
    title: "Add new Car | motorNest Admin",
    description: "Add a new car to the marketplace"    
}
const AddCarPage = () => {
  return (
    <div className='p-6 '>
      <h1 className='text-2xl font-bold mb-6'>Add new Car</h1>
      <AddCarForm/>
    </div>
  )
}

export default AddCarPage
