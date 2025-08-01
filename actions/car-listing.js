"use server"

import { serializeCarData } from "@/lib/helper";
import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/dist/types/server";
import { revalidatePath } from "next/cache";


export async function getCarFilters() {
    try {
        //getting unique makes
        const makes = await db.car.findMany({
            where: { status: "AVAILABLE" },
            select: { make: true },
            distinct: ["make"],
            orderBy: { make: "asc" },
        });

        //getting unique body types

        const bodyTypes = await db.car.findMany({
            where: { status: "AVAILABLE" },
            select: { bodyType: true },
            distinct: ["bodyTypes"],
            orderBy: { bodyType: "asc" },
        });

        //getting unique fuel types
        const fuelTypes = await db.car.findMany({
            where: { status: "AVAILABLE" },
            select: { fuelType: true },
            distinct: ["fuelType"],
            orderBy: { fuelType: "asc" },
        });

        //getting unique transmission types
        const transmission = await db.car.findMany({
            where: { status: "AVAILABLE" },
            select: { transmission: true },
            distinct: ["transmission"],
            orderBy: { transmission: "asc" },
        });

        //get min and max prices using prisma aggregation

        const priceAggregations = await db.car.aggregate({
            where: { status: "AVAILABLE" },
            _min: { price: true },
            _max: { price: true },
        });

        return {
            success: true,
            data: {
                makes: makes.map((item) => { item.make }),
                bodyTypes: bodyTypes.map((item) => { item.bodyType }),
                fuelTypes: fuelTypes.map((item) => { item.fuelType }),
                transmission: transmission.map((item) => { item.transmission }),
                priceRange: {
                    min: priceAggregations._min.price
                        ? parseFloat(priceAggregations._min.price.toString())
                        : 0,

                    max: priceAggregations._max.price
                        ? parseFloat(priceAggregations._max.price.toString())
                        : 100000,
                }

            }
        }
    }
    catch (err) {
        throw new Error("Error fetching car filters:" + err.message);
    }
}


export async function getCars({
    search = "",
    make = "",
    bodyType = "",
    fuelType = "",
    transmission = "",
    minPrice = 0,
    maxPrice = Number.MAX_SAFE_INTEGER,
    sortBy = "newest", // Options: newest, priceAsc, priceDesc
    page = 1,
    limit = 6,
}) {
    try {
        const { userId } = await auth();
        let dbUser = null;

        if (userId) {
            dbUser = await db.user.findUnique({
                where: { clerkUerId: userId },
            });
        };

        let where = {
            status: "AVAILABLE"
        };

        if (search) {
            where.OR = [
                { make: { conatins: search, mode: "insensitive" } },
                { model: { contains: search, mode: "insensitive" } },
                { description: { conatins: search, mode: "insensitive" } }
            ];
        }

        if (make) where.make = { equals: make, mode: "insensitive" };
        if (bodyType) where.bodyType = { equals: bodyType, mode: "insensitive" };
        if (fuelType) where.fuelType = { equals: fuelType, mode: "insensitive" };
        if (transmission)
            where.transmission = { equals: transmission, mode: "insensitive" };

        where.price = {
            gte: parseFloat(minPrice) || 0,
        };

        if (maxPrice && maxPrice < Number.MAX_SAFE_INTEGER) {
            where.price.lte = parseFloat(maxPrice);
        }


        const skip = (page - 1) * limit;

        let orderBy = {};

        switch (sortBy) {
            case "priceAsc":
                orderBy = { price: "asc" }
                break;

            case "priceDesc":
                orderBy = { price: "desc" };
                break;

            case "newest":
                orderBy = { price: "desc" };
                break;
        }

        const totalCars = await db.car.count({
            where
        });

        const cars = await db.car.findMany({
            where,
            take: limit,
            skip,
            orderBy,
        });

        let wishlisted = new Set();

        if (dbUser) {
            const savedCars = await db.userSavedCar.findMany({
                where: { userId: dbUser.id },
                select: { carId: true },
            });

            wishlisted = new Set(savedCars.map((saved) => saved.carId));
        }

        //serialize and check wishlist status

        const serializedCars = cars.map((car) =>
            serializeCarData(car, wishlisted.has(car.id))
        );

        return {
            success: true,
            data: serializedCars,
            pagination: {
                total: totalCars,
                page,
                limit,
                page: Math.ceil(totalCars / limit),
            },
        };
    }

    catch (err) {
        throw new Error("Error fetching cars:" + err.message);
    }
}


export async function toggleSavedCar(carId) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId }
        });

        if (!user) throw new Error("User Not Found");

        const car = await db.car.findUnique({
            where: { id: carId }
        });

        if (!car) {
            return {
                success: false,
                error: "Car not found"
            };
        };

        const existingSave = await db.userSavedCar.findUnique({
            where: {
                userId_carId: {
                    userId: user.id,
                    carId,
                },
            },
        });

        // if car is already saved, remove it
        if (existingSave) {
            await db.userSavedCar.delete({
                where: {
                    userId_carId: {
                        userId: user.id,
                        carId,
                    },
                },
            });

            revalidatePath(`/saved-cars`);
            return {
                success: true,
                saved: false,
                message: "Car removed from favourites",
            }
        }

        // If car is not saved, add it

        await db.userSavedCar.create({
            data: {
                userId: user.id,
                carId,
            },
        });

        revalidatePath(`/saved-cars`);
        return{
            success: true,
            saved: true,
            message: "Car added to favourties",
        };
    }
    catch (err) {
        throw new Error("Error toggling saved car: "+ err.message)
    }
}