"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFieldDec = exports.convertType = exports.convertEnum = exports.convertRecord = exports.avroToTypeScript = exports.convertPrimitive = exports.isRecordType = exports.isOptional = exports.isMapType = exports.isLogicalType = exports.isEnumType = exports.isArrayType = void 0;
var model_1 = require("./model");
Object.defineProperty(exports, "isArrayType", { enumerable: true, get: function () { return model_1.isArrayType; } });
Object.defineProperty(exports, "isEnumType", { enumerable: true, get: function () { return model_1.isEnumType; } });
Object.defineProperty(exports, "isLogicalType", { enumerable: true, get: function () { return model_1.isLogicalType; } });
Object.defineProperty(exports, "isMapType", { enumerable: true, get: function () { return model_1.isMapType; } });
Object.defineProperty(exports, "isOptional", { enumerable: true, get: function () { return model_1.isOptional; } });
Object.defineProperty(exports, "isRecordType", { enumerable: true, get: function () { return model_1.isRecordType; } });
var model_2 = require("./model");
/** Convert a primitive type from avro to TypeScript */
function convertPrimitive(avroType) {
    switch (avroType) {
        case "long":
        case "int":
        case "double":
        case "float":
            return "number";
        case "bytes":
            return "Buffer";
        case "null":
            return "null";
        case "boolean":
            return "boolean";
        default:
            return null;
    }
}
exports.convertPrimitive = convertPrimitive;
/** Converts an Avro record type to a TypeScript file */
function avroToTypeScript(schema, opts) {
    if (opts === void 0) { opts = {}; }
    var output = [];
    if ((0, model_2.isEnumType)(schema))
        convertEnum(schema, output);
    else if ((0, model_2.isRecordType)(schema))
        convertRecord(schema, output, opts);
    else
        throw "Unknown top level type " + schema["type"];
    return output.join("\n");
}
exports.avroToTypeScript = avroToTypeScript;
/** Convert an Avro Record type. Return the name, but add the definition to the file */
function convertRecord(recordType, fileBuffer, opts) {
    var buffer = "export interface " + recordType.name + " {\n";
    for (var _i = 0, _a = recordType.fields; _i < _a.length; _i++) {
        var field = _a[_i];
        buffer += convertFieldDec(field, fileBuffer, opts) + "\n";
    }
    buffer += "}\n";
    fileBuffer.push(buffer);
    return recordType.name;
}
exports.convertRecord = convertRecord;
/** Convert an Avro Enum type. Return the name, but add the definition to the file */
function convertEnum(enumType, fileBuffer) {
    var enumDef = "export enum " + enumType.name + " { " + enumType.symbols.map(function (sym) { return sym + " = '" + sym + "'"; }).join(", ") + " };\n";
    fileBuffer.push(enumDef);
    return enumType.name;
}
exports.convertEnum = convertEnum;
function convertType(type, buffer, opts) {
    // if it's just a name, then use that
    if (typeof type === "string") {
        return convertPrimitive(type) || type;
    }
    else if (type instanceof Array) {
        // array means a Union. Use the names and call recursively
        return type.map(function (t) { return convertType(t, buffer, opts); }).join(" | ");
    }
    else if ((0, model_2.isRecordType)(type)) {
        //} type)) {
        // record, use the name and add to the buffer
        return convertRecord(type, buffer, opts);
    }
    else if ((0, model_2.isArrayType)(type)) {
        // array, call recursively for the array element type
        return convertType(type.items, buffer, opts) + "[]";
    }
    else if ((0, model_2.isMapType)(type)) {
        // Dictionary of types, string as key
        return "{ [index:string]:" + convertType(type.values, buffer, opts) + " }";
    }
    else if ((0, model_2.isEnumType)(type)) {
        // array, call recursively for the array element type
        return convertEnum(type, buffer);
    }
    else if ((0, model_2.isLogicalType)(type)) {
        if (opts.logicalTypes && opts.logicalTypes[type.logicalType]) {
            return opts.logicalTypes[type.logicalType];
        }
        return convertType(type.type, buffer, opts);
    }
    else {
        console.error("Cannot work out type", type);
        return "UNKNOWN";
    }
}
exports.convertType = convertType;
function convertFieldDec(field, buffer, opts) {
    // Union Type
    return "\t" + field.name + ": " + convertType(field.type, buffer, opts) + ";";
}
exports.convertFieldDec = convertFieldDec;
