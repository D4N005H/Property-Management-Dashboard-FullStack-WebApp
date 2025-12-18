// backend/src/properties/pdf.service.ts
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { LegalData } from './schemas/legal.schema';

@Injectable()
export class PdfService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async extractData(buffer: Buffer): Promise<LegalData> {
    console.log('Starting OpenAI Assistant extraction...');

    const fileObj = await this.bufferToFile(buffer, 'declaration.pdf');
    const file = await this.openai.files.create({
      file: fileObj,
      purpose: 'assistants',
    });

    console.log(`File uploaded: ${file.id}`);

    try {
      const assistant = await this.openai.beta.assistants.create({
        name: 'Real Estate Data Extractor',
        instructions:
          'You are an expert data extractor. Extract structured JSON data from the attached German real estate PDF ("Teilungserklärung"). Pay close attention to the requested JSON schema.',
        model: 'gpt-4o',
        tools: [{ type: 'file_search' }],
      });

      console.log(`Assistant created: ${assistant.id}`);

      const run = await this.openai.beta.threads.createAndRunPoll({
        assistant_id: assistant.id,
        thread: {
          messages: [
            {
              role: 'user',
              content: `Extract the following data from the attached PDF file.
              
              Return ONLY valid JSON matching this structure exactly. The field names are critical.
              {
                "property": { "name": "string", "propertyNumber": "string", "managementType": "WEG" or "MV", "propertyManager": "string", "accountant": "string" },
                "buildings": [ { "name": "string", "street": "string", "houseNumber": "string", "zipCode": "string", "city": "string" } ],
                "units": [ { "unitNumber": "string", "unitType": "Apartment"|"Office"|"Garden"|"Parking", "floor": "string", "entrance": "string", "sizeM2": number, "coOwnershipShare": "string", "roomCount": number, "constructionYear": number, "buildingIndex": number } ]
              }
              
              For the 'entrance' field, use the information like "Eingang A" or "separater Eingang B". If it's not specified for a unit, use a logical default like "Haupteingang".
              Do not include markdown formatting (like \`\`\`json). Just the raw JSON string.`,
              attachments: [
                { file_id: file.id, tools: [{ type: 'file_search' }] },
              ],
            },
          ],
        },
      });

      console.log('Run completed:', run.id);

      if (run.status !== 'completed') {
        throw new Error(
          `Run failed with status: ${run.status} - ${run.last_error?.message}`,
        );
      }

      const messages = await this.openai.beta.threads.messages.list(
        run.thread_id,
      );

      const lastMessage = messages.data
        .filter((msg) => msg.role === 'assistant')
        .shift();

      if (!lastMessage || lastMessage.content[0].type !== 'text') {
        throw new Error('No text response from Assistant');
      }

      let jsonString = lastMessage.content[0].text.value;
      jsonString = jsonString
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      console.log('Extraction complete.');
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error in AI extraction:', error);
      throw error;
    } finally {
      if (file.id) {
        await this.openai.files.delete(file.id);
      }
    }
  }

  private async bufferToFile(buffer: Buffer, filename: string): Promise<any> {
    const { File } = await import('buffer');
    return new File([buffer], filename, { type: 'application/pdf' });
  }
}
