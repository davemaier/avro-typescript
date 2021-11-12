export { EnumType, Field, isArrayType, isEnumType, isLogicalType, isMapType, isOptional, isRecordType, RecordType, Type, } from "./model";
import { ConversionOptions, EnumType, Field, RecordType, Schema, Type } from "./model";
/** Convert a primitive type from avro to TypeScript */
export declare function convertPrimitive(avroType: string): string;
/** Converts an Avro record type to a TypeScript file */
export declare function avroToTypeScript(schema: Schema, opts?: ConversionOptions): string;
/** Convert an Avro Record type. Return the name, but add the definition to the file */
export declare function convertRecord(recordType: RecordType, fileBuffer: string[], opts: ConversionOptions): string;
/** Convert an Avro Enum type. Return the name, but add the definition to the file */
export declare function convertEnum(enumType: EnumType, fileBuffer: string[]): string;
export declare function convertType(type: Type, buffer: string[], opts: ConversionOptions): string;
export declare function convertFieldDec(field: Field, buffer: string[], opts: ConversionOptions): string;
