"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import { v4 as uuidv4 } from 'uuid';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { chatSession } from "../../../utils/GeminAiModel";
import { LoaderCircle } from "lucide-react";
import moment from 'moment'
import { MockInterview } from "../../../utils/schema";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db"
import { useRouter } from 'next/navigation';  // For App Router

function AddNewInterview(){

    const [openDialog,setOpenDialog]=useState(false)
    const [jobPosition,setjobposition]=useState()
    const [jobDesc,setjobdesc]=useState()
    const [jobyears,setjobyears]=useState()
    const [loading,setLoading]=useState(false)
    const [jsonresp,setjsonresponse]=useState([])
    const {user}=useUser();
    const router=useRouter();
    const onSubmit= async(e)=>{
        setLoading(true)
        e.preventDefault()
        console.log(jobPosition,jobDesc,jobyears)
        const InputPrompt=" Job role/Job position:"+ jobPosition+ "Job Description:"+jobDesc+"Years of experience "+ jobyears+" based on above information give"+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" interview questions and answers in json format,give as json format"
        const result=await chatSession.sendMessage(InputPrompt);
        const jsonresp=(result.response.text()).replace('```json','').replace('```','')
        console.log(JSON.parse(jsonresp));
        setjsonresponse(jsonresp)
        
        if(jsonresp){
            const resp= await db.insert(MockInterview)
            .values({
                mockId:uuidv4(),
                jsonMockResp :jsonresp,
                jobPosition:jobPosition,
                jobDesc:jobDesc,
                jobExperiance:jobyears,
                createdBy:user?.primaryEmailAddress?.emailAddress,
                createdAt:moment().format('dd-mm-yyyy')
            }).returning({mockId:MockInterview.mockId})
            console.log("id inserted:",resp)
            if(resp){
                setOpenDialog(false)
                router.push('./dashboard/interview/'+resp[0]?.mockId)
            }
        }
        else{
            console.log("ERROR")
        }
       

        setLoading(false)
    }
    return(
        <div>
            <div className='p-10 border-rounded-lg bg-secondary hover:scale-105 hover:shadow-md 
                 cursor-pointer transition-all' onClick={()=>setOpenDialog(true)}>
                <h2 className='font-bold text-lg text-center'>+ Add New</h2>
            </div>
                <Dialog open={openDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Tell us about your job interviewing</DialogTitle>
                    <DialogDescription asChild>
                        <form onSubmit={onSubmit}>
                        <div>
                           <h2 > Add Details about your job position/role,job Descibtion and years of Experience</h2>
                           <div className="mt-7 my-3">
                            <label>Job role/Job position </label>
                              <Input placeholder="Ex.Full Stack Developer" required
                               onChange={(event)=>setjobposition(event.target.value)}></Input>
                           </div>
                           <div className="my-3">
                            <label>Job Description</label>
                              <Textarea placeholder="Ex.React,Angular,NodeJs,MySql etc." required 
                              onChange={(event)=>setjobdesc(event.target.value)}></Textarea>
                           </div>
                           <div className="my-3">
                            <label>Years of experience</label>
                              <Input placeholder="Ex.5" type="number" max="100" required 
                              onChange={(event)=>setjobyears(event.target.value)}></Input>
                           </div>
                           <div className="flex gap-5 justify-end mt-4">
                                 <Button type="button" variant="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
                                 <Button type="submit" disabled={loading}>
                                {loading?
                                    <>
                                    <LoaderCircle className="animate-spin"/>'generating from Ai'
                                    </>:'start Interview'
                                }Start Interview</Button>
                            </div>
                       </div>
                    </form>
                     
                       
                    </DialogDescription>
                    </DialogHeader>
                </DialogContent>
                </Dialog>

        </div>
    )
}
export  default AddNewInterview