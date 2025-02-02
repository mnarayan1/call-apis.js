/**
 * @jest-environment node
 */

const { default: axios } = require("axios");
const q = require("../src/query");
const resolved_ids = {
    "NCBIGene:1017": 'k',
    "CHEBI:1234": 'L'
}
const resolved_invalid_ids = {
    "NCBIGene:1017": 'kkkk',
    "CHEBI:1234": 'LLL'
}
// jest.mock('@biothings-explorer/api-response-transform', () => {
//     // Works and lets you check for constructor calls:
//     return jest.fn().mockImplementation((res) => {
//         return { transform: () => [{ v: true }] };
//     });
// });

jest.mock('../src/query_queue', () => {
    // Works and lets you check for constructor calls:
    return jest.fn().mockImplementation((res) => {
        return {
            addQuery: () => { },
            constructQueue: () => { }
        };
    });
});

// jest.mock('axios');

describe("Test query class", () => {
    describe("Test _merge function", () => {
        test("Failed promise should be excluded in the result", () => {
            const success = {
                status: "fulfilled",
                value: [{ id: 1 }]
            }
            const fail = {
                status: "rejected",
                reason: "bad request"
            }
            const caller = new q([]);
            const res = caller._merge([success, fail, fail]);
            expect(res).toHaveLength(1);
            expect(res[0]).toEqual(success.value[0]);
        })

        test("successful promise should be correctly merged", () => {
            const success1 = {
                status: "fulfilled",
                value: [{ id: 1 }]
            }
            const success2 = {
                status: "fulfilled",
                value: [{ id: 3 }]
            }
            const fail = {
                status: "rejected",
                reason: "bad request"
            }
            const caller = new q([]);
            const res = caller._merge([success1, success2, success1, fail, fail]);
            expect(res).toHaveLength(3);
            expect(res[0]).toEqual(success1.value[0]);
            expect(res[1]).toEqual(success2.value[0]);
            expect(res[2]).toEqual(success1.value[0]);
        })

        test("logs is correctly populated", () => {
            const success1 = {
                status: "fulfilled",
                value: [{ id: 1 }]
            }
            const success2 = {
                status: "fulfilled",
                value: [{ id: 3 }]
            }
            const fail = {
                status: "rejected",
                reason: "bad request"
            }
            const caller = new q([]);
            caller._merge([success1, success2, success1, fail, fail]);
            expect(caller.logs).toHaveLength(1);
            expect(caller.logs[0]).toHaveProperty("message", "call-apis: Total number of records returned for this query is 3")
        })
    })

    describe("Test _groupOutputIDsBySemanticType function", () => {
        test("Empty result should return an empty dict", () => {
            const caller = new q([]);
            const res = caller._groupOutputIDsBySemanticType([]);
            expect(res).toEqual({});
        })

        // test of deprecated function
        // test("Output IDs are correctly grouped", () => {
        //     const caller = new q([]);
        //     const result = [
        //         {
        //             apiEdge: {
        //                 output_type: 'Gene'
        //             },
        //             object: {
        //                 original: "NCBIGene:1017"
        //             }
        //         },
        //         {
        //             apiEdge: {
        //                 output_type: 'Gene'
        //             },
        //             object: {
        //                 original: "NCBIGene:1018"
        //             }
        //         },
        //         {
        //             apiEdge: {
        //                 output_type: 'Disease'
        //             },
        //             object: {
        //                 original: "MONDO:1234"
        //             }
        //         },
        //     ]
        //     const res = caller._groupOutputIDsBySemanticType(result);
        //     expect(res).toHaveProperty("Disease");
        //     expect(res.Disease).toEqual(['MONDO:1234']);
        //     expect(res).toHaveProperty("Gene");
        //     expect(res.Gene).toEqual(['NCBIGene:1017', 'NCBIGene:1018'])
        // })
    })

    describe("test _annotate function", () => {
        test("check if annotated ids are correctly mapped", async () => {
            const res = [
                {
                    apiEdge: {
                        input_type: "Gene",
                        output_type: "SmallMolecule"
                    },
                    subject: {
                        original: "NCBIGene:1017"
                    },
                    object: {
                        original: "CHEBI:1234"
                    },
                },
                {
                    apiEdge: {
                        input_type: "Gene",
                        output_type: "SmallMolecule"
                    },
                    subject: {
                        original: "NCBIGene:1017"
                    },
                    object: {
                        original: "CHEBI:1234"
                    }
                }
            ];
            const caller = new q([]);
            const annotatedResult = await caller._annotate(res);
            expect(annotatedResult).toHaveLength(2);
        })

        test("if set enabled equal to false, return the result itself", async () => {
            const res = [
                {
                    apiEdge: {
                        input_type: "Gene",
                        output_type: "SmallMolecule"
                    },
                    subject: {
                        original: "NCBIGene:1017"
                    },
                    object: {
                        original: "CHEBI:1234"
                    }
                },
                {
                    apiEdge: {
                        input_type: "Gene",
                        output_type: "SmallMolecule"
                    },
                    subject: {
                        original: "NCBIGene:1017"
                    },
                    object: {
                        original: "CHEBI:1234"
                    }
                },
            ];
            const caller = new q([]);
            const annotatedResult = await caller._annotate(res, false);
            expect(annotatedResult).toEqual(res);
        })
    })

    // describe("test _queryBucket function", () => {
    //     test("test _queryBucket function", async () => {
    //         const queries = [
    //             {
    //                 getConfig() {
    //                     return {};
    //                 },
    //                 needPagination(res) {
    //                     return false;
    //                 }
    //             }
    //         ];
    //         const mockRes = {
    //             data: {
    //                 gene: 1017
    //             }
    //         }
    //         axios.mockResolvedValue(mockRes);
    //         const caller = new q([]);
    //         caller.queue = {
    //             dequeue() {
    //                 return true;
    //             }
    //         };
    //         const res = await caller._queryBucket(queries);
    //         console.log('res', res)
    //         expect(res).toHaveLength(1);
    //         expect(res[0]).toHaveProperty('status', 'fulfilled');
    //         expect(res[0]).toHaveProperty('value', [{ v: true }])
    //     })
    // })
})
