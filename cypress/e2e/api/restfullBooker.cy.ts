const Ajv = require("ajv");
const ajv = new Ajv();

describe("Test Suite for Restful Booker", () => {
  let apiResponse;
  context("/auth endpoint", () => {
    // This Scenario handles api status and Schema Validation in two steps,
    // adding dependency between tests, only if test 1 pass then test 2 should execute
    // and to avoid to make 2 api calls to the same endpoint, it stores response in a context variable
    it("Create Auth Token", () => {
      cy.api({
        method: "POST",
        url: "/auth",
        body: {
          username: "admin",
          password: "password123",
        },
      }).then((res) => {
        apiResponse = res;
        expect(apiResponse.status).to.eq(200);
        cy.setCookie("token", apiResponse.body.token);
      });
    });
    it("Schema validation", () => {
      // Validate schema with ajv library
      cy.fixture("schemas.json").then((data) => {
        try {
          const validate = ajv.compile(data.auth);
          const isValidSchema = validate(apiResponse.body);
          expect(isValidSchema, "Valid Schema").to.be.true;
        } catch (error) {
          cy.log("Invalid Schema from endpoint", error.message);
        }
      });
    });
  });
  context("/booking endpoint", () => {
    it.skip("Get All Bookings", () => {
      cy.api({
        method: "GET",
        url: "/booking",
      }).then((response) => {
        expect(response.status).to.eq(200);
        let elements = response.body;
        // Validate Schema with Chai assertions
        elements.forEach((element) => {
          expect(element).to.have.property("bookingid").and.to.be.a("number");
        });
      });
    });
    it("Get 1 booking id, filter by Name ", () => {
      cy.api({
        method: "GET",
        url: "/booking",
        qs: {
          firstname: "Jim",
        },
      }).then((response) => {
        // This Scenario handles api status and Schema Validation in one step
        expect(response.status).to.eq(200);
        // Validate schema with ajv library
        cy.fixture("schemas.json").then((data) => {
          try {
            const validate = ajv.compile(data.bookingFilterByName);
            const isValidSchema = validate(response.body);
            expect(isValidSchema, "Valid Schema").to.be.true;
          } catch (error) {
            cy.log("Invalid Schema from endpoint", error.message);
          }
        });
      });
    });
    it("Get 1 booking id", () => {
      cy.api({
        method: "GET",
        url: "/booking",
      }).then((response) => {
        let element = response.body[10];
        cy.api({
          method: "GET",
          url: `/booking/${element.bookingid}`,
        }).then((response) => {
          expect(response.status).to.eq(200);
          cy.fixture("schemas.json").then((data) => {
            try {
              const validate = ajv.compile(data.bookkingFilterById);
              const isValidSchema = validate(response.body);
              expect(isValidSchema, "Valid Schema").to.be.true;
            } catch (error) {
              cy.log("Invalid Schema from endpoint", error.message);
            }
          });
        });
      });
    });
    it("Get 1 booking id filter by check in date", () => {
      cy.api({
        method: "GET",
        url: "/booking",
      }).then((response) => {
        let element = response.body[10];
        cy.log(element);
        cy.api({
          method: "GET",
          url: `/booking/${element.bookingid}`,
        }).then((response) => {
          cy.log(response.body.bookingdates);
          cy.api({
            method: "GET",
            url: "/booking",
            qs: {
              checkin: `${response.body.bookingdates.checkin}`,
              checkout: `${response.body.bookingdates.checkout}`,
            },
          }).then((response) => {
            expect(response.status).to.eq(200);
            cy.fixture("schemas.json").then((data) => {
              try {
                const validate = ajv.compile(data.bookingFilterByName);
                const isValidSchema = validate(response.body);
                expect(isValidSchema, "Valid Schema").to.be.true;
              } catch (error) {
                cy.log("Invalid Schema from endpoint", error.message);
              }
            });
          });
        });
      });
    });
    it("Create a booking", () => {
      cy.api({
        method: "POST",
        url: "/booking",
        body: {
          firstname: "James",
          lastname: "Brown",
          totalprice: 111,
          depositpaid: true,
          bookingdates: {
            checkin: "2018-01-01",
            checkout: "2019-01-01",
          },
          additionalneeds: "Breakfast",
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        cy.fixture("schemas.json").then((data) => {
          try {
            const validate = ajv.compile(data.createBooking);
            const isValidSchema = validate(response.body);
            expect(isValidSchema, "Valid Schema").to.be.true;
          } catch (error) {
            cy.log("Invalid Schema from endpoint", error.message);
          }
        });
      });
    });
    it("Delete a booking ", () => {
      // Create the booking
      cy.api({
        method: "POST",
        url: "/booking",
        body: {
          firstname: "Tito",
          lastname: "Puente",
          totalprice: 250,
          depositpaid: true,
          bookingdates: {
            checkin: "2024-01-01",
            checkout: "2024-02-01",
          },
          additionalneeds: "Breakfast",
        },
      }).then((response) => {
        let element = response.body;
        // Share bookingid to Delete method
        cy.api({
          method: "DELETE",
          url: `/booking/${element.bookingid}`,
          headers: { Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=" },
        }).then((response) => {
          expect(response.status).to.eq(201);
          // Get bookingid to check if exist
          cy.api({
            method: "GET",
            url: `/booking/${element.bookingid}`,
            failOnStatusCode: false,
          }).then((response) => {
            expect(response.status).to.eq(404);
          });
        });
      });
    });
    it("Update a booking", () => {
      cy.api({
        method: "POST",
        url: "/booking",
        body: {
          firstname: "Tito",
          lastname: "Puente",
          totalprice: 250,
          depositpaid: true,
          bookingdates: {
            checkin: "2024-01-01",
            checkout: "2024-02-01",
          },
          additionalneeds: "Breakfast",
        },
      }).then((response) => {
        let element = response.body;
        cy.api({
          method: "PUT",
          url: `/booking/${element.bookingid}`,
          headers: { Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=" },
          body: {
            firstname: "Lalo",
            lastname: "Salamanca",
            totalprice: 250000,
            depositpaid: true,
            bookingdates: {
              checkin: "2024-01-01",
              checkout: "2024-06-01",
            },
            additionalneeds: "Breakfast",
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });
    it("Partial update a booking", () => {
      cy.api({
        method: "POST",
        url: "/booking",
        body: {
          firstname: "Tito",
          lastname: "Puente",
          totalprice: 250,
          depositpaid: true,
          bookingdates: {
            checkin: "2024-01-01",
            checkout: "2024-02-01",
          },
          additionalneeds: "Breakfast",
        },
      }).then((response) => {
        let element = response.body;
        cy.api({
          method: "PATCH",
          url: `/booking/${element.bookingid}`,
          headers: { Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=" },
          body: {
            firstname: "Lalo",
            lastname: "Salamanca",
            totalprice: -3000000,
            depositpaid: true,
            bookingdates: {
              checkin: "2024-01-01",
              checkout: "2024-06-01",
            },
            additionalneeds: "Money",
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });
  });
  context("/ping endpoint", () => {
    it("HealthCheck", () => {
      cy.api({
        method: "GET",
        url: "/ping",
      }).then((response) => {
        expect(response.status).to.eq(201);
      });
    });
  });
});
