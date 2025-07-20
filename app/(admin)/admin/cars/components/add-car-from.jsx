"use client"

import React, { useState } from 'react'
import z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"]
const transmissions = ["Automatic", "Manual", "Semi-Automatic"]

const bodyTypes = [
  "SUV",
  "Sedan",
  "Hatchback",
  "Convertible",
  "Coupe",
  "Wagon",
  "Pickup"
]

const carStatues = ["AVAILABLE", "UNAVAILABLE", "SOLD"]

const AddCarForm = () => {

  const [activeTab, setActiveTab] = useState("ai")

  const carFormSchema = z.object({
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Make is required"),
    year: z.string().refine((val) => {
      const year = parseInt(val);
      return (
        !isNaN(year) && year >= 1900 && year <= new Date().getFullYear() + 1
      );
    }, "Valid year required"),
    price: z.string().min(1, "Price is required"),
    mileage: z.string().min(1, "Milage is required"),
    color: z.string().min(1, "Color is required"),
    fuelTypes: z.string().min(1, "Fuel Type is required"),
    transmissions: z.string().min(1, "Transmission is required"),
    bodyTypes: z.string().min(1, "Body Type is required"),
    seats: z.string().optional(),
    description: z.string().min(10, "Description  must be atleat 10 characters"),
    status: z.enum(["AVAILABLE", "UNAVAILABLE", "SOLD"]),
    featured: z.boolean().default(false),
  });

  const { register,
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      price: "",
      mileage: "",
      color: "",
      fuelType: "",
      transmission: "",
      bodyType: "",
      seats: "",
      description: "",
      status: "",
      description: "",
      status: "AVAILABLE",
      featured: false
    }
  });

  const onSubmit = async (data) => { };

  return (
    <div>
      <Tabs defaultValue="ai" className="mt-6"
        value={activeTab}
        onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="ai">AI Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="manual" className="mt-6">

          <Card>
            <CardHeader>
              <CardTitle>Car Details</CardTitle>
              <CardDescription>Enter the Details of the car you want to add.</CardDescription>
              <CardAction>Card Action</CardAction>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}
                className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='make'>Make</Label>
                    <Input id='make'
                      {...register("make")}
                      placeholder="e.g. toyota"
                      className={errors.make ? "border-red-500" : ""}
                    />
                    {errors.make && (
                      <p className='text-xs text-red-500'>
                        {errors.make.message}
                      </p>
                    )}
                  </div>

                  {/* model */}
                  <div className='space-y-2'>
                    <Label htmlFor='model'>Model</Label>
                    <Input id='model'
                      {...register("model")}
                      placeholder="e.g. toyota"
                      className={errors.model ? "border-red-500" : ""}
                    />
                    {errors.model && (
                      <p className='text-xs text-red-500'>
                        {errors.make.message}
                      </p>
                    )}
                  </div>

                  {/* year */}
                  <div className='space-y-2'>
                    <Label htmlFor='year'>Year</Label>
                    <Input id='year'
                      {...register("year")}
                      placeholder="e.g. 2002"
                      className={errors.year ? "border-red-500" : ""}
                    />
                    {errors.year && (
                      <p className='text-xs text-red-500'>
                        {errors.make.message}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className='space-y-2'>
                    <Label htmlFor='price'>Price ($)</Label>
                    <Input id='price'
                      {...register("price")}
                      placeholder="e.g. 20,000"
                      className={errors.price ? "border-red-500" : ""}
                    />
                    {errors.price && (
                      <p className='text-xs text-red-500'>
                        {errors.make.message}
                      </p>
                    )}
                  </div>

                  {/* Mileage */}
                  <div className='space-y-2'>
                    <Label htmlFor='mileage'>Mileage</Label>
                    <Input id='mileage'
                      {...register("mileage")}
                      placeholder="e.g. 15000"
                      className={errors.mileage ? "border-red-500" : ""}
                    />
                    {errors.mileage && (
                      <p className='text-xs text-red-500'>
                        {errors.make.message}
                      </p>
                    )}
                  </div>

                  {/* color */}
                  <div className='space-y-2'>
                    <Label htmlFor='color'>Color</Label>
                    <Input id='color'
                      {...register("color")}
                      placeholder="e.g. Blue"
                      className={errors.color ? "border-red-500" : ""}
                    />
                    {errors.color && (
                      <p className='text-xs text-red-500'>
                        {errors.make.message}
                      </p>
                    )}
                  </div>

                  {/* select fuel type */}

                  <div className='space-y-2'>
                    <Label htmlFor='fuelType'>Fuel Type</Label>
                    <Select onValueChange={value => setValue("fuelType", value)}
                      defaultValue={getValues("fuelType")} >
                      <SelectTrigger className={errors.fuelType ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select fuel Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {fuelTypes.map((type) => {
                          return (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>

                    {errors.fuelType && (
                      <p className='text-xs text-red-500'>
                        {errors.fuelType.message}
                      </p>
                    )}
                  </div>

                  {/* select transmission */}

                  <div className='space-y-2'>
                    <Label htmlFor='transmission'>Transmission</Label>
                    <Select onValueChange={value => setValue("transmission", value)}
                      defaultValue={getValues("transmission")} >
                      <SelectTrigger className={errors.transmission ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        {transmissions.map((type) => {
                          return (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>

                    {errors.transmission && (
                      <p className='text-xs text-red-500'>
                        {errors.transmission.message}
                      </p>
                    )}
                  </div>

                  {/* select body type */}
                  <div className='space-y-2'>
                    <Label htmlFor='bodyType'>Body Type</Label>
                    <Select onValueChange={value => setValue("bodyType", value)}
                      defaultValue={getValues("bodyType")} >
                      <SelectTrigger className={errors.bodyType ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select Body Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {bodyTypes.map((type) => {
                          return (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>

                    {errors.bodyType && (
                      <p className='text-xs text-red-500'>
                        {errors.bodyType.message}
                      </p>
                    )}
                  </div>

                  {/* seats */}

                  <div className='space-y-2'>
                    <Label htmlFor="seats">
                      Number of Seats{" "}
                      <span className='text-sm text-gray-500'>(Optional)</span>
                    </Label>
                    <Input
                      id="seats"
                      {...register("seats")}
                      placeholder="e.g. 5" />
                  </div>

                  {/* status */}

                  <div className='space-y-2'>
                    <Label htmlFor='status'>Status</Label>
                    <Select onValueChange={value => setValue("status", value)}
                      defaultValue={getValues("status")} >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {carStatues.map((status) => {
                          return (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0) + status.slice(1).toLocaleLowerCase()}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>

                    {errors.status && (
                      <p className='text-xs text-red-500'>
                        {errors.status.message}
                      </p>
                    )}
                  </div>

                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ai" className="mt-6">Change your password here.</TabsContent>
      </Tabs>
    </div>
  )
}

export default AddCarForm
