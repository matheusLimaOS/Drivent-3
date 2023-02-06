import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotels, getHotelWithRooms } from "@/controllers";

const hotelsRouter = Router();

hotelsRouter.all("/*", authenticateToken)
hotelsRouter.get("/", getHotels);
hotelsRouter.get("/:hotelId", getHotelWithRooms);

export { hotelsRouter };
