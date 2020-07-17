/**
 * @jest-environment node
 */

const query_builder = require("../query_builder");

describe("test query builder using API supporting batch queries", () => {
    let edge, qb;

    beforeEach(() => {
        edge = {
            "input": ["C1332824", "C1332823"],
            "query_operation": {
                "params": {
                    "fields": "positively_regulates"
                },
                "request_body": {
                    "body": {
                        "q": "{inputs[0]}",
                        "scopes": "umls"
                    }
                },
                "path": "/query",
                "path_params": [],
                "method": "post",
                "server": "https://biothings.ncats.io/semmedgene",
                "tags": [
                    "disease",
                    "annotation",
                    "query",
                    "translator",
                    "biothings",
                    "semmed"
                ],
                "supportBatch": true,
                "inputSeparator": ","
            },
            "association": {
                "input_id": "UMLS",
                "input_type": "Gene",
                "output_id": "UMLS",
                "output_type": "Gene",
                "predicate": "positively_regulates",
                "source": "SEMMED",
                "api_name": "SEMMED Gene API",
                "smartapi": {
                    "id": "81955d376a10505c1c69cd06dbda3047",
                    "meta": {
                        "ETag": "f94053bc78b3c2f0b97f7afd52d7de2fe083b655e56a53090ad73e12be83673b",
                        "github_username": "kevinxin90",
                        "timestamp": "2020-05-27T16:53:40.804575",
                        "uptime_status": "good",
                        "uptime_ts": "2020-06-12T00:04:31.404599",
                        "url": "https://raw.githubusercontent.com/NCATS-Tangerine/translator-api-registry/master/semmed/semmed_gene.yaml"
                    }
                }
            },
            "response_mapping": {
                "positively_regulates": {
                    "pmid": "positively_regulates.pmid",
                    "umls": "positively_regulates.umls"
                }
            },
            "id": "01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b"
        }
        qb = new query_builder(edge)
    });

    test("test get http method", () => {
        expect(qb.method).toBe("post")
    });

    test("test get base url", () => {
        expect(qb.url).toBe("https://biothings.ncats.io/semmedgene/query")
    });

    test("test construct input", () => {
        expect(qb.input).toBe("C1332824,C1332823")
    });

    test('test construct params', () => {
        expect(qb.params).toHaveProperty("fields", "positively_regulates")
    });

    test('test construct request body', () => {
        expect(qb.data).toBe("q=C1332824,C1332823&scopes=umls")
    });

    test('test construct params', () => {
        expect(qb.params).toHaveProperty("fields", "positively_regulates")
    });

    test('test construct axios request config', () => {
        expect(qb.config).toHaveProperty("url", "https://biothings.ncats.io/semmedgene/query");
        expect(qb.config.params).toHaveProperty("fields", "positively_regulates");
        expect(qb.config).toHaveProperty("data", "q=C1332824,C1332823&scopes=umls");
        expect(qb.config).toHaveProperty("method", "post");
    });
});

describe("test query builder using API that don't support batch queries and have path params", () => {
    let edge, qb;

    beforeEach(() => {
        edge = {
            "input": "DOID:678",
            "query_operation": {
                "params": {
                    "disease_id": "{inputs[0]}",
                    "rows": 200
                },
                "path": "/bioentity/disease/{disease_id}/genes",
                "path_params": [
                    "disease_id"
                ],
                "method": "get",
                "server": "https://api.monarchinitiative.org/api/",
                "tags": [
                    "anatomy",
                    "disease",
                    "gene",
                    "phenotype",
                    "pathway",
                    "annotation",
                    "query",
                    "translator",
                    "biolink"
                ],
                "supportBatch": false
            },
            "association": {
                "input_id": "MONDO",
                "input_type": "Disease",
                "output_id": "HGNC",
                "output_type": "Gene",
                "predicate": "related_to",
                "api_name": "BioLink API",
                "smartapi": {
                    "id": "d22b657426375a5295e7da8a303b9893",
                    "meta": {
                        "ETag": "62f25b12c5457f6924db7929d91e7d5a2e70de291e7672aebf06fa08d1526d9d",
                        "github_username": "newgene",
                        "timestamp": "2020-05-28T00:02:40.483712",
                        "uptime_status": "good",
                        "uptime_ts": "2020-06-11T00:05:38.030503",
                        "url": "https://raw.githubusercontent.com/NCATS-Tangerine/translator-api-registry/master/biolink/openapi.yml"
                    }
                }
            },
            "response_mapping": {
                "related_to": {
                    "HGNC": "associations.object.HGNC",
                    "pubmed": "associations.publications.id",
                    "relation": "associations.relation.label",
                    "source": "associations.provided_by",
                    "taxid": "associations.object.taxon.id"
                }
            },
            "id": "01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b"
        }
        qb = new query_builder(edge)
    });

    test("test get http method", () => {
        expect(qb.method).toBe("get")
    });

    test("test get base url", () => {
        expect(qb.url).toBe("https://api.monarchinitiative.org/api/bioentity/disease/DOID:678/genes")
    });

    test("test construct input", () => {
        expect(qb.input).toBe("DOID:678")
    });

    test('test construct params', () => {
        expect(qb.params).toHaveProperty("rows", 200);
        expect(qb.params).not.toHaveProperty("disease_id")
    });

    test('test construct request body', () => {
        expect(qb.data).toBe(undefined)
    });

    test('test construct axios request config', () => {
        expect(qb.config).toHaveProperty("url", "https://api.monarchinitiative.org/api/bioentity/disease/DOID:678/genes");
        expect(qb.config.params).toHaveProperty("rows", 200);
        expect(qb.config).toHaveProperty("data", undefined);
        expect(qb.config).toHaveProperty("method", "get");
    });
})

describe("test query builder using API that don't support batch queries and have query params", () => {
    let edge, qb;

    beforeEach(() => {
        edge = {
            "input": "CXCR3",
            "query_operation": {
                "params": {
                    "genes": "{inputs[0]}"
                },
                "path": "/interactions.json",
                "path_params": [],
                "method": "get",
                "server": "http://dgidb.genome.wustl.edu/api/v2",
                "tags": [
                    "drug",
                    "gene",
                    "annotation",
                    "translator"
                ],
                "supportBatch": false
            },
            "association": {
                "input_id": "SYMBOL",
                "input_type": "Gene",
                "output_id": "CHEMBL.COMPOUND",
                "output_type": "ChemicalSubstance",
                "predicate": "physically_interacts_with",
                "api_name": "DGIdb API",
                "smartapi": {
                    "id": "e3edd325c76f2992a111b43a907a4870",
                    "meta": {
                        "ETag": "ed2cc061d10f35a20862b542ebc7b421d176bb58906ba2300b99e88017527f9d",
                        "github_username": "newgene",
                        "timestamp": "2020-04-29T00:02:09.170360",
                        "uptime_status": "good",
                        "uptime_ts": "2020-06-11T00:05:22.359624",
                        "url": "https://raw.githubusercontent.com/NCATS-Tangerine/translator-api-registry/master/dgidb/openapi.yml"
                    }
                }
            },
            "response_mapping": {
                "physically_interacts_with": {
                    "CHEMBL.COMPOUND": "matchedTerms.interactions.drugChemblId",
                    "name": "matchedTerms.interactions.drugName",
                    "publication": "matchedTerms.interactions.pmids",
                    "source": "matchedTerms.interactions.sources"
                }
            },
            "id": "01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b"
        };
        qb = new query_builder(edge)
    });

    test("test get http method", () => {
        expect(qb.method).toBe("get")
    });

    test("test get base url", () => {
        expect(qb.url).toBe("http://dgidb.genome.wustl.edu/api/v2/interactions.json")
    });

    test("test construct input", () => {
        expect(qb.input).toBe("CXCR3")
    });

    test('test construct params', () => {
        expect(qb.params).toHaveProperty("genes", "CXCR3");
    });

    test('test construct request body', () => {
        expect(qb.data).toBe(undefined)
    });

    test('test construct axios request config', () => {
        expect(qb.config).toHaveProperty("url", "http://dgidb.genome.wustl.edu/api/v2/interactions.json");
        expect(qb.config.params).toHaveProperty("genes", "CXCR3");
        expect(qb.config).toHaveProperty("data", undefined);
        expect(qb.config).toHaveProperty("method", "get");
    });
})

describe("test if query builder change the original op passed in", () => {
    let edge, qb;

    test("if params change after query is built", () => {
        let edge = {
            query_operation: {
                params: { mondo: "{inputs[0]}" },
                request_body: undefined,
                path: '/disease/chemical_substance/{mondo}',
                path_params: ['mondo'],
                method: 'get',
                server: 'https://automat.renci.org/hmdb',
                tags: ['drug', 'gene', 'disease', 'automat', 'translator'],
                supportBatch: false,
                inputSeparator: undefined
            },
            association: {
                input_id: 'MONDO',
                input_type: 'Disease',
                output_id: 'CHEMBL.COMPOUND',
                output_type: 'ChemicalSubstance',
                predicate: 'related_to',
                source: 'hmdb',
                api_name: 'Automat HMDB API',
                smartapi: { id: 'df231f1efca0c3409e28dd5ca7228c1f', meta: [Object] }
            },
            response_mapping: { related_to: { 'CHEMBL.COMPOUND': 'associated_with.chembl' } },
            id: '01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b',
            tags: ['drug', 'gene', 'disease', 'automat', 'translator'],
            input: ['MONDO:0005046']
        };
        expect(edge.query_operation.params).toHaveProperty("mondo", "{inputs[0]}")
        qb = new query_builder(edge);
        expect(edge.query_operation.params).toHaveProperty("mondo")
    })
})