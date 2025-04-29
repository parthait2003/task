import connectDB from "@/config/database";
import { NextApiResponse, NextApiRequest } from "next";
import Rate from "@/models/rate";
import { NextResponse } from "next/server";



export async function PUT(request,{params}){
    const {id}= params;
    const{newbasecountry:basecountry,newforeigncurrency:foreigncurrency,newfromcountry:fromcountry,newtocountry:tocountry,
        newratecurrency:ratecurrency,newtransfertype:transfertype,newstatus:status,newunit:unit}=await request.json();
        await connectDB();
        await Rate.findByIdAndUpdate(id,{basecountry,foreigncurrency,fromcountry,tocountry,ratecurrency,transfertype,
         status,unit});
        return NextResponse.json({message:"rate created"},{status:200});
}

export async function GET(request,{params}) {
    const { id } = params;
    await connectDB();
    const rate = await Rate.findOne({ _id: id });
    return NextResponse.json({rate},{status:200});
}