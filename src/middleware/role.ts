import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/prisma'
import { TipoUsuario } from '@prisma/client'

export function requireRole(...roles: TipoUsuario[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id: req.userId! },
        select: { tipo: true, ativo: true },
      })

      if (!usuario?.ativo) {
        return res.status(403).json({ error: 'Conta inativa' })
      }

      if (!roles.includes(usuario.tipo)) {
        return res.status(403).json({ error: 'Sem permissão para esta ação' })
      }

      next()
    } catch {
      res.status(500).json({ error: 'Erro interno ao verificar permissão' })
    }
  }
}

export const GESTORES: TipoUsuario[] = ['ADMIN', 'PASTOR', 'LIDER', 'CO_LIDER']
export const ADMINS: TipoUsuario[] = ['ADMIN', 'PASTOR']
