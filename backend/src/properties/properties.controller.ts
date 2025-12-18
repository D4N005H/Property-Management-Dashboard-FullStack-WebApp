/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Prisma } from '@prisma/client';
import { PdfService } from './pdf.service';
import { PropertiesService } from './properties.service';

@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly pdfService: PdfService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const extractedData = await this.pdfService.extractData(file.buffer);
    return extractedData;
  }

  @Post()
  create(@Body() createPropertyDto: Prisma.PropertyCreateInput) {
    return this.propertiesService.create(createPropertyDto);
  }

  @Get()
  findAll() {
    return this.propertiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const property = await this.propertiesService.findOne(id);

    if (!property) {
      throw new NotFoundException(`Property with ID "${id}" not found`);
    }

    return property;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updatePropertyDto: {
      buildings: { create: Prisma.BuildingCreateWithoutPropertyInput[] };
      [key: string]: any;
    },
  ) {
    return this.propertiesService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.propertiesService.delete(id);
  }
}
