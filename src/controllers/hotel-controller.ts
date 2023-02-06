import { Request, Response } from "express";
import httpStatus from "http-status";
import HotelsService from "@/services/hotels-service";

export async function getHotels(_req: Request, res: Response) {
    try {
        const event = await HotelsService.getHotels();
        return res.status(httpStatus.OK).send(event);
    } catch (error) {
        return res.status(httpStatus.NOT_FOUND).send({});
    }
}

export async function getHotelWithRooms(_req: Request, res: Response) {
    try {
        let { hotelId } = _req.params;

        if(isNaN(Number(hotelId))){
            return res.status(httpStatus.NOT_FOUND).send({});
        }

        const hotel = await HotelsService.getHotelWithRooms(Number(hotelId));
        return res.status(httpStatus.OK).send(hotel);
    } catch (error) {
        return res.status(httpStatus.NOT_FOUND).send({});
    }
}