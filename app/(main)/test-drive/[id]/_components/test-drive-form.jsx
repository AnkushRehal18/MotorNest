"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

const testDriveSchema = z.object({
    date: z.date({
        required_error: "Please Select a date for your test drive",
    }),
    timeSlot: z.string({
        required_error: "Please select a time slot"
    }),
    notes: z.string().optional(),
})

const TestDriveForm = ({ car, testDriveInfo }) => {

    const router = useRouter();
    const [availableTimeSlots, setAvailableTimeSlots] = useState([])
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [bookingDetails, setBookingDetails] = useState(null);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isValid }
    } = useForm({ 
        resolver: zodResolver(testDriveSchema),
        defaultValues: {
            date: undefined,
            timeSlot: undefined,
            notes: "",
        }
    });

    const dealership = testDriveInfo.dealership;
    return (
        <div>

        </div>
    )
}

export default TestDriveForm
