"use server"

import { serializeCarData } from "@/lib/helper";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";


export async function bookTestDrive({
    carId,
    bookingDate,
    startTime,
    endTime,
    notes,
}) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("You must be logged in to book a test drive");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId }
        })

        if (!user) throw new Error("User not found in database")


        const car = await db.car.findUnique({
            where: { id: carId, status: "AVAILABLE" },
        });

        if (!car) throw new Error("Car not available for test drive");

        const existingBooking = await db.testDriveBooking.findFirst({
            where: {
                carId,
                bookingDate: new Date(bookingDate),
                startTime,
                status: { in: ["PENDING", "CONFIRMED"] },
            }
        });


        if (existingBooking) {
            throw new Error(
                "This time slot is already booked. Please select another time."
            );
        }

        const booking = await db.testDriveBooking.create({
            data: {
                carId,
                userId: user.id,
                bookingDate: new Date(bookingDate),
                startTime,
                endTime,
                notes: notes || null,
                status: "PENDING",
            },
        });

        revalidatePath(`/test-drive/${carId}`)
        revalidatePath(`/cars/${carId}`)

        return {
            success: true,
            data: booking
        }
    }
    catch (err) {
        console.error("Error booking test drive:", err);
        return {
            success: false,
            error: err.message || "Failed to book test drive",
        };
    }
}

export async function getUserTestDrives() {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("You must be logged in to book a test drive")

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        })

        if (!user) throw new Error("User not found in database");

        const bookings = await db.testDriveBooking.findMany({
            where: { userId: user.id },
            include: {
                car: true,
            },
            orderBy: { bookingDate: "desc" },
        });

        const formattedBookings = bookings.map((booking) => ({
            id: booking.id,
            carId: booking.carId,
            car: serializeCarData(booking.car),
            bookingDate: booking.bookingDate.toISOString(),
            startTime: booking.startTime,
            endTime: booking.endTime,
            status: booking.status,
            notes: booking.notes,
            createdAt: booking.createdAt.toISOString(),
            updatedAt: booking.updatedAt.toISOString(),
        }));

        return {
            success: true,
            data: formattedBookings
        }
    }
    catch (err) {
        console.error("Error fetching test drives:", err)
        return{
            success: false,
            error: err.message
        }
    }
}

export async function cancelTestDrive(bookingId){
    try{
        const { userId } = await auth();
        if (!userId) throw new Error("You must be logged in to book a test drive")

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        })

        if (!user) throw new Error("User not found in database");

        //get the booking

        const booking = await db.testDriveBooking.findUnique({
            where: {id:bookingId},
        })

        if(!booking){
            return{
                success:false,
                error: "Booking not found",
            }
        }

        if(booking.userId !== user.id || user.role !== "ADMIN"){
            return {
                success: false,
                error:"Unauthorized to cancel this booking",
            }
        }

        if(booking.status === "CANCELLED"){
            return{
                success: false,
                error: "Booking is already Cancelled",
            };
        }

        if(booking.status === "COMPLETED"){
            return{
                success: false,
                error: "Cannot cancel a completed booking",
            };
        }

        //update booking status

        await db.testDriveBooking.update({
            where: {id: bookingId},
            data: {status: "CANCELLED"}
        })

        revalidatePath("/reservations")
        revalidatePath("/admin/test-drives")
        

        return {
            success: true,
            message: "Test drive cancelled successfully",
        }
    }
    catch(err){
        console.error("Error Cancelling test drives:", error)
        return{
            success: false,
            error: err.message 
        }
    }
}