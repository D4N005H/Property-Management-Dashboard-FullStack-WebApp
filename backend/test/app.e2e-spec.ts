import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET / should return "Hello World!"', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('/properties', () => {
    let propertyId: string;

    // Generate a unique number for this specific test run
    const uniqueNum = Date.now();

    const mockPropertyData = {
      name: 'E2E Test Property',
      // Use the unique number here to ensure tests never collide
      propertyNumber: `E2E-${uniqueNum}`,
      managementType: 'WEG',
      propertyManager: 'Test Manager',
      accountant: 'Test Accountant',
      buildings: {
        create: [
          {
            name: 'E2E Building A',
            street: 'Test Street',
            houseNumber: '101',
            zipCode: '99999',
            city: 'Test City',
            units: {
              create: [
                {
                  unitNumber: 'E2E-01',
                  unitType: 'Apartment',
                  floor: '1st Floor',
                  entrance: 'Main',
                  sizeM2: 75.5,
                  coOwnershipShare: '100/1000',
                  constructionYear: 2024,
                  roomCount: 3,
                },
              ],
            },
          },
        ],
      },
    };

    it('POST /properties - should create a new property', async () => {
      const response = await request(app.getHttpServer())
        .post('/properties')
        .send(mockPropertyData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(mockPropertyData.name);

      propertyId = response.body.id;
    });

    it('GET /properties/:id - should retrieve the created property', async () => {
      const response = await request(app.getHttpServer())
        .get(`/properties/${propertyId}`)
        .expect(200);

      expect(response.body.id).toBe(propertyId);
      expect(response.body.name).toBe(mockPropertyData.name);
    });

    it('GET /properties - should retrieve a list of all properties', async () => {
      const response = await request(app.getHttpServer())
        .get('/properties')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      const foundProperty = response.body.find((p: any) => p.id === propertyId);
      expect(foundProperty).toBeDefined();
    });

    it('PATCH /properties/:id - should update the property', async () => {
      const updatePayload = {
        ...mockPropertyData,
        propertyManager: 'Updated Test Manager',
        buildings: {
          create: mockPropertyData.buildings.create,
        },
      };

      const response = await request(app.getHttpServer())
        .patch(`/properties/${propertyId}`)
        .send(updatePayload)
        .expect(200);

      expect(response.body.id).toBe(propertyId);
      expect(response.body.propertyManager).toBe('Updated Test Manager');
    });
  });
});
