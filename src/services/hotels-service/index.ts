import { notFoundError } from "@/errors";
import hotelRepository from "@/repositories/hotels-repository";

async function getHotels() {
  const hotels = await hotelRepository.findMany();

  if (!hotels) {
    throw notFoundError();
  }
  return hotels;
}

async function getHotelWithRooms(hotelId: number) {
  const hotel = await hotelRepository.findById(hotelId);
  if (!hotel) {
    throw notFoundError();
  }

  return hotel;
}

const HotelsService = {
  getHotelWithRooms,
  getHotels,
};

export default HotelsService;