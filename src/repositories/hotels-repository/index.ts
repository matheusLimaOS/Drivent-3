import { prisma } from "@/config";

async function findMany() {
  return prisma.hotel.findMany();
}

async function findById(hotelId:number) {
    return prisma.hotel.findFirst({
        include:{
            Rooms:true
        },
        where:{
            id:hotelId
        }
    });
  }

const hotelRepository = {
    findMany,
    findById
};

export default hotelRepository;
