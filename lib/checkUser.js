import { currentUser } from "@clerk/nextjs/server"
import { db } from "./prisma";

export const checkUser = async()=>{
    const user = await currentUser();
    console.log("user");
    if(!user){
        return null;
    }

    try{
        const loggedInUser = await db.user.findUnique({
            where:{
                clerkUserId: user.id,
            },
        });

        if(loggedInUser){
            return loggedInUser;
        };

        const newUser = await db.user.create({
            data:{
                clerkUserId : user.id,
                name: `${user.firstName} ${user.lastname}`,
                imageUrl: user.imageUrl,
                email: user.emailAddress[0].emailAddress,
            }
        })

        return newUser
    }
    catch(err){
        console.log("Error" + err.message);
    }
}