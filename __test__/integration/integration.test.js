const q = require("../../src/query");
const fs = require("fs");
const path = require("path");

describe("Integration test", () => {
    describe("Integration test using mygene.info gene to biological process association", () => {
        let edge;

        beforeEach(() => {
            const edge_path = path.resolve(__dirname, '../data/mygene_example_edge.json');
            edge = JSON.parse(fs.readFileSync(edge_path));
        })
        test("check response", async () => {
            const query = new q([edge]);
            const res = await query.query();
            expect(res).toHaveLength(27);
        })
    })

    describe("Integration test using text mining co-occurrence KP for disease to chemical association", () => {
        let edge;

        beforeEach(() => {
            const edge_path = path.resolve(__dirname, '../data/cooccurrence_example_edge.json');
            edge = JSON.parse(fs.readFileSync(edge_path));
        })
        test("check response", async () => {
            const query = new q([edge]);
            const res = await query.query(false);
            expect(res).toHaveLength(3762);
        })
    })

    describe("Integration test using fake error api query that should return 404 error", () => {
        let edge;

        beforeEach(() => {
            const edge_path = path.resolve(__dirname, '../data/fake_error_edge.json');
            edge = JSON.parse(fs.readFileSync(edge_path));
        })
        test("check response", async () => {
            const query = new q([edge]);
            const res = await query.query(false);
            expect(res).toHaveLength(0);
            expect(query.logs[query.logs.length - 3]).toHaveProperty('level', 'ERROR');
        })
    })
})