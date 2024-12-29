import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getWeekSummaryUseCase } from '../../use-cases/get-week-summary.use-case'

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async app => {
  app.get('/summary', () => {
    return getWeekSummaryUseCase()
  })
}
