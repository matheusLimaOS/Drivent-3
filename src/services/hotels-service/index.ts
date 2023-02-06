import { notFoundError, paymentError } from "@/errors";

import hotelRepository from "@/repositories/hotels-repository";

async function getHotels(userId:number) {
  const user = await hotelRepository.findMany(userId);
  if(!user || !user.Enrollment[0].id || !user.Enrollment[0].Ticket[0] || !user.Enrollment[0].Ticket[0]){
    throw notFoundError();
  }
  if(user.Enrollment[0].Ticket[0].status !== "PAID" || user.Enrollment[0].Ticket[0].TicketType.isRemote === true || user.Enrollment[0].Ticket[0].TicketType.includesHotel === false){
    throw paymentError();
  }

  const hotels = await hotelRepository.findManyHotels();

  if (!hotels || hotels.length === 0) {
    throw notFoundError();
  }

  return hotels;
}

async function getHotelWithRooms(userId:number,hotelId: number) {
  
  const user = await hotelRepository.findMany(userId);
  if(!user || !user.Enrollment[0].id || !user.Enrollment[0].Ticket[0] || !user.Enrollment[0].Ticket[0]){
    throw notFoundError();
  }
  if(user.Enrollment[0].Ticket[0].status !== "PAID" || user.Enrollment[0].Ticket[0].TicketType.isRemote === true || user.Enrollment[0].Ticket[0].TicketType.includesHotel === false){
    throw paymentError();
  }

  const hotels = await hotelRepository.findById(hotelId);

  if (!hotels ) {
    throw notFoundError();
  }

  return hotels;
}

const HotelsService = {
  getHotelWithRooms,
  getHotels,
};

export default HotelsService;