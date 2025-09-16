# Swagger UI-ийг Next.js-д ашиглах (Using Swagger UI in Next.js)

Энэхүү баримт бичиг нь Next.js төсөлд Swagger UI-г хэрхэн нэгтгэж, API-аа баримтжуулах талаар тайлбарлана.

## 1. Шаардлагатай багцуудыг суулгах

Next.js төслийн хавтас дотор дараах багцуудыг суулгана:

```bash
npm install swagger-jsdoc swagger-ui-react
npm install --save-dev @types/swagger-ui-react
```

- `swagger-jsdoc`: API маршрут дахь JSDoc тэмдэглэгээг ашиглан Swagger (OpenAPI) тодорхойлолтыг үүсгэхэд ашиглана.
- `swagger-ui-react`: React компонент хэлбэрээр Swagger UI-г харуулахад ашиглана.
- `@types/swagger-ui-react`: `swagger-ui-react` багцын TypeScript type тодорхойлолтууд.

## 2. API маршрутуудаа баримтжуулах (JSDoc ашиглан)

API маршрутын файлууддаа Swagger JSDoc тэмдэглэгээг ашиглан API-аа баримтжуулна. Жишээлбэл, `/src/app/api/todos/route.ts` файлын хувьд:

```typescript
// src/app/api/todos/route.ts
import { NextResponse } from 'next/server';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

// ... todo жагсаалт болон бусад кодууд ...

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Бүх todo-г авах
 *     responses:
 *       200:
 *         description: Амжилттай
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *   post:
 *     summary: Шинэ todo үүсгэх
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: Todo-ийн нэр
 *     responses:
 *       201:
 *         description: Үүсгэлт амжилттай
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Title шаардлагатай
 */
export async function GET() {
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  // ... POST логик ...
}

/**
 * @swagger
 * /api/todos:
 *   put:
 *     summary: Todo-г шинэчлэх
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: Todo-ийн ID
 *               title:
 *                 type: string
 *                 description: Todo-ийн шинэ нэр
 *               completed:
 *                 type: boolean
 *                 description: Todo-ийн гүйцэтгэлийн байдал
 *     responses:
 *       200:
 *         description: Шинэчлэлт амжилттай
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: ID шаардлагатай
 *       404:
 *         description: Todo олдсонгүй
 *   delete:
 *     summary: Todo-г устгах
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: Todo-ийн ID
 *     responses:
 *       204:
 *         description: Устгалт амжилттай
 *       400:
 *         description: ID шаардлагатай
 *       404:
 *         description: Todo олдсонгүй
 */
export async function PUT(request: Request) {
  // ... PUT логик ...
}

export async function DELETE(request: Request) {
  // ... DELETE логик ...
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - completed
 *       properties:
 *         id:
 *           type: string
 *           description: Todo-ийн ID
 *         title:
 *           type: string
 *           description: Todo-ийн нэр
 *         completed:
 *           type: boolean
 *           description: Todo-ийн гүйцэтгэлийн байдал
 *       example:
 *         id: '1'
 *         title: 'Learn Next.js'
 *         completed: false
 */
```

## 3. Swagger тохиргоо үүсгэх

Swagger JSDoc-ийн тохиргоог `/src/lib/swagger.ts` файлд үүсгэнэ. Энэ файл нь API маршрутуудаа хайж, Swagger (OpenAPI) JSON объектыг үүсгэхэд ашиглагдана. `apis` талбарт таны API маршрутууд байрлах замыг зааж өгөхөө мартуузай.

**Файл: `src/lib/swagger.ts`**

```typescript
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API',
      version: '1.0.0',
      description: 'A simple Next.js Todo API',
    },
    servers: [
      {
        url: 'http://localhost:3000/api', // Таны API-ийн үндсэн зам
      },
    ],
  },
  apis: ['./src/app/api/**/*.ts'], // API маршрутын файлууд байрлах зам
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
```

## 4. Swagger JSON-г буцаах API маршрут үүсгэх

Үүсгэсэн Swagger JSON объектыг клиент тал руу буцаах API маршрутыг `/src/app/api/swagger/route.ts` файлд үүсгэнэ.

**Файл: `src/app/api/swagger/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import swaggerSpec from '@/lib/swagger'; // Өмнөх алхамд үүсгэсэн Swagger тохиргоо

export async function GET() {
  return NextResponse.json(swaggerSpec);
}
```

## 5. Swagger UI нүүр хуудас үүсгэх

Swagger UI-г вэб интерфейс дээр харуулахын тулд `/src/app/swagger/page.tsx` файлд React компонент үүсгэнэ. Энэ нь `swagger-ui-react` санг ашиглан Swagger JSON-г дуудаж харуулна.

**Файл: `src/app/swagger/page.tsx`**

```typescript
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css'; // Swagger UI-ийн стилийг импортлох

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

function SwaggerPage() {
  const [swaggerSpec, setSwaggerSpec] = useState(null);

  useEffect(() => {
    async function fetchSwaggerSpec() {
      // /api/swagger маршрутаас Swagger JSON-г дуудна
      const res = await fetch('/api/swagger');
      const data = await res.json();
      setSwaggerSpec(data);
    }
    fetchSwaggerSpec();
  }, []);

  if (!swaggerSpec) {
    return <div>Loading Swagger UI...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <SwaggerUI spec={swaggerSpec} />
    </div>
  );
}

export default SwaggerPage;
```

## 6. Аппликешнийг ажиллуулах

Төслийг хөгжүүлэлтийн горимоор эхлүүлэхийн тулд (хэрэв ажиллаж байгаа бол дахин эхлүүлэх шаардлагатай) дараах командыг ажиллуулна:

```bash
npm run dev
```

## 7. Swagger UI-г шалгах

Төслийг эхлүүлсний дараа та дараах хаягаар нэвтэрч Swagger UI-г үзэх боломжтой:

*   **Swagger UI:** `http://localhost:3000/swagger`

Swagger UI дээр та баримтжуулсан API-ийн бүх маршрутуудыг (GET, POST, PUT, DELETE) харах, тэдгээрийг шууд интерфейсээс туршиж үзэх боломжтой болно.

---
