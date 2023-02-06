import { Response } from "express";
import httpStatus from "http-status";
import HotelsService from "@/services/hotels-service";
import { AuthenticatedRequest } from "@/middlewares";

export async function getHotels(_req: AuthenticatedRequest, res: Response) {
    try {
        const userId = _req.userId;
        const event = await HotelsService.getHotels(userId);
        return res.status(httpStatus.OK).send(event);
    } catch (error) {
        if(error.name === "paymentError"){
            return res.status(httpStatus.PAYMENT_REQUIRED).send();
        }
        return res.status(httpStatus.NOT_FOUND).send();
    }
}

export async function getHotelWithRooms(_req: AuthenticatedRequest, res: Response) {
    try {
        const userId = _req.userId;
        let { hotelId } = _req.params;

        if(isNaN(Number(hotelId))){
            return res.status(httpStatus.NOT_FOUND).send({});
        }

        const hotel = await HotelsService.getHotelWithRooms(userId,Number(hotelId));
        return res.status(httpStatus.OK).send(hotel);
    } catch (error) {
        
        return res.status(httpStatus.NOT_FOUND).send({});
    }
}