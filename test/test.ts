import { JsonClass, JsonProperty, SerializeFn } from 'at-json';
import { expect } from 'chai';
import { of } from 'rxjs';
import { mapJsonModel, mapJsonArray } from '../lib';

@JsonClass(true)
class Address {
    @JsonProperty()
    line1 = 'line1';

    @JsonProperty()
    line2 = 'line2';

    serialize: SerializeFn;
}

describe('tests', () => {
    it('should deserialize', done => {
        const obj = {
            line1: 'a',
            line2: 'b'
        };

        of(obj).pipe(mapJsonModel(Address)).subscribe(v => {
            expect(v).to.be.instanceOf(Address);
            expect(v.line1).to.equal(obj.line1);
            expect(v.line2).to.equal(obj.line2);
            done();
        });
    });

    it('should deserialize array', done => {
        const obj = <Address>{
            line1: 'a',
            line2: 'b'
        };

        const obj2 = <Address>{
            line1: 'c',
            line2: 'd'
        };

        const d = [obj, obj2];

        of(d).pipe(mapJsonArray(Address)).subscribe(a => {
            expect(a).to.be.instanceOf(Array);

            a.forEach((v, i) => {
                expect(v).to.be.instanceOf(Address);
                expect(v.line1).to.equal(d[i].line1);
                expect(v.line2).to.equal(d[i].line2);
            });

            done();
        });
    });
});
