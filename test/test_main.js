
const assert = require('assert');
const util = require('util');
const lib = require('../index');
const streams = require('memory-streams');



describe("Logger tests", () => {
    "use strict";
    it("make and test simple print", () => {
        const stream = new streams.WritableStream();
        const flow = lib.flow(
            {
                name:'test',
                level:'info',
                stream: stream
            });
        flow.info("Hello test");
        const text = stream.toString();
        const logObject = JSON.parse(text);
        assert.ok(logObject.msg == 'Hello test');
    });

    it('should write flow log', () => {
        let stream = new streams.WritableStream();
        const flow = lib.flow(
            {
                name:'test',
                level:'info',
                stream: stream
            });
        flow.info("Hello test");
        const text = stream.toString();
        const logObject = JSON.parse(text);
        assert.ok(logObject.logType == 'flow');
    });

    it('should write security log', () => {
        let stream = new streams.WritableStream();
        const sec = lib.security(
            {
                name:'test',
                level:'info',
                stream: stream
            });
        sec.info("Hello test");
        const text = stream.toString();
        const logObject = JSON.parse(text);
        assert.ok(logObject.logType == 'security');
    });

    it('should write performance log', () => {
        let stream = new streams.WritableStream();
        const perf = lib.performance(
            {
                name:'test',
                level:'info',
                stream: stream
            });
        perf.info("Hello test");
        const text = stream.toString();
        const logObject = JSON.parse(text);
        assert.ok(logObject.logType == 'performance');
    });

    it('should print object', () => {
        let stream = new streams.WritableStream();
        const perf = lib.performance(
            {
                name:'test',
                level:'info',
                stream: stream
            });
        perf.info({key: 'test log', value: 'Hello test'}, "regular message");
        const text = stream.toString();
        const logObject = JSON.parse(text);
        assert.ok(logObject.logType == 'performance');
    });

    it('should test debug function for flow', () => {
        let stream = new streams.WritableStream();
        const flow = lib.flow(
            {
                name:'test',
                level:'info',
                stream: stream
            });
        flow.debug({key: 'test log', value: 'Hello test'}, "regular message");
        const text = stream.toString();
        const logObject = JSON.parse(text);
        assert.equal(logObject.logType, 'flow', 'Must be flow child');
        assert.equal(logObject.level, 20, 'Must be debug level')
    });

    it('should test trace function for flow', () => {
        let stream = new streams.WritableStream();
        const flow = lib.flow(
            {
                name:'test',
                level:'info',
                stream: stream
            });
        flow.trace({key: 'test log', value: 'Hello test'}, "regular message");
        const text = stream.toString();
        const logObject = JSON.parse(text);
        assert.equal(logObject.logType, 'flow', 'Must be flow child');
        assert.equal(logObject.level, 10, 'Must be trace level')
    });

    it('should test warn function for flow', () => {
        let stream = new streams.WritableStream();
        const flow = lib.flow(
            {
                name:'test',
                level:'info',
                stream: stream
            });
        flow.warn({key: 'test log', value: 'Hello test'}, "regular message");
        const text = stream.toString();
        const logObject = JSON.parse(text);
        assert.equal(logObject.logType, 'flow', 'Must be flow child');
        assert.equal(logObject.level, 40, 'Must be warn level')
    });

    it('should test error function for flow', () => {
        let stream = new streams.WritableStream();
        const flow = lib.flow(
            {
                name:'test',
                level:'info',
                stream: stream
            });
        flow.error({key: 'test log', value: 'Hello test'}, "regular message");
        const text = stream.toString();
        const logObject = JSON.parse(text);
        assert.equal(logObject.logType, 'flow', 'Must be flow child');
        assert.equal(logObject.level, 50, 'Must be error level')
    });

    it('should test fatal function for flow', () => {
        let stream = new streams.WritableStream();
        const flow = lib.flow(
            {
                name:'test',
                level:'info',
                stream: stream
            });
        flow.fatal({key: 'test log', value: 'Hello test'}, "regular message");
        const text = stream.toString();
        const logObject = JSON.parse(text);
        assert.equal(logObject.logType, 'flow', 'Must be flow child');
        assert.equal(logObject.level, 60, 'Must be fatal level')
    });

    it('should test debug function for security', () => {
        let stream = new streams.WritableStream();
        const sec = lib.security(
            {
                name:'test',
                level:'info',
                stream: stream
            });
        sec.debug({key: 'test log', value: 'Hello test'}, "regular message");
        const text = stream.toString();
        const logObject = JSON.parse(text);
        assert.equal(logObject.logType, 'security', 'Must be flow child');
        assert.equal(logObject.level, 20, 'Must be debug level')
    });

    it('should test trace function for security', () => {
        let stream = new streams.WritableStream();
        const sec = lib.security(
            {
                name:'test',
                level:'info',
                stream: stream
            });
        sec.trace({key: 'test log', value: 'Hello test'}, "regular message");
        const text = stream.toString();
        const logObject = JSON.parse(text);
        assert.equal(logObject.logType, 'security', 'Must be flow child');
        assert.equal(logObject.level, 10, 'Must be trace level')
    });

    it('should test warn function for security', () => {
        let stream = new streams.WritableStream();
        const sec = lib.security(
            {
                name:'test',
                level:'info',
                stream: stream
            });
        sec.warn({key: 'test log', value: 'Hello test'}, "regular message");
        const text = stream.toString();
        const logObject = JSON.parse(text);
        assert.equal(logObject.logType, 'security', 'Must be flow child');
        assert.equal(logObject.level, 40, 'Must be warn level')
    });

    it('should test error function for security', () => {
        let stream = new streams.WritableStream();
        const sec = lib.security(
            {
                name:'test',
                level:'info',
                stream: stream
            });
        sec.error({key: 'test log', value: 'Hello test'}, "regular message");
        const text = stream.toString();
        const logObject = JSON.parse(text);
        assert.equal(logObject.logType, 'security', 'Must be flow child');
        assert.equal(logObject.level, 50, 'Must be error level')
    });

    it('should test fatal function for security', () => {
        let stream = new streams.WritableStream();
        const sec = lib.security(
            {
                name:'test',
                level:'info',
                stream: stream
            });
        sec.fatal({key: 'test log', value: 'Hello test'}, "regular message");
        const text = stream.toString();
        const logObject = JSON.parse(text);
        assert.equal(logObject.logType, 'security', 'Must be flow child');
        assert.equal(logObject.level, 60, 'Must be fatal level')
    });

    it('should test debug function for performance', () => {
        let stream = new streams.WritableStream();
        const p = lib.performance(
            {
                name:'test',
                level:'info',
                stream: stream
            });
        p.debug({key: 'test log', value: 'Hello test'}, "regular message");
        const text = stream.toString();
        const logObject = JSON.parse(text);
        assert.equal(logObject.logType, 'performance', 'Must be flow child');
        assert.equal(logObject.level, 20, 'Must be debug level')
    });

    it('should test trace function for performance', () => {
        let stream = new streams.WritableStream();
        const p = lib.performance(
            {
                name:'test',
                level:'info',
                stream: stream
            });
        p.trace({key: 'test log', value: 'Hello test'}, "regular message");
        const text = stream.toString();
        const logObject = JSON.parse(text);
        assert.equal(logObject.logType, 'performance', 'Must be flow child');
        assert.equal(logObject.level, 10, 'Must be trace level')
    });

    it('should test warn function for performance', () => {
        let stream = new streams.WritableStream();
        const p = lib.performance(
            {
                name:'test',
                level:'info',
                stream: stream
            });
        p.warn({key: 'test log', value: 'Hello test'}, "regular message");
        const text = stream.toString();
        const logObject = JSON.parse(text);
        assert.equal(logObject.logType, 'performance', 'Must be flow child');
        assert.equal(logObject.level, 40, 'Must be warn level')
    });

    it('should test error function for performance', () => {
        let stream = new streams.WritableStream();
        const p = lib.performance(
            {
                name:'test',
                level:'info',
                stream: stream
            });
        p.error({key: 'test log', value: 'Hello test'}, "regular message");
        const text = stream.toString();
        const logObject = JSON.parse(text);
        assert.equal(logObject.logType, 'performance', 'Must be flow child');
        assert.equal(logObject.level, 50, 'Must be error level')
    });

    it('should test fatal function for performance', () => {
        let stream = new streams.WritableStream();
        const p = lib.performance(
            {
                name:'test',
                level:'info',
                stream: stream
            });
        p.fatal({key: 'test log', value: 'Hello test'}, "regular message");
        const text = stream.toString();
        const logObject = JSON.parse(text);
        assert.equal(logObject.logType, 'performance', 'Must be flow child');
        assert.equal(logObject.level, 60, 'Must be fatal level')
    });
});