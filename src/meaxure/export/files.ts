// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.

import { SMExportFormat } from "../interfaces";
import { sketch } from "../../sketch";
import { context } from "../common/context";
import { toJSString } from "../helpers/helper";

export function exportImage(layer: Layer, format: SMExportFormat, path: string, name: string) {
    let document = context.sketchObject.document;
    
    // Fix for Sketch 2025.1: Use the new export API instead of MSExportRequest
    let savePath = [
        path,
        "/",
        format.prefix,
        name,
        format.suffix,
        ".",
        format.format
    ].join("");

    // Create directory if it doesn't exist
    NSFileManager.defaultManager().createDirectoryAtPath_withIntermediateDirectories_attributes_error(
        path, true, nil, nil
    );

    // Use the new sketch.export API for file export
    sketch.export(layer, {
        output: savePath,
        formats: format.format,
        scales: format.scale.toString(),
    });
    
    return savePath;
}

export function exportImageToBuffer(layer: Layer, format: SMExportFormat): Buffer {
    return sketch.export(layer, {
        output: null,
        formats: format.format,
        scales: format.scale.toString(),
    }) as Buffer;
}

export function writeFile(options) {

    options = Object.assign({
        content: "Type something!",
        path: toJSString(NSTemporaryDirectory()),
        fileName: "temp.txt"
    }, options)
    let content = NSString.stringWithString(options.content),
        savePathName = [];

    NSFileManager
        .defaultManager()
        .createDirectoryAtPath_withIntermediateDirectories_attributes_error(options.path, true, nil, nil);

    savePathName.push(
        options.path,
        "/",
        options.fileName
    );
    let savePath = savePathName.join("");

    content.writeToFile_atomically_encoding_error(savePath, false, 4, null);
}

export function buildTemplate(content: string, data: object) {
    return content.replace("'{{data}}'", JSON.stringify(data));
}