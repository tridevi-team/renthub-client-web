// "id": "123e4567-e89b-12d3-a456-426614174000",
// "name": "Room 1",
// "maxRenters": 4,
// "roomArea": 25.5,
// "price": 2500000,
// "description": "This is a beautiful room",
// "contact": {
//   "fullName": "John Doe",
//   "phone_number": "987654321",
//   "email": null
// },
// "services": [
//       {
//         "id": "123e4567-e89b-12d3-a456-426614174000",
//         "name": "Elevator",
//         "quantity": 1,
//         "unitPrice": 50000,
//         "type": "PEOPLE",
//         "description": "This is an elevator"
//       }
//     ],
//     "equipment": [
//       {
//         "id": "123e4567-e89b-12d3-a456-426614174000",
//         "houseId": "123e4567-e89b-12d3-a456-426614174000",
//         "floorId": "123e4567-e89b-12d3-a456-426614174000",
//         "roomId": "123e4567-e89b-12d3-a456-426614174000",
//         "code": "EQ0001",
//         "name": "Air conditioner",
//         "status": "NORMAL",
//         "sharedType": "ROOM",
//         "description": "This is an air conditioner"
//       }
//     ],
//     "images": [
//       "https://picsum.photos/200/300"
//     ],
//     "status": "AVAILABLE",
//     "createdBy": "123e4567-e89b-12d3-a456-426614174000",
//     "createdAt": "2024-09-26T15:09:58.000Z",
//     "updatedBy": "123e4567-e89b-12d3-a456-426614174000",
//     "updatedAt": "2024-09-26T15:09:58.000Z"

// const room = z.object({
//   id: z.string(),
//   name: z.string(),
//   maxRenters: z.number().nullable().default(0),
//   roomArea: z.number().nullable().default(0),
//   price: z.number().nullable().default(0),
//   description: z.string().nullable(),
//   contact: z.object({
//     fullName: z.string().nullable(),
//     phone_number: z.string().nullable(),
//     email: z.string().nullable(),
//   }).nullable().optional(),
// });

export const roomKeys = {
  all: ['rooms'] as const,
  list: (params: Record<string, string | string[]> | undefined) =>
    [...roomKeys.all, 'list', ...(params ? [params] : [])] as const,
};
