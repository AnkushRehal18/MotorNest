import { getSavedCars } from '@/actions/car-listing';
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'
import SavedCarList from './_components/saved-car-list';

const SavedCarPage = async () => {
    const {userId} = await auth();
    if(!userId){
        redirect("/sign-in?redirect=/saved-cars")
    }

    //fetch saved cars on the server
    const savedCarResult = await getSavedCars();

  return (
    <div className='container mx-auto px-4 py-12'>
        <h1 className='text-6xl mb-6 gradient-title'>Your Saved Cars</h1>
        <SavedCarList initialData={savedCarResult}/>
    </div>
  )
}

export default SavedCarPage
