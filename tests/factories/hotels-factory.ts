import faker from "@faker-js/faker";
import { Hotel, Room } from "@prisma/client";
import { prisma } from "@/config";

export function createHotel():Promise<Hotel> {
  return prisma.hotel.create({
    data:{
        name: faker.lorem.sentence(),
        image: faker.image.imageUrl()
    }
  });
}

export function createRooms(hotelId:number):Promise<Room> {
    return prisma.room.create({
      data:{
          name: faker.lorem.sentence(),
          capacity: faker.datatype.number({ min: 1, max: 10 }),
          hotelId
      }
    });
}