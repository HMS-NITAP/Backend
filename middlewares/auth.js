const jwt = require('jsonwebtoken');
const { PrismaClient } = require("@prisma/client");
const accountType = require("../constant/AccountType");

const Prisma = new PrismaClient();

exports.auth = async (req,res,next) => {
    try{
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");
        if(!token){
            return res.status(404).json({
                success:false,
                message:"Token Not Found",
            });
        };

        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            req.user = decode;
        }catch(e){
            return res.status(400).json({
                success:false,
                message:"Token is Invalid",
                error:e,
            })
        }
        next();
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Error Occured while Authorization",
        })
    }
}

exports.isStudent = async (req,res,next) => {
    try{
        const details = await Prisma.user.findUnique({where : {email:req.user.email}});
        if(details.accountType !== "STUDENT"){
            return res.status(401).json({
                success:false,
                message:"Only Student is Authorized in this Route",
            })
        }
        next();
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"User Role cannot be verified",
        })
    }
}

exports.isOfficial = async (req,res,next) => {
    try{
        const details = await Prisma.user.findUnique({where : {email:req.user.email}});
        console.log("Details : ",details);
        if(details.accountType !== "OFFICIAL"){
            return res.status(401).json({
                success:false,
                message:"Only Official is Authorized in this Route",
            })
        }
        next();
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"User Role cannot be verified",
        })
    }
}

exports.isStaff = async (req,res,next) => {
    try{
        const details = await Prisma.user.findUnique({email:req.user.email});
        if(details.accountType !== (accountType.Staff || accountType.Admin)){
            return res.status(401).json({
                success:false,
                message:"Only Staff is Authorized in this Route",
            })
        }
        next();
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"User Role cannot be verified",
        })
    }
}

exports.isWorker = async (req,res,next) => {
    try{
        const details = await Prisma.user.findUnique({email:req.user.email});
        if(details.accountType !== (accountType.Worker || accountType.Admin)){
            return res.status(401).json({
                success:false,
                message:"Only Worker is Authorized in this Route",
            })
        }
        next();
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"User Role cannot be verified",
        })
    }
}

exports.isSecurity = async (req,res,next) => {
    try{
        const details = await Prisma.user.findUnique({email:req.user.email});
        if(details.accountType !== (accountType.Security || accountType.Admin)){
            return res.status(401).json({
                success:false,
                message:"Only Security is Authorized in this Route",
            })
        }
        next();
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"User Role cannot be verified",
        })
    }
}