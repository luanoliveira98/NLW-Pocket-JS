import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getWeekPendingGoalsUseCase } from '../../use-cases/get-weekly-pending-goals.use-case'

export const getPendingGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.get('/pending-goals', () => {
    return getWeekPendingGoalsUseCase()
  })
}
