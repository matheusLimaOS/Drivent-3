import { notFoundError, paymentError } from "@/errors";

import hotelRepository from "@/repositories/hotels-repository";

async function getHotels(userId:number) {
  const user = await hotelRepository.findMany(userId);
  if (!user) {
    throw notFoundError();
  }
  else if(!user.Enrollment[0].id){
    throw notFoundError();
  }
  else if(!user.Enrollment[0].Ticket[0]){
    throw notFoundError();
  }
  else if(user.Enrollment[0].Ticket[0].status !== "PAID"){
    throw paymentError();
  }
  else if(user.Enrollment[0].Ticket[0].TicketType.isRemote === true){
    throw paymentError();
  }
  else if(user.Enrollment[0].Ticket[0].TicketType.includesHotel === false){
    throw paymentError();
  }

  const hotels = await hotelRepository.findManyHotels();

  if (!hotels) {
    throw notFoundError();
  }

  return hotels;
}

async function getHotelWithRooms(userId:number,hotelId: number) {
  const user = await hotelRepository.findMany(userId);
  if (!user) {
    throw notFoundError();
  }
  else if(!user.Enrollment[0].id){
    throw notFoundError();
  }
  else if(!user.Enrollment[0].Ticket[0]){
    throw notFoundError();
  }
  else if(user.Enrollment[0].Ticket[0].status !== "PAID"){
    throw paymentError();
  }
  else if(user.Enrollment[0].Ticket[0].TicketType.isRemote === true){
    throw paymentError();
  }
  else if(user.Enrollment[0].Ticket[0].TicketType.includesHotel === false){
    throw paymentError();
  }

  const hotels = await hotelRepository.findById(hotelId);

  if (!hotels) {
    throw notFoundError();
  }

  return hotels;
}

const HotelsService = {
  getHotelWithRooms,
  getHotels,
};

export default HotelsService;