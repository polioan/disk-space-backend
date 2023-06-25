declare namespace Express {
  interface Request {
    readonly user: {
      readonly id: import('@prisma/client').User['id']
    }
  }
}
