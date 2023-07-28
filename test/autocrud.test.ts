import { sequelize, TestModel } from "./TestModel";
import request from "supertest";
import { autocrud } from "../lib/autocrud";
import express from "express";

const app = express();
app.use(express.json());
app.use("/", autocrud(TestModel));

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe("Auto CRUD", () => {
  it("Should return empty when querying / on an empty database", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual([]);
  });
  it("Should create and return a new model on POST /", async () => {
    const response = await request(app).post("/").send(testModelPayload);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(expect.objectContaining(testModelPayload));
  });
  it("Should return the newly created model on GET /{modelid}", async () => {
    const response = await request(app).get("/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.objectContaining(testModelPayload));
  });
  it("Should update the model and return the updated model on PUT /{modelid}", async () => {
    const response = await request(app).put("/1").send(testModelUpdated);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.objectContaining(testModelUpdated));
  });
  it("Should delete the model when DELETE on /{modelid}", async () => {
    const response = await request(app).delete("/1");
    expect(response.statusCode).toBe(200);
  });
  it("Should not find the newly deleted model", async () => {
    const response = await request(app).get("/1");
    expect(response.status).toBe(404);
  });
  it("Should fail to create a model if the payload is missing a mandatory field", async () => {
    const response = await request(app)
      .post("/")
      .send(testIncompleteModelPayload);
    expect(response.statusCode).toBe(400);
    expect(response.body.fields).toContain("name");
  });
  it("Should fail to update a model if the payload is missing a mandatory field", async () => {
    const createdModelResponse = await request(app)
      .post("/")
      .send(testModelPayload);
    const response = await request(app)
      .put(`/${createdModelResponse.body.id}`)
      .send(testIncompleteModelPayload);
    expect(response.statusCode).toBe(400);
    expect(response.body.fields).toContain("name");
    await request(app).delete(`/${createdModelResponse.body.id}`);
  });
  it("Should fail to create a model if the payload has an incorrectly typed field", async () => {
    const response = await request(app)
      .post("/")
      .send(testIncorrectFieldTypeModelPayload);
    expect(response.statusCode).toBe(400);
    expect(response.body.fields).toContain("description");
  });
  // it("Should list ")
});

const testModelPayload = {
  name: "Test",
  description: "This is a test model",
};

const testIncompleteModelPayload = {
  description: "This model payload is incomplete!",
};

const testIncorrectFieldTypeModelPayload = {
  name: "Inorrect field",
  description: false,
};

const testModelUpdated = {
  name: "Test Updated",
  description: "This is a new test model!",
};
