import { sqlTypeToType } from "../lib";

describe("SQL Type to TS Type", () => {
  it("should match a string type when the SQL type is a string or a date", () => {
    expect(sqlTypeToType("VARCHAR(255)", "text")).toBe(true);
    expect(sqlTypeToType("TIMESTAMP WITH TZ", "01/01/01 23:00:00Z")).toBe(true);
  });
  it("Should not match when the SQL is a string or a date and the payload isn't", () => {
    expect(sqlTypeToType("VARCHAR(255)", false)).toBe(false);
    expect(sqlTypeToType("TIMESTAMP WITH TZ", 42)).toBe(false);
  });

  it("Should match a number when the SQL type is a decimal, float or int", () => {
    expect(sqlTypeToType("BIGINT", 42)).toBe(true);
    expect(sqlTypeToType("FLOAT", 42.0)).toBe(true);
    expect(sqlTypeToType("DECIMAL", 42.0)).toBe(true);
  });
  it("Should not match a number when the SQL type is a decimal, float or int and the payload isn't", () => {
    expect(sqlTypeToType("BIGINT", "nope")).toBe(false);
    expect(sqlTypeToType("FLOAT", false)).toBe(false);
    expect(sqlTypeToType("DECIMAL", false)).toBe(false);
  });
  it("Should match a boolean when the SQL type is a boolean", () => {
    expect(sqlTypeToType("BOOLEAN", true)).toBe(true);
    expect(sqlTypeToType("TINYINT(1)", true)).toBe(true);
    expect(sqlTypeToType("BIT", true)).toBe(true);
  });
  it("Should not match when the SQL type is a boolean but the payload isn't", () => {
    expect(sqlTypeToType("BOOLEAN", "notbool")).toBe(false);
    expect(sqlTypeToType("TINYINT(1)", 42)).toBe(false);
    expect(sqlTypeToType("BIT", "notbool")).toBe(false);
  });
});
