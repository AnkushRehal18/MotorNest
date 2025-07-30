export const serializeCarData = (car, whishlisted = false) => {
    return{
        ...car,
        price: car.price ? parseFloat(car.price.toString()):0,
        createdAt: car.createdAt?.toISOString(),
        updatedAt: car.updatedAt?.toISOString(),
        whishlisted: whishlisted,
    }
}

export const formatCurrency = (amount)=>{
    return new Intl.NumberFormat("en-US",{
        style: "currency",
        currency:"USD",
    }).format(amount)
};

