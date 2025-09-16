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
 *     responses:
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
