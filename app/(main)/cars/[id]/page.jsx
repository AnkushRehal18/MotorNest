import { getCarById } from '@/actions/car-listing';
import { notFound } from 'next/navigation';
import React from 'react'
import CarDetails from './_components/car-details';

export async function generateMetaData({ params }) {
    const { id } = await params;
    console.log(id)
    const result = await getCarById(id);

    if (!result.success) {
        return {
            title: "Car Not Found | MotorNest",
            description: "The requested car could not be found"
        }
    }

    const car = result.data;

    return {
        title: `${car.year} ${car.make} ${car.model} | MotorNest`,
        description: car.description.substring(0, 160),
        openGraph: {
            images: car.images?.[0] ? [car.images[0]] : [],
        },
    };
}

const CarPage = async ({params}) => {

    const { id } = await params;
    const result = await getCarById(id);

    if(!result.success){
        notFound();
    }

    return (
        <div className='container mx-auto px-4 py-12'>
            <CarDetails car={result.data} testDriveInfo={result.data.testDriveInfo}/>
        </div>
    )
}

export default CarPage
