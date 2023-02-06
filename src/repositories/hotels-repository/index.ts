import { prisma } from "@/config";

async function findManyHotels() {
    return prisma.hotel.findMany();
}

async function findMany(userId:number) {
  return prisma.user.findFirst({
    where:{
        id:userId
    },
    include:{
        Enrollment:{
            include:{
                Ticket:{
                    include:{
                        TicketType:true,
                        Payment:true
                    }
                }
            }
        }
    }
  });
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
    findById,
    findManyHotels
};

export default hotelRepository;
