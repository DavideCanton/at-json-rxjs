import { JsonClass, JsonProperty, SerializeFn } from 'at-json';
import { expect } from 'chai';
import { of } from 'rxjs';

import { conditionaMapJsonArray, conditionaMapJsonModel, mapJsonArray, mapJsonModel } from '../lib';

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

    it('should deserialize if condition is met', done => {
        const obj = {
            C: true,
            D: {
                line1: 'a',
                line2: 'b'
            }
        };

        const NO_MAP = <Address>{};

        of(obj).pipe(
            conditionaMapJsonModel(v => v.C, Address, v => v.D, NO_MAP)
        ).subscribe(v => {
            expect(v).to.be.instanceOf(Address);
            expect(v.line1).to.equal(obj.D.line1);
            expect(v.line2).to.equal(obj.D.line2);
            done();
        });
    });

    it('should not deserialize if condition is not met', done => {
        const obj = {
            C: false,
            D: {
                line1: 'a',
                line2: 'b'
            }
        };
        const NO_MAP = <Address>{};

        of(obj).pipe(
            conditionaMapJsonModel(v => v.C, Address, v => v.D, NO_MAP)
        ).subscribe(v => {
            expect(v).to.equal(NO_MAP);
            done();
        });
    });

    it('should deserialize array if condition is met', done => {
        const obj = {
            D: <Address>{
                line1: 'a',
                line2: 'b'
            }
        };

        const obj2 = {
            D: <Address>{
                line1: 'c',
                line2: 'd'
            }
        };

        const d = [obj, obj2];

        of(d).pipe(conditionaMapJsonArray(v => v.length === 2, Address, x => x.D)).subscribe(a => {
            expect(a).to.be.instanceOf(Array);

            a.forEach((v, i) => {
                expect(v).to.be.instanceOf(Address);
                expect(v.line1).to.equal(d[i].D.line1);
                expect(v.line2).to.equal(d[i].D.line2);
            });

            done();
        });
    });

    it('should not deserialize array if condition is not met', done => {
        const obj = {
            D: <Address>{
                line1: 'a',
                line2: 'b'
            }
        };

        const obj2 = {
            D: <Address>{
                line1: 'c',
                line2: 'd'
            }
        };

        const d = [obj, obj2];

        of(d).pipe(conditionaMapJsonArray(v => v.length === 3, Address, x => x.D)).subscribe(a => {
            expect(a).to.be.instanceOf(Array);
            expect(a.length).to.equal(0);
            done();
        });
    });
});
