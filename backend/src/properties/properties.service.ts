import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PropertyCreateInput) {
    return this.prisma.property.create({
      data,
      include: {
        buildings: {
          include: {
            units: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.property.findMany({
      include: {
        buildings: {
          select: { id: true, name: true, street: true, houseNumber: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.property.findUnique({
      where: { id },
      include: {
        buildings: {
          include: {
            units: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    data: {
      buildings: { create: Prisma.BuildingCreateWithoutPropertyInput[] };
      [key: string]: any;
    },
  ) {
    return this.prisma.property.update({
      where: { id },
      data: {
        // Update the top-level property fields
        name: data.name,
        propertyNumber: data.propertyNumber,
        managementType: data.managementType,
        propertyManager: data.propertyManager,
        accountant: data.accountant,

        // When Prisma deletes the buildings,
        // the database will automatically cascade that delete to all child units.
        buildings: {
          deleteMany: {},
          create: data.buildings.create,
        },
      },
      include: {
        buildings: {
          include: {
            units: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.property.delete({
      where: { id },
    });
  }
}
