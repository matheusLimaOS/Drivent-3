import app, { init } from "@/app";
import httpStatus from "http-status";
import supertest from "supertest";
import { cleanDb, generateValidToken } from "../helpers";
import { createUser } from "../factories";
import { createEnrollmentWithAddress } from "../factories";
import { createTicketType } from "../factories";
import { createTicket } from "../factories";
import { createHotel, createRooms } from "../factories/hotels-factory";

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/hotels/");
  
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid", () => {
        it("should respond with status 404 when user does not have a enrollment", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
      
            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it("should respond with status 404 when user does not have a ticket", async () => {

            const user = await createUser();
            await createEnrollmentWithAddress(user);
            const token = await generateValidToken(user);

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it("should respond with status 402 when user have ticket but ticket its not PAID ", async () => {

            const user = await createUser();
            const enrollment = await createEnrollmentWithAddress(user);
            const token = await generateValidToken(user);
            const ticketType = await createTicketType();
            await createTicket(enrollment.id,ticketType.id,"RESERVED");

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it("should respond with status 402 when user have ticket but ticketType is remote ", async () => {

            const user = await createUser();
            const enrollment = await createEnrollmentWithAddress(user);
            const token = await generateValidToken(user);
            let ticketType = await createTicketType(true);

            await createTicket(enrollment.id,ticketType.id,"PAID");

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it("should respond with status 402 when user have ticket but ticketType does not include hotel ", async () => {

            const user = await createUser();
            const enrollment = await createEnrollmentWithAddress(user);
            const token = await generateValidToken(user);
            let ticketType = await createTicketType();

            await createTicket(enrollment.id,ticketType.id,"PAID");

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it("should respond with status 404 when does not have registered hotels", async () => {

            const user = await createUser();
            const enrollment = await createEnrollmentWithAddress(user);
            const token = await generateValidToken(user);
            let ticketType = await createTicketType(false,true);

            await createTicket(enrollment.id,ticketType.id,"PAID");

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it("should respond with status 200 when have hotels", async () => {

            const user = await createUser();
            const enrollment = await createEnrollmentWithAddress(user);
            const token = await generateValidToken(user);
            let ticketType = await createTicketType(false,true);
            await createTicket(enrollment.id,ticketType.id,"PAID");
            await createHotel();

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(Number),
                        name: expect.any(String),
                        image: expect.any(String),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String)
                    })
                ])
            );
        });
    });
});

describe("GET /hotels/:id", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/hotels/");
  
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid", () => {

        it("should respond with status 404 if hotelId does not exist", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
      
            const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it("should respond with status 404 when user does not have a enrollment", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const hotel = await createHotel();

            const response = await server.get("/hotels/"+hotel.id).set("Authorization", `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it("should respond with status 404 when user does not have a ticket", async () => {

            const user = await createUser();
            await createEnrollmentWithAddress(user);
            const token = await generateValidToken(user);
            const hotel = await createHotel();

            const response = await server.get("/hotels/"+hotel.id).set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it("should respond with status 402 when user have ticket but ticket its not PAID ", async () => {

            const user = await createUser();
            const enrollment = await createEnrollmentWithAddress(user);
            const token = await generateValidToken(user);
            const ticketType = await createTicketType();
            await createTicket(enrollment.id,ticketType.id,"RESERVED");
            const hotel = await createHotel();
        
            const response = await server.get("/hotels/"+hotel.id).set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it("should respond with status 402 when user have ticket but ticketType is remote ", async () => {

            const user = await createUser();
            const enrollment = await createEnrollmentWithAddress(user);
            const token = await generateValidToken(user);
            let ticketType = await createTicketType(true);
            await createTicket(enrollment.id,ticketType.id,"PAID");
            const hotel = await createHotel();

            const response = await server.get("/hotels/"+hotel.id).set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it("should respond with status 402 when user have ticket but ticketType does not include hotel ", async () => {

            const user = await createUser();
            const enrollment = await createEnrollmentWithAddress(user);
            const token = await generateValidToken(user);
            let ticketType = await createTicketType();
            await createTicket(enrollment.id,ticketType.id,"PAID");
            const hotel = await createHotel();

            const response = await server.get("/hotels/"+hotel.id).set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it("should respond with status 200 when all its correct", async () => {

            const user = await createUser();
            const enrollment = await createEnrollmentWithAddress(user);
            const token = await generateValidToken(user);
            let ticketType = await createTicketType(false,true);
            await createTicket(enrollment.id,ticketType.id,"PAID");
            const hotel = await createHotel();
            await createRooms(hotel.id);

            const response = await server.get("/hotels/"+hotel.id).set("Authorization", `Bearer ${token}`);
            
            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    image: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    Rooms:expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(Number),
                            name: expect.any(String),
                            capacity: expect.any(Number),
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String),
                            hotelId: expect.any(Number)
                        })
                    ])
                })
            );
        });
    });
});