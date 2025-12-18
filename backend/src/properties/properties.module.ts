import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PdfService } from './pdf.service';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';

@Module({
  controllers: [PropertiesController],
  providers: [PropertiesService, PrismaService, PdfService],
})
export class PropertiesModule {}
