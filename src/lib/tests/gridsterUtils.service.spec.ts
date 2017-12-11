import { Directive, Component } from '@angular/core'
import {GridsterConfigS} from '../gridsterConfigS.interface';
import {GridsterConfigService} from '../gridsterConfig.constant';
import { GridsterUtils } from '../gridsterUtils.service';
import { GridsterComponent } from "../gridster.component";
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect, inject } from '@angular/core/testing'

describe("merge method", () => {
    it("should check if merge is working correctly", () => {
        let obj1 = {"key1": "value1", "key2": "value2"}
        let obj2 = {"key1": "value2", "key2": "value4"}
        let properties = {"key1": "value2", "key2": "value5"};
        expect(JSON.stringify(GridsterUtils.merge(obj1, obj2, properties))).toBe(JSON.stringify(obj2));
        expect(JSON.stringify(GridsterUtils.merge(obj1, obj2, properties))).not.toBe(JSON.stringify(properties));
    })
    it("should check if 'properties' doesn't contain any part of 'obj2'", () => {
        let obj1 = {"key1": "value1"};
        let obj2 = {"key1": "value3", "key2": "value4"};
        let properties = {"key3": "value2"};
        expect(JSON.stringify(GridsterUtils.merge(obj1, obj2, properties))).toBe(JSON.stringify(obj1));
        expect(JSON.stringify(GridsterUtils.merge(obj1, obj2, properties))).not.toBe(JSON.stringify(properties));
    })
    it("should check obj1 when typeof obj2['p'] == 'object'", () => {
        let obj1 = {"key1": "value1", "key3": {}};
        let obj2 = {"key1": "value3", "key2": "value4", "key3": {"key4": "value10"}};
        let properties = {"key1": "value3", "key3": {"key4": "value11"}};
        let output = {"key1": "value3", "key3": {"key4": "value10"}};
        expect(JSON.stringify(GridsterUtils.merge(obj1, obj2, properties))).toBe(JSON.stringify(output));
        expect(JSON.stringify(GridsterUtils.merge(obj1, obj2, properties))).not.toBe(JSON.stringify(obj2));
        expect(JSON.stringify(GridsterUtils.merge(obj1, obj2, properties))).not.toBe(JSON.stringify(properties));
    })
})

describe("check touch event", () => {
    it("should check when clientX is present", () => {
        let event = {clientX: 100, clientY: 100}
        GridsterUtils.checkTouchEvent(event);
        expect(event.clientX).toBe(100);
        expect(event.clientY).toBe(100);
    })

    it("should check when clientX is undefined", () => {
        let event: any = {clientX: undefined, clientY: undefined, touches: [{clientX: 100, clientY: 100}]}
        GridsterUtils.checkTouchEvent(event);
        expect(event.clientX).not.toBe(undefined);
        expect(event.clientY).not.toBe(undefined);
        expect(event.clientX).toBe(100);
        expect(event.clientY).toBe(100);        
    })
})