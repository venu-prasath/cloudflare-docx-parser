import { unzipSync } from "fflate";
import { XMLParser } from "fast-xml-parser";

/**
 * Parses a .docx file and returns the plain text content.
 * @param buffer - The ArrayBuffer or Uint8Array representing the .docx file.
 * @returns A promise that resolves to the plain text content of the .docx file.
 */
export async function parseDocx(buffer: ArrayBuffer | Uint8Array): Promise<string> {
    const uint8Array: Uint8Array = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    const files = unzipSync(uint8Array) as Record<string, Uint8Array>;

    const documentXml = files["word/document.xml"];
    if(!documentXml) {
        throw new Error("document.xml not found in the provided docx file.");
    }

    const decoder: TextDecoder = new TextDecoder("utf-8");
    const xmlContent: string = decoder.decode(documentXml);

    const parser: XMLParser = new XMLParser();
    const jsonObj: any = parser.parse(xmlContent);

    const paragraphs = jsonObj["w:document"]?.["w:body"]?.["w:p"];
    let plainText = "";

    if(Array.isArray(paragraphs)) {
        paragraphs.forEach((paragraph: any) => {
            if(paragraph["w:r"]) {
                const runs = Array.isArray(paragraph["w:r"]) ? paragraph["w:r"] : [paragraph["w:r"]];
                runs.forEach((run: any) => {
                    if(run["w:t"]) {
                        plainText += run["w:t"] + " ";
                    }
                });
                plainText += "\n";
            }
        });
    } else if(paragraphs && typeof paragraphs === "object") {
        if(paragraphs["w:r"] && paragraphs["w:r"]["w:t"]) {
            plainText += paragraphs["w:r"]["w:t"] + "\n";
        }
    }
    return Promise.resolve(plainText.trim());
}