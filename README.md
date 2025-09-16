Энэ баримт бичиг нь төслийг хэрхэн эхлүүлэхээс эхлээд API-ийг баримтжуулах хүртэлх бүх алхамыг агуулсан болно.

---

```markdown
# Next.js Todo App with Swagger UI (Next.js Todo Аппликешн ба Swagger UI)

Энэхүү төсөл нь Next.js App Router-ийг ашиглан энгийн CRUD (Create, Read, Update, Delete) үйлдлүүдтэй Todo жагсаалтын API-г хэрэгжүүлж, Swagger UI-аар баримтжуулсан болно.

## Эхлүүлэх

### 1. Next.js төслийг үүсгэх

Хэрэв танд Next.js төсөл байхгүй бол дараах командыг ашиглан шинэ төсөл үүсгэнэ:

```bash
npx create-next-app my-next-swagger-app --ts --eslint --tailwind --app --src-dir --import-alias "@/*" --use-npm
```

Үүсгэсэн төслийн хавтас руу шилжинэ:

```bash
cd my-next-swagger-app
```

### 2. Шаардлагатай багцуудыг суулгах

Swagger-ийг нэгтгэхийн тулд дараах багцуудыг суулгана:

```bash
npm install swagger-jsdoc swagger-ui-react
npm install --save-dev @types/swagger-ui-react
```

### 3. CRUD API маршрут үүсгэх

Todo жагсаалтын CRUD үйлдлүүдийг зохицуулах API маршрутыг `/src/app/api/todos/route.ts` файлд үүсгэнэ. Энэ API нь түр зуурын (in-memory) массив ашиглан өгөгдлийг хадгална.

**Файл: `src/app/api/todos/route.ts`**

```typescript
import { NextResponse } from 'next/server';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

let todos: Todo[] = [
  { id: '1', title: 'Learn Next.js', completed: false },
  { id: '2', title: 'Build a Todo App', completed: false },
];

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
  const { title } = await request.json();
  if (!title) {
    return new NextResponse('Title is required', { status: 400 });
  }
  const newTodo: Todo = {
    id: String(todos.length + 1),
    title,
    completed: false,
  };
  todos.push(newTodo);
  return NextResponse.json(newTodo, { status: 201 });
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
 *             responses:
 *       204:
 *         description: Устгалт амжилттай
 *       400:
 *         description: ID шаардлагатай
 *       404:
 *         description: Todo олдсонгүй
 */
export async function PUT(request: Request) {
  const { id, title, completed } = await request.json();
  if (!id) {
    return new NextResponse('ID is required', { status: 400 });
  }
  const todoIndex = todos.findIndex((todo) => todo.id === id);
  if (todoIndex === -1) {
    return new NextResponse('Todo not found', { status: 404 });
  }
  if (title !== undefined) {
    todos[todoIndex].title = title;
  }
  if (completed !== undefined) {
    todos[todoIndex].completed = completed;
  }
  return NextResponse.json(todos[todoIndex]);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  if (!id) {
    return new NextResponse('ID is required', { status: 400 });
  }
  const initialLength = todos.length;
  todos = todos.filter((todo) => todo.id !== id);
  if (todos.length === initialLength) {
    return new NextResponse('Todo not found', { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
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

### 4. Swagger тохиргоо үүсгэх

Swagger JSDoc-ийн тохиргоог `/src/lib/swagger.ts` файлд үүсгэнэ. Энэ нь API маршрутуудыг хайж, Swagger JSON объектыг үүсгэхэд ашиглагдана.

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
        url: 'http://localhost:3000/api',
      },
    ],
  },
  apis: ['./src/app/api/**/*.ts'], // API маршрутын зам
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
```

### 5. Swagger JSON API маршрут үүсгэх

Үүсгэсэн Swagger JSON объектыг буцаах API маршрутыг `/src/app/api/swagger/route.ts` файлд үүсгэнэ. Энэ нь Swagger UI-д API-ийн тодорхойлолтыг авах боломжийг олгоно.

**Файл: `src/app/api/swagger/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import swaggerSpec from '@/lib/swagger';

export async function GET() {
  return NextResponse.json(swaggerSpec);
}
```

### 6. Swagger UI нүүр хуудас үүсгэх

Swagger UI-г вэб интерфейс дээр харуулах нүүр хуудсыг `/src/app/swagger/page.tsx` файлд үүсгэнэ. Энэ нь клиент талын бүрэлдэхүүн хэсэг байх ёстой.

**Файл: `src/app/swagger/page.tsx`**

```typescript
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

function SwaggerPage() {
  const [swaggerSpec, setSwaggerSpec] = useState(null);

  useEffect(() => {
    async function fetchSwaggerSpec() {
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

### 7. Фронтенд нүүр хуудас үүсгэх (Todo UI)

Todo жагсаалтыг харуулах, шинээр нэмэх, засах, устгах үйлдлүүдийг хийх энгийн UI-г `/src/app/page.tsx` файлд үүсгэнэ. Мөн Swagger UI руу холбоос оруулах болно.

**Файл: `src/app/page.tsx`**

```typescript
'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editingTodoTitle, setEditingTodoTitle] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch('/api/todos');
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTodoTitle }),
    });
    const newTodo = await res.json();
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setNewTodoTitle('');
  };

  const updateTodo = async (id: string, completed?: boolean, title?: string) => {
    const res = await fetch('/api/todos', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, completed, title }),
    });
    const updatedTodo = await res.json();
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
    );
    setEditingTodoId(null);
    setEditingTodoTitle('');
  };

  const deleteTodo = async (id: string) => {
    await fetch('/api/todos', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Todo List</h1>

      <form onSubmit={addTodo} className="flex gap-2 mb-8">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Шинэ todo нэмэх..."
          className="flex-grow p-2 border border-gray-300 rounded shadow-sm text-black"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Нэмэх
        </button>
      </form>

      <ul className="space-y-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded shadow-sm bg-white"
          >
            {editingTodoId === todo.id ? (
              <input
                type="text"
                value={editingTodoTitle}
                onChange={(e) => setEditingTodoTitle(e.target.value)}
                onBlur={() => updateTodo(todo.id, undefined, editingTodoTitle)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    updateTodo(todo.id, undefined, editingTodoTitle);
                  }
                }}
                className="flex-grow p-2 border border-gray-300 rounded shadow-sm text-black"
              />
            ) : (
              <span
                className={`flex-grow text-lg ${
                  todo.completed ? 'line-through text-gray-500' : 'text-black'
                }`}
                onDoubleClick={() => {
                  setEditingTodoId(todo.id);
                  setEditingTodoTitle(todo.title);
                }}
              >
                {todo.title}
              </span>
            )}

            <div className="flex gap-2 ml-4">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => updateTodo(todo.id, !todo.completed)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <button
                onClick={() => deleteTodo(todo.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
              >
                Устгах
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8 text-center">
        <a href="/swagger" className="text-blue-500 hover:underline">
          Swagger UI-г харах
        </a>
      </div>
    </div>
  );
}
```

### 8. Төслийг ажиллуулах

Төслийг хөгжүүлэлтийн горимоор эхлүүлэхийн тулд дараах командыг ажиллуулна:

```bash
npm run dev
```

### 9. Аппликешнийг шалгах

Төслийг эхлүүлсний дараа та дараах хаягуудаар хандаж болно:

*   **Todo App:** `http://localhost:3000`
*   **Swagger UI:** `http://localhost:3000/swagger`

Swagger UI дээр та Todo API-ийн бүх маршрутуудыг (GET, POST, PUT, DELETE) харах, туршиж үзэх боломжтой болно.

---

Энэ баримт бичиг нь таны төслийг ойлгоход болон цаашид хөгжүүлэхэд тусална гэдэгт найдаж байна.
Хэрэв танд нэмэлт асуулт эсвэл өөрчлөлт хэрэгтэй бол надад мэдэгдээрэй.

[1 tool called]# simple_swagger_example
