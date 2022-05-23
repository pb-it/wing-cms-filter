const jPath = require('../public/jpath');

const data = require('./data.json');

describe("jPath", () => {

    test("number", () => {
        var result = data.filter(x => x.id >= 5);

        expect(jPath(data, "$.[?(@.id >= 5)]")).toEqual(result);
        //expect(jPath(data, "$.[?(@.id => 5)]")).toEqual([]); //error
    });

    test("empty subarray / length", () => {
        const result = data.filter(x => [2, 4].includes(x.id));

        expect(jPath(data, "$.[?(@.actors.length() == 0)]")).toEqual([]); //TODO: ???
        expect(jPath(data, "$.[?(@.actors[*].length() == 0)]")).toEqual(result);
    });

    test("or", () => {
        const result = data.filter(x => [2, 4, 5].includes(x.id));

        expect(jPath(data, "$.[?(@.actors[*].length() == 0 || @.genre == Biography)]")).toEqual(result);
    });

    test("subarray exists, inverted", () => {
        expect(jPath(data, "$.[?(@.actors)]")).toEqual(data);
        expect(jPath(data, "$.[?(!@.actors)]")).toEqual([]);
        expect(jPath(data, "$.[?(!(@.actors))]")).toEqual([]);
    });


    test("subarry contains", () => {
        const result = data.filter(x => [3, 5].includes(x.id));

        expect(jPath(data, "$.[?(@.actors[*].id == 2)]")).toEqual(result);
    });

    test("two predicates", () => {
        const result = data.filter(x => x.id == 1);

        expect(jPath(data, "$.[?(@.genre == comedy && @.actors)]")).toEqual(result);
    });

    test("two predicates, one in parentheses, one negated", () => {
        const result = data.filter(x => x.id == 2);

        expect(jPath(data, "$.[?(@.genre == SciFi && @.actors[*].length() == 0)]")).toEqual(result);
        expect(jPath(data, "$.[?(@.genre == SciFi && (@.actors[*].length() == 0))]")).toEqual(result);
        expect(jPath(data, "$.[?(@.actors[*].length() == 0 && @.genre == SciFi)]")).toEqual(result);
        expect(jPath(data, "$.[?((@.actors[*].length() == 0) && @.genre == SciFi)]")).toEqual(result);
    });

    test("subtype", () => {
        var result = data.filter(x => x.id == 2);
        expect(jPath(data, "$.[?(@.studio.id == 1)]")).toEqual(result);

        result = data.filter(x => [2, 5].includes(x.id));
        expect(jPath(data, "$.[?(@.studio.id == 1,2)]")).toEqual(result);
        //expect(jPath(data, "$.[?(@.studio.id in [1,2])]")).toEqual(result); //TODO: ??
        expect(jPath(data, "$.[?(@.studio.name == \"20th Century Fox\",\"Sony Pictures Releasing\")]")).toEqual(result);
    });
});